import Hammer from 'hammerjs';

import { browserIsSafariDesktop, clamp, isMouseEvent, Writeable } from './utils';
import { ViewPortAnimator } from './ViewPortAnimator';

// 0,0 as top left of browser window to screenWidth, screenHeight as button right.
export type ClientPixelUnit = number;
// 0,0 as the top left pixel of the virtual space we want to render stuff in, increasing to the bottom right.
export type VirtualSpacePixelUnit = number;
// 2 means 2x zoomed in, 0.5 means 2x zoomed out.
export type ZoomFactor = number;

export interface PressEventCoordinates {
  readonly clientX: ClientPixelUnit;
  readonly clientY: ClientPixelUnit;
  readonly containerX: ClientPixelUnit;
  readonly containerY: ClientPixelUnit;
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

  private animator: ViewPortAnimator;
  private containerDiv: HTMLElement;
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
  private isCurrentPressBeingHandledAsNonPan: boolean;
  private options?: ViewPortOptions;

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

    // Set the div's styles
    this.containerDiv.style.cssText = ViewPort.DivStyle;

    // Setup other stuff
    this.animator = new ViewPortAnimator(this.updateBy);

    // Add event listeners
    // We use hammer for handling pinches and panning, and our own listeners for
    // everything else, including taps.

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
    // Press and tap almost do what we want, but not quite. See README.md for
    // more info.
    this.hammer.remove('press');
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

    // Set the real values (make sure this happens AFTER setting the css text
    // above)
    this.updateContainerSize();
  }

  public destroy(): void {
    this.animator.destroy();

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
    return clamp(value, minMax?.zoomFactorMin || 0.01, minMax?.zoomFactorMax || 10);
  };

  private getPressCoordinatesFromEvent = (e: MouseEvent | TouchEvent): PressEventCoordinates => {
    let clientX;
    let clientY;
    if (isMouseEvent(e)) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }
    const x = clientX * this.zoomFactor + this.left;
    const y = clientY * this.zoomFactor + this.top;
    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    const containerX = clientX - clientBoundingRect.left;
    const containerY = clientY - clientBoundingRect.top;
    return { x, y, clientX, clientY, containerX, containerY };
  };

  private handleContextMenu = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleContextMenu`);
    }
    this.options?.onPressContextMenu?.(e, this.getPressCoordinatesFromEvent(e));
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
    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    const pointerContainerX = this.currentDesktopSafariGestureState.startingCenterX - clientBoundingRect.left;
    const pointerContainerY = this.currentDesktopSafariGestureState.startingCenterY - clientBoundingRect.top;
    const dz = e.scale - this.currentDesktopSafariGestureState.scale;
    this.currentDesktopSafariGestureState.scale = e.scale;
    this.animator.updateBy(0, 0, dz, pointerContainerX, pointerContainerY, 'mouse');
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
    const pointerContainerX = e.center.x - clientBoundingRect.left;
    const pointerContainerY = e.center.y - clientBoundingRect.top;
    this.animator.updateBy(dx, dy, 0, pointerContainerX, pointerContainerY, e.pointerType);
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
    const pointerContainerX = e.center.x - clientBoundingRect.left;
    const pointerContainerY = e.center.y - clientBoundingRect.top;
    this.animator.updateBy(dx, dy, dz, pointerContainerX, pointerContainerY, e.pointerType);
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

  private handleMouseDown = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseDown`);
    }
    // e.buttons === 1 means the left/primary button is pressed and ONLY that
    if (e.buttons !== 1) {
      return;
    }
    this.isCurrentPressBeingHandledAsNonPan =
      this.options?.onPressStart?.(e, this.getPressCoordinatesFromEvent(e)) === 'CAPTURE';
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseMove (isCurrentPressCaptured: ${this.isCurrentPressBeingHandledAsNonPan})`);
    }
    if (this.isCurrentPressBeingHandledAsNonPan && this.options?.onPressMove) {
      if (this.options.onPressMove(e, this.getPressCoordinatesFromEvent(e)) === 'RELEASE') {
        this.isCurrentPressBeingHandledAsNonPan = false;
      }
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseUp`);
    }
    if (this.isCurrentPressBeingHandledAsNonPan && this.options?.onPressEnd) {
      this.options?.onPressEnd(e, this.getPressCoordinatesFromEvent(e));
    }
    this.isCurrentPressBeingHandledAsNonPan = false;
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) {
      if (this.isCurrentPressBeingHandledAsNonPan) {
        this.isCurrentPressBeingHandledAsNonPan = false;
        this.options?.onPressCancel?.(e);
        return;
      }
    }

    this.isCurrentPressBeingHandledAsNonPan =
      this.options?.onPressStart?.(e, this.getPressCoordinatesFromEvent(e)) === 'CAPTURE';
    if (this.isCurrentPressBeingHandledAsNonPan) {
      e.preventDefault();
    }
  };

  private handleTouchMove = (e: TouchEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleTouchMove`);
    }
    if (e.touches.length === 1) {
      if (this.isCurrentPressBeingHandledAsNonPan && this.options?.onPressMove) {
        if (this.options?.onPressMove(e, this.getPressCoordinatesFromEvent(e)) === 'RELEASE') {
          this.isCurrentPressBeingHandledAsNonPan = false;
        }
      }
    }
  };

  private handleTouchEnd = (e: TouchEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleTouchEnd`);
    }
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      if (this.isCurrentPressBeingHandledAsNonPan && this.options?.onPressEnd) {
        this.options?.onPressEnd(e, this.getPressCoordinatesFromEvent(e));
      }

      if (this.isCurrentPressBeingHandledAsNonPan) {
        this.isCurrentPressBeingHandledAsNonPan = false;
      }
    }
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
    const pointerContainerX = e.clientX - clientBoundingRect.left;
    const pointerContainerY = e.clientY - clientBoundingRect.top;
    // Vertical scroll is doing to be interpreted by us as changing z
    this.animator.updateBy(0, 0, e.deltaY * scale, pointerContainerX, pointerContainerY, 'wheel');
  };

  private updateBy = (
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dz: ClientPixelUnit,
    pointerContainerX: ClientPixelUnit,
    pointerContainerY: ClientPixelUnit,
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
      zoomFactor = this.clampZoomFactor(zoomFactor, this.options);
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
    const xFocusPercent = pointerContainerX / this.containerWidth;
    const yFocusPercent = pointerContainerY / this.containerHeight;

    writableThis.left = virtualSpaceCenterX - virtualSpaceVisibleWidthDelta * xFocusPercent;
    writableThis.top = virtualSpaceCenterY - virtualSpaceVisibleHeightDelta * yFocusPercent;
    writableThis.centerX = virtualSpaceCenterX + this.width / 2;
    writableThis.centerY = virtualSpaceCenterY + this.height / 2;

    this.options?.onUpdated?.();
  };
}
