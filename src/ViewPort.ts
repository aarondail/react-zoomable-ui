import Hammer from 'hammerjs';

import { browserIsSafariDesktop, clamp, Writeable } from './utils';

// 0,0 as top left of browser window to screenWidth, screenHeight as button right.
export type ClientPixelUnit = number;
// 0,0 as the top left pixel of the virtual space we want to render stuff in, increasing to the bottom right.
export type VirtualSpacePixelUnit = number;
// 2 means 2x zoomed in, 0.5 means 2x zoomed out.
export type ZoomFactor = number;

export interface PressEventCoordinates {
  readonly clientX: ClientPixelUnit;
  readonly clientY: ClientPixelUnit;
  readonly x: VirtualSpacePixelUnit;
  readonly y: VirtualSpacePixelUnit;
}

export interface ZoomFactorMinMaxOptions {
  readonly zoomFactorMax?: ZoomFactor;
  readonly zoomFactorMin?: ZoomFactor;
}

export interface ViewPortOptions extends ZoomFactorMinMaxOptions {
  readonly debugEvents?: boolean;

  readonly onUpdated?: () => void;

  readonly onPressStart?: (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates) => 'CAPTURE' | undefined;
  readonly onPressMove?: (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates) => 'RELEASE' | undefined;
  readonly onPressEnd?: (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates) => void;
  /**
   * After a press starts there are some cases where it can be canceled rather
   * than ended. For example when on finger starts touching the screen that
   * will trigger `onPressStart`. If a second finger starts touching the screen
   * though, that will cause the press to be "cancelled". A press is
   * effectively a single finger touch or mouse/track-pad click and drag
   * motion.
   */
  readonly onPressCancel?: (e: MouseEvent | TouchEvent) => void;
  // readonly onHover?: (e: MouseEvent, coordinates: PressEventCoordinates) => void;
  readonly onPressContextMenu?: (e: MouseEvent, coordinates: PressEventCoordinates) => void;
}

/**
 * The ViewPort represents a "view" into a virtual space, that is not
 * tied to the available screen space or HTML elements. Because of this, it is
 * infinite, but it also uses its own "units" (virtual space pixels).
 *
 * You can think of the view port as describing what rectangular portion of the
 * virtual space (from top left to bottom right) should be visible inside the
 * bounds of containing HTML element where the virtual space is being rendered.
 */
export class ViewPort {
  private static DivStyle = `
    overflow: hidden;
    margin: 0; padding: 0; height: 100%; width: 100%;
    position: relative;
    `;

  // While these public properties APPEAR readonly they are in fact NOT. They
  // are just readonly for consumer's of this class.
  public readonly containerWidth: ClientPixelUnit;
  public readonly containerHeight: ClientPixelUnit;
  public readonly centerX: VirtualSpacePixelUnit;
  public readonly centerY: VirtualSpacePixelUnit;
  public readonly left: VirtualSpacePixelUnit;
  public readonly top: VirtualSpacePixelUnit;
  public readonly width: VirtualSpacePixelUnit;
  public readonly height: VirtualSpacePixelUnit;
  public readonly zoomFactor: ZoomFactor; // E.g. 2 is zoomed in, 1 is exactly at pixel perfect match to images, and 0.5 is zoomed out.

  private animationFrameId: number;
  private containerDiv: HTMLElement;
  private isCurrentPressBeingHandledAsNonPan: boolean;
  private currentHammerGestureState?: {
    deltaX: number;
    deltaY: number;
    scale?: number;
  };
  private currentDesktopSafariGestureState?: {
    startingCenterX: ClientPixelUnit;
    startingCenterY: ClientPixelUnit;
    scale: ZoomFactor;
  };
  private hammer: HammerManager;
  private options?: ViewPortOptions;
  private pendingUpdateForSmoothUpdates: {
    updateNeeded: boolean;
    dx: VirtualSpacePixelUnit;
    dy: VirtualSpacePixelUnit;
    dz: VirtualSpacePixelUnit;
    pointerClientX: ClientPixelUnit;
    pointerClientY: ClientPixelUnit;
    type: string;
  };

  constructor(containerDiv: HTMLDivElement, options?: ViewPortOptions) {
    this.containerDiv = containerDiv;
    this.options = options;

    // Default values
    this.left = 0;
    this.top = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.width = 0;
    this.height = 0;
    this.zoomFactor = 1;
    this.containerWidth = 0;
    this.containerHeight = 0;
    this.isCurrentPressBeingHandledAsNonPan = false;
    this.pendingUpdateForSmoothUpdates = {
      updateNeeded: false,
      dx: 0,
      dy: 0,
      dz: 0,
      pointerClientX: 0,
      pointerClientY: 0,
      type: '',
    };

    // Set the div's styles
    this.containerDiv.style.cssText = ViewPort.DivStyle;

    // Add event listeners
    this.containerDiv.addEventListener('mousedown', this.handleMouseDown);
    this.containerDiv.addEventListener('mousemove', this.handleMouseMove);
    // Doing this on window to catch it if it goes outside the window
    window.addEventListener('mouseup', this.handleMouseUp);
    this.containerDiv.addEventListener('touchstart', this.handleTouchStart);
    this.containerDiv.addEventListener('touchmove', this.handleTouchMove);
    this.containerDiv.addEventListener('touchend', this.handleTouchEnd);
    this.containerDiv.addEventListener('contextmenu', this.handleContextMenu);

    // There is no good way to detect whether an individual element is
    // resized. We can only do that at the window level. There are some
    // techniques for tracking element sizes, and we provide an OPTIONAL
    // polling based technique. But since watching for window resizes WILL
    // work for many use cases we do that here, and it shouldn't interfere
    // with any more specific techniques.
    window.addEventListener('resize', this.updateContainerSize);

    this.containerDiv.addEventListener('wheel', this.handleWheel);

    if (browserIsSafariDesktop) {
      this.containerDiv.addEventListener('gesturestart', this.handleGestureStartForDesktopSafari);
      this.containerDiv.addEventListener('gesturechange', this.handleGestureChangeForDesktopSafari);
      this.containerDiv.addEventListener('gestureend', this.handleGestureEndForDesktopSafari);
    }

    // Set up the pan-zoom library
    // this.panZoomControl = panzoom(this.containerDiv, this.handlePanZoomEvent);
    this.hammer = new Hammer(this.containerDiv, {});
    // Press is almost what we want, but the order of press and press up events
    // is non-deterministic and if a pan starts it kills the press (wont get
    // press up) and sometimes when a pan starts we won't even get the press.
    // This all ends up meaning its easier to handle presses with our own event
    // handlers on the mouse and touch events.
    this.hammer.remove('press');
    // Tap happens after you release, so its also not what we want (still need
    // to know about the press when it starts, so we have the same problems as
    // above)
    this.hammer.remove('tap');

    this.hammer.get('pinch').set({ enable: true });
    this.hammer.get('pan').set({ threshold: 0, direction: Hammer.DIRECTION_ALL });

    this.hammer.on('panstart', this.handleHammerPanStart);
    this.hammer.on('panmove', this.handleHammerPanMove);
    this.hammer.on('panend', this.handleHammerPanEnd);
    this.hammer.on('pancancel', this.handleHammerPanCancel);

    this.hammer.on('pinchstart', this.handleHammerPinchStart);
    this.hammer.on('pinchmove', this.handleHammerPinchMove);
    this.hammer.on('pinchend', this.handleHammerPinchEnd);
    this.hammer.on('pinchcancel', this.handleHammerPinchCancel);

    this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);

    this.updateContainerSize();
  }

  public destroy(): void {
    this.containerDiv.removeEventListener('mousedown', this.handleMouseDown);
    this.containerDiv.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.containerDiv.removeEventListener('touchstart', this.handleTouchStart);
    this.containerDiv.removeEventListener('touchmove', this.handleTouchMove);
    this.containerDiv.removeEventListener('touchend', this.handleTouchEnd);
    this.containerDiv.removeEventListener('contextmenu', this.handleContextMenu);
    window.removeEventListener('resize', this.updateContainerSize);
    this.containerDiv.removeEventListener('wheel', this.handleWheel);

    if (browserIsSafariDesktop) {
      // We have to handle the pinch gesture manually on desktop Safari
      this.containerDiv.removeEventListener('gesturestart', this.handleGestureStartForDesktopSafari);
      this.containerDiv.removeEventListener('gesturechange', this.handleGestureChangeForDesktopSafari);
      this.containerDiv.removeEventListener('gestureend', this.handleGestureEndForDesktopSafari);
    }

    this.hammer.destroy();

    cancelAnimationFrame(this.animationFrameId);
  }

  public centerFitAreaIntoView(
    left: VirtualSpacePixelUnit,
    top: VirtualSpacePixelUnit,
    width: VirtualSpacePixelUnit,
    height: VirtualSpacePixelUnit,
    options?: ZoomFactorMinMaxOptions,
  ): void {
    const cx = left + width / 2;
    const cy = top + height / 2;
    const zoomFactorBasedOnWidth = this.containerWidth / width;
    const zoomFactorBasedOnHeight = this.containerHeight / height;
    let newZoomFactor = Math.min(zoomFactorBasedOnWidth, zoomFactorBasedOnHeight);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, options);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
    this.recenterView(cx, cy, newZoomFactor);
  }

  public centerFitHorizontalAreaIntoView(
    left: VirtualSpacePixelUnit,
    width: VirtualSpacePixelUnit,
    options?: ZoomFactorMinMaxOptions,
  ): void {
    const cx = left + width / 2;
    let newZoomFactor = this.containerWidth / width;
    newZoomFactor = this.clampZoomFactor(newZoomFactor, options);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
    this.updateViewTopLeft(cx - this.width / newZoomFactor / 2, this.top, newZoomFactor);
  }

  public recenterView(
    centerX: VirtualSpacePixelUnit,
    centerY: VirtualSpacePixelUnit,
    newZoomFactor?: ZoomFactor,
  ): void {
    const writableThis = this as Writeable<ViewPort>;
    if (newZoomFactor !== undefined) {
      writableThis.zoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
    }
    writableThis.width = this.containerWidth / this.zoomFactor;
    writableThis.height = this.containerHeight / this.zoomFactor;
    writableThis.centerX = centerX;
    writableThis.centerY = centerY;
    writableThis.left = centerX - this.width / 2;
    writableThis.top = centerY - this.height / 2;

    this.options?.onUpdated?.();
  }

  public updateViewTopLeft(left: VirtualSpacePixelUnit, top: VirtualSpacePixelUnit, newZoomFactor?: ZoomFactor): void {
    const writableThis = this as Writeable<ViewPort>;
    if (newZoomFactor !== undefined) {
      writableThis.zoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
    }
    writableThis.width = this.containerWidth / this.zoomFactor;
    writableThis.height = this.containerHeight / this.zoomFactor;
    writableThis.centerX = left + this.width / 2;
    writableThis.centerY = top + this.height / 2;
    writableThis.left = left;
    writableThis.top = top;

    this.options?.onUpdated?.();
  }

  /**
   * This should be used when the container div is resized.  By default resizes due
   * to the window itself resizing will be automatically handled, but any other
   * resizes won't be handled (since there isn't a good way to get notified when
   * the div resizes.
   */
  public updateContainerSize = () => {
    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    const { width, height } = clientBoundingRect;
    if (width === this.containerWidth && height === this.containerHeight) {
      return;
    }

    const writableThis = this as Writeable<ViewPort>;
    writableThis.containerWidth = width;
    writableThis.containerHeight = height;
    writableThis.width = this.containerWidth / this.zoomFactor;
    writableThis.height = this.containerHeight / this.zoomFactor;
    // Keep focus on the top left
    writableThis.centerX = this.left + this.width / 2;
    writableThis.centerY = this.top + this.width / 2;

    this.options?.onUpdated?.();
  };

  private clampZoomFactor = (value: ZoomFactor, minMax?: ZoomFactorMinMaxOptions) => {
    if (!minMax) {
      return value;
    }
    let v = value;
    if (minMax && minMax.zoomFactorMin && v < minMax.zoomFactorMin) {
      v = minMax.zoomFactorMin;
    }
    if (minMax && minMax.zoomFactorMax && v > minMax.zoomFactorMax) {
      v = minMax.zoomFactorMax;
    }
    return v;
  };

  private handleAnimationFrame = (time: number) => {
    // var progress = time - (this.priorTimestamp || time);
    // this.priorTimestamp = time;
    this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);

    if (this.pendingUpdateForSmoothUpdates.updateNeeded) {
      this.updateBy(
        this.pendingUpdateForSmoothUpdates.dx,
        this.pendingUpdateForSmoothUpdates.dy,
        this.pendingUpdateForSmoothUpdates.dz,
        this.pendingUpdateForSmoothUpdates.pointerClientX,
        this.pendingUpdateForSmoothUpdates.pointerClientY,
        this.pendingUpdateForSmoothUpdates.type,
      );
      this.pendingUpdateForSmoothUpdates.updateNeeded = false;
    }
  };

  private handleContextMenu = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleContextMenu`);
    }
    const clientX = e.clientX;
    const clientY = e.clientY;
    const x = clientX * this.zoomFactor + this.left;
    const y = clientY * this.zoomFactor + this.top;
    this.options?.onPressContextMenu?.(e, { x, y, clientX, clientY });
  };

  private handleGestureStartForDesktopSafari = (e: any) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleGestureStartForDesktopSafari`);
    }
    e.preventDefault();

    this.currentDesktopSafariGestureState = {
      startingCenterX: e.clientX,
      startingCenterY: e.clientY,
      scale: e.scale,
    };
  };

  private handleGestureChangeForDesktopSafari = (e: any) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleGestureChangeForDesktopSafari`);
    }
    e.preventDefault();
    if (!this.currentDesktopSafariGestureState) {
      return;
    }
    const x = this.currentDesktopSafariGestureState.startingCenterX;
    const y = this.currentDesktopSafariGestureState.startingCenterY;
    const dz = e.scale - this.currentDesktopSafariGestureState.scale;
    this.currentDesktopSafariGestureState.scale = e.scale;
    this.updateBySmoothly(0, 0, dz, x, y, 'mouse');
  };

  private handleGestureEndForDesktopSafari = (e: any) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleGestureEndForDesktopSafari`);
    }
    e.preventDefault();
    this.currentDesktopSafariGestureState = undefined;
  };

  private handleHammerPanStart = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPanStart`);
    }
    this.currentHammerGestureState = undefined;
  };

  private handleHammerPanMove = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPanMove`);
    }

    if (this.currentHammerGestureState === undefined) {
      this.currentHammerGestureState = {
        deltaX: 0,
        deltaY: 0,
        scale: undefined,
      };
    }

    const dx = e.deltaX - this.currentHammerGestureState.deltaX;
    const dy = e.deltaY - this.currentHammerGestureState.deltaY;
    this.currentHammerGestureState.deltaX = e.deltaX;
    this.currentHammerGestureState.deltaY = e.deltaY;

    if (this.isCurrentPressBeingHandledAsNonPan) {
      return;
    }
    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    this.updateBySmoothly(
      dx,
      dy,
      0,
      e.center.x - clientBoundingRect.left,
      e.center.y - clientBoundingRect.top,
      e.pointerType,
    );
  };

  private handleHammerPanEnd = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPanEnd`);
    }
    this.currentHammerGestureState = undefined;
  };

  private handleHammerPanCancel = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPanCancel`);
    }
    this.currentHammerGestureState = undefined;
  };

  private handleHammerPinchStart = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPinchStart`);
    }
    this.currentHammerGestureState = undefined;
  };

  private handleHammerPinchMove = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPinchMove`);
    }

    if (this.currentHammerGestureState === undefined) {
      this.currentHammerGestureState = {
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        scale: e.scale,
      };
    }

    const dx = e.deltaX - this.currentHammerGestureState.deltaX;
    const dy = e.deltaY - this.currentHammerGestureState.deltaY;
    const dz = e.scale - (this.currentHammerGestureState.scale || e.scale);

    this.currentHammerGestureState.deltaX = e.deltaX;
    this.currentHammerGestureState.deltaY = e.deltaY;
    this.currentHammerGestureState.scale = e.scale;

    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    this.updateBySmoothly(
      dx,
      dy,
      dz,
      e.center.x - clientBoundingRect.left,
      e.center.y - clientBoundingRect.top,
      e.pointerType,
    );
  };

  private handleHammerPinchEnd = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPinchEnd`);
    }
    this.currentHammerGestureState = undefined;
  };

  private handleHammerPinchCancel = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPinchCancel`);
    }
    this.currentHammerGestureState = undefined;
  };

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    let scale = 1;
    switch (e.deltaMode) {
      case 1: // DOM_DELTA_LINE
        scale = 7.15625; // Line height total guesstimate from `to-px` (looking up their const for 'ex')
        break;
      case 2: // DOM_DELTA_PAGE
        scale = window.innerHeight;
        break;
    }
    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    this.updateBy(
      0,
      0,
      e.deltaY * scale, // Vertical scroll is doing to be interpreted by us as delta z
      e.clientX - clientBoundingRect.left,
      e.clientY - clientBoundingRect.top,
      'wheel',
    );
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseDown: ` + e.buttons);
    }

    // e.buttons === 1 means the left/primary button is pressed and ONLY that
    if (e.buttons !== 1) {
      return;
    }

    let captured = false;
    if (this.options?.onPressStart) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const x = clientX * this.zoomFactor + this.left;
      const y = clientY * this.zoomFactor + this.top;
      if (this.options?.onPressStart(e, { x, y, clientX, clientY }) === 'CAPTURE') {
        this.isCurrentPressBeingHandledAsNonPan = true;
        captured = true;
      }
    }

    // Just in case we have a lingering capture
    if (!captured && this.isCurrentPressBeingHandledAsNonPan) {
      this.isCurrentPressBeingHandledAsNonPan = false;
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseMove (isCurrentPressCaptured: ${this.isCurrentPressBeingHandledAsNonPan})`);
    }
    if (this.isCurrentPressBeingHandledAsNonPan && this.options?.onPressMove) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const x = clientX * this.zoomFactor + this.left;
      const y = clientY * this.zoomFactor + this.top;
      if (this.options?.onPressMove(e, { x, y, clientX, clientY }) === 'RELEASE') {
        this.isCurrentPressBeingHandledAsNonPan = false;
      }
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseUp`);
    }
    if (this.isCurrentPressBeingHandledAsNonPan && this.options?.onPressEnd) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const x = clientX * this.zoomFactor + this.left;
      const y = clientY * this.zoomFactor + this.top;
      this.options?.onPressEnd(e, { x, y, clientX, clientY });
    }

    if (this.isCurrentPressBeingHandledAsNonPan) {
      this.isCurrentPressBeingHandledAsNonPan = false;
    }
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleTouchStart`);
    }
    if (e.touches.length === 1) {
      let captured = false;
      if (this.options?.onPressStart) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const x = clientX * this.zoomFactor + this.left;
        const y = clientY * this.zoomFactor + this.top;
        if (this.options?.onPressStart(e, { x, y, clientX, clientY }) === 'CAPTURE') {
          e.preventDefault();
          this.isCurrentPressBeingHandledAsNonPan = true;
          captured = true;
        }
      }

      // Just in case we have a lingering capture
      if (!captured && this.isCurrentPressBeingHandledAsNonPan) {
        this.isCurrentPressBeingHandledAsNonPan = false;
      }
    } else if (e.touches.length >= 1 && this.isCurrentPressBeingHandledAsNonPan) {
      // If we detect a second finger touching the screen while a press is
      // captured...
      this.isCurrentPressBeingHandledAsNonPan = false;
      this.options?.onPressCancel?.(e);
    }
  };

  // tslint:disable-next-line: no-empty
  private handleTouchMove = (e: TouchEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleTouchMove`);
    }
    if (e.touches.length === 1) {
      if (this.isCurrentPressBeingHandledAsNonPan && this.options?.onPressMove) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const x = clientX * this.zoomFactor + this.left;
        const y = clientY * this.zoomFactor + this.top;
        if (this.options?.onPressMove(e, { x, y, clientX, clientY }) === 'RELEASE') {
          this.isCurrentPressBeingHandledAsNonPan = false;
        }
      }
    }
  };

  // tslint:disable-next-line: no-empty
  private handleTouchEnd = (e: TouchEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleTouchEnd`);
    }
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      if (this.isCurrentPressBeingHandledAsNonPan && this.options?.onPressEnd) {
        const clientX = e.changedTouches[0].clientX;
        const clientY = e.changedTouches[0].clientY;
        const x = clientX * this.zoomFactor + this.left;
        const y = clientY * this.zoomFactor + this.top;
        this.options?.onPressEnd(e, { x, y, clientX, clientY });
      }

      if (this.isCurrentPressBeingHandledAsNonPan) {
        this.isCurrentPressBeingHandledAsNonPan = false;
      }
    }
  };

  private updateBySmoothly = (
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dz: ClientPixelUnit,
    pointerClientX: ClientPixelUnit,
    pointerClientY: ClientPixelUnit,
    type: string,
  ) => {
    if (this.pendingUpdateForSmoothUpdates.updateNeeded === false) {
      this.pendingUpdateForSmoothUpdates.dx = dx;
      this.pendingUpdateForSmoothUpdates.dy = dy;
      this.pendingUpdateForSmoothUpdates.dz = dz;
      this.pendingUpdateForSmoothUpdates.pointerClientX = pointerClientX;
      this.pendingUpdateForSmoothUpdates.pointerClientY = pointerClientY;
      this.pendingUpdateForSmoothUpdates.type = type;
      this.pendingUpdateForSmoothUpdates.updateNeeded = true;
    } else {
      if (this.pendingUpdateForSmoothUpdates.type !== type && this.pendingUpdateForSmoothUpdates.type !== '') {
        this.updateBy(
          this.pendingUpdateForSmoothUpdates.dx,
          this.pendingUpdateForSmoothUpdates.dy,
          this.pendingUpdateForSmoothUpdates.dz,
          this.pendingUpdateForSmoothUpdates.pointerClientX,
          this.pendingUpdateForSmoothUpdates.pointerClientY,
          this.pendingUpdateForSmoothUpdates.type,
        );
        this.pendingUpdateForSmoothUpdates.updateNeeded = false;
        this.updateBySmoothly(dx, dy, dz, pointerClientX, pointerClientY, type);
        return;
      } else {
        this.pendingUpdateForSmoothUpdates.dx += dx;
        this.pendingUpdateForSmoothUpdates.dy += dy;
        this.pendingUpdateForSmoothUpdates.dz += dz;
        this.pendingUpdateForSmoothUpdates.pointerClientX = pointerClientX;
        this.pendingUpdateForSmoothUpdates.pointerClientY = pointerClientY;
      }
    }
  };

  private updateBy = (
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dz: ClientPixelUnit,
    pointerClientX: ClientPixelUnit,
    pointerClientY: ClientPixelUnit,
    type: string,
  ) => {
    const writableThis = this as Writeable<ViewPort>;

    let zoomFactor = this.zoomFactor;
    if (dz !== 0) {
      // tslint:disable-next-line: prefer-conditional-expression
      if (type === 'wheel') {
        // In the wheel case this makes the zoom feel more like its going at a
        // linear speed.
        zoomFactor = (this.containerHeight * this.zoomFactor) / (this.containerHeight + dz * 2);
      } else {
        // It feels too fast if we don't divide by two... some hammer.js issue?
        zoomFactor = zoomFactor + dz / 2;
      }
      zoomFactor = clamp(zoomFactor, this.options?.zoomFactorMin || 0.01, this.options?.zoomFactorMax || 10);
    }

    let virtualSpaceCenterX: VirtualSpacePixelUnit;
    let virtualSpaceCenterY: VirtualSpacePixelUnit;

    // Basic pan handling
    virtualSpaceCenterX = this.left + (-1 * dx) / zoomFactor;
    virtualSpaceCenterY = this.top + (-1 * dy) / zoomFactor;

    // Zoom BUT keep the view coordinate under the mouse pointer CONSTANT
    const oldVirtualSpaceVisibleSpaceWidth = this.containerWidth / this.zoomFactor;
    const oldVirtualSpaceVisibleSpaceHeight = this.containerHeight / this.zoomFactor;
    writableThis.width = this.containerWidth / zoomFactor;
    writableThis.height = this.containerHeight / zoomFactor;
    writableThis.zoomFactor = zoomFactor;

    const virtualSpaceVisibleWidthDelta = this.width - oldVirtualSpaceVisibleSpaceWidth;
    const virtualSpaceVisibleHeightDelta = this.height - oldVirtualSpaceVisibleSpaceHeight;

    // The reason we use x and y here is to zoom in or out towards where the
    // pointer is positioned
    const xFocusPercent = pointerClientX / this.containerWidth;
    const yFocusPercent = pointerClientY / this.containerHeight;

    writableThis.left = virtualSpaceCenterX - virtualSpaceVisibleWidthDelta * xFocusPercent;
    writableThis.top = virtualSpaceCenterY - virtualSpaceVisibleHeightDelta * yFocusPercent;
    writableThis.centerX = virtualSpaceCenterX + this.width / 2;
    writableThis.centerY = virtualSpaceCenterY + this.height / 2;

    this.options?.onUpdated?.();
  };
}
