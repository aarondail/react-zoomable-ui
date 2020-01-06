// tslint:disable-next-line: no-implicit-dependencies - Disable this until we get our changes merged into pan-zoom
// import panzoom, { PanZoomControl, PanZoomEvent } from 'pan-zoom';

import Hammer from 'hammerjs';

// TODO pinch
// TODO mouse wheel

import { clamp, Writeable, browserIsSafariMobile, browserIsSafari } from './utils';

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
  readonly onPressCancelled?: (e: MouseEvent | TouchEvent) => void;
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

  //   ${/* Prevent the user from highlighting while dragging */ ''}
  //   -webkit-user-select: none;
  //   ${/* Prevent Mobile Safari from handling long press on images itself */ ''}
  //   -webkit-touch-callout: none;
  //   user-select: none;
  //   ${/* Prevent the user from getting a text input box cursor when hovering over text that can be dragged */ ''}
  //   cursor: default;
  //   ${
  //     /* Touch gestures on edge are not currently working totally correctly.
  //   Turning this off means, I think, we have to support them, which we mostly
  //   do ... or at least want to... but don't for things like pinch. Turning it
  //   off for now, will wait on edge to move to Chrome and revisit. */ ''
  //   }
  //   -ms-touch-action: none;
  // `;

  // While these public properties APPEAR readonly they are in fact NOT. They
  // are just readonly for consumer's of this class.
  public readonly left: VirtualSpacePixelUnit;
  public readonly top: VirtualSpacePixelUnit;
  public readonly centerX: VirtualSpacePixelUnit;
  public readonly centerY: VirtualSpacePixelUnit;
  public readonly width: VirtualSpacePixelUnit;
  public readonly height: VirtualSpacePixelUnit;
  public readonly zoomFactor: ZoomFactor; // E.g. 2 is zoomed in, 1 is exactly at pixel perfect match to images, and 0.5 is zoomed out.

  public readonly containerWidth: ClientPixelUnit;
  public readonly containerHeight: ClientPixelUnit;

  private containerDiv: HTMLElement;
  private isCurrentPressCaptured: boolean;
  // private panZoomControl: PanZoomControl;
  private hammer: HammerManager;
  private options?: ViewPortOptions;
  // tslint:disable-next-line:readonly-array
  private updateListeners: Array<() => void>;

  private animationFrameId: number;

  constructor(containerDiv: HTMLDivElement, options?: ViewPortOptions) {
    this.containerDiv = containerDiv;
    this.options = options;
    this.updateListeners = [];

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
    this.isCurrentPressCaptured = false;

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

    // Set up the pan-zoom library
    // this.panZoomControl = panzoom(this.containerDiv, this.handlePanZoomEvent);
    this.hammer = new Hammer(this.containerDiv, {});
    // Press is almost what we want, but the order of press and press up events
    // is weird if the time is 0 on mobile chrome (maybe time could be > 0?) and
    // if a pan starts it kills the press (wont get press up) but we want to
    // make that configurable.
    this.hammer.remove('press');
    // this.hammer.get('press').set({ time: 0, });
    // Also 
    this.hammer.remove('tap');

    this.hammer.get('pinch').set({ enable: true });
    this.hammer.get('pan').set({ threshold: 0, direction: Hammer.DIRECTION_ALL });
    // this.hammer.get('tap').set({ interval: 0, time:  });
    this.hammer.on('pinchstart', this.handleHammerPinchStart);
    this.hammer.on('pinchmove', this.handleHammerPinchMove);
    this.hammer.on('panstart', this.handleHammerPanStart);
    this.hammer.on('panmove', this.handleHammerPanMove);

    // this.hammer.on('pressup', () => console.log('hammerPressUp'));
    // this.hammer.on('press', () => console.log('hammerPress'));

    // this.hammer.on('pan', this.handleHammerPan);

    this.containerDiv.addEventListener('wheel', this.handleWheel);

    // Im not sure what the deal is but for Safari both desktop and mobile we
    // have to preventDefault() these gesture events. Note that for desktop
    // Safari the touch-pinch library doesn't handle pinching and zooming (it
    // does seem to work for mobile safari though). It does seem to work on
    // mobile Safari though (if we suppress these events).
    this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);

    if (browserIsSafari) {
      this.containerDiv.addEventListener('gesturestart', this.handleGestureStartForSafari);
      this.containerDiv.addEventListener('gesturechange', this.handleGestureChangeForSafari);
      this.containerDiv.addEventListener('gestureend', this.handleGestureEndForSafari);
    }

    this.updateContainerSize();
  }

  public addEventListener(event: 'updated', listener: () => void): void {
    this.updateListeners.push(listener);
  }

  public removeEventListener(event: 'updated', listener: () => void): void {
    const index = this.updateListeners.indexOf(listener);
    if (index >= 0) {
      this.updateListeners.splice(index, 1);
    }
  }

  public destroy(): void {
    // this.panZoomControl.destroy();
    this.hammer.destroy();

    this.containerDiv.removeEventListener('mousedown', this.handleMouseDown);
    this.containerDiv.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.containerDiv.removeEventListener('touchstart', this.handleTouchStart);
    this.containerDiv.removeEventListener('touchmove', this.handleTouchMove);
    this.containerDiv.removeEventListener('touchend', this.handleTouchEnd);
    this.containerDiv.removeEventListener('contextmenu', this.handleContextMenu);
    window.removeEventListener('resize', this.updateContainerSize);

    cancelAnimationFrame(this.animationFrameId);

    if (browserIsSafari) {
      this.containerDiv.removeEventListener('gesturestart', this.handleGestureStartForSafari);
      this.containerDiv.removeEventListener('gesturechange', this.handleGestureChangeForSafari);
      this.containerDiv.removeEventListener('gestureend', this.handleGestureEndForSafari);
    }
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

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
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

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
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

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
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

  // private priorTimestamp?: number;
  private updateCounter: number = 0;
  private handleAnimationFrame = (time: number) => {
    // var progress = time - (this.priorTimestamp || time);
    // this.priorTimestamp = time;
    this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
    this.updateCounter = 0;

    if (!this.tracker.processed) {
      this.updateBy(
        this.tracker.dx,
        this.tracker.dy,
        this.tracker.dz,
        this.tracker.pointerClientX,
        this.tracker.pointerClientY,
        this.tracker.type,
      );
      this.tracker.processed = true;
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

  private safariGestureEventHandlingState: any;
  private handleGestureStartForSafari = (e: any) => {
    e.preventDefault();

    if (browserIsSafariMobile) {
      // No need to do anything else, the touch-pinch library will handle
      // the punch by listening to the touch events
      return;
    }

    this.safariGestureEventHandlingState = {
      startX: e.pageX,
      startY: e.pageY,
      scale: e.scale,
    };
  };

  private handleGestureChangeForSafari = (e: any) => {
    e.preventDefault();

    if (browserIsSafariMobile) {
      // No need to do anything else, the touch-pinch library will handle
      // the punch by listening to the touch events
      return;
    }

    var scaleDiff = this.safariGestureEventHandlingState.scale - e.scale;
    this.safariGestureEventHandlingState.scale = e.scale;

    var dz = scaleDiff; // 100 seems to make this feel good
    var x = this.safariGestureEventHandlingState.startX;
    var y = this.safariGestureEventHandlingState.startY;

    this.updateBySmoothly(0, 0, dz, x, y, 'mouse');
  };

  private handleGestureEndForSafari = (e: any) => {
    e.preventDefault();
  };

  // tslint:disable-next-line: member-ordering
  private hammerStart?: any;

  private handleHammerPanStart = (e: HammerInput) => {
    console.log('handleHammerPanStart ');
    // console.log(e);
    this.hammerStart = undefined;
  };

  private handleHammerPanMove = (e: HammerInput) => {
    console.log('handleHammerPanMove');
    const dx = e.deltaX - (this.hammerStart?.x || 0);
    const dy = e.deltaY - (this.hammerStart?.y || 0);
    this.hammerStart = { x: e.deltaX, y: e.deltaY };

    if (this.isCurrentPressCaptured) {
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
    // console.log('handleHammerPan');
  };

  // tslint:disable: member-ordering
  // @ts-ignore
  private hammerStartP?: any;

  private handleHammerPinchStart = (e: HammerInput) => {
    console.log('handleHammerPinchStart ');
    // console.log(e);
    this.hammerStartP = undefined;
  };

  private handleHammerPinchMove = (e: HammerInput) => {
    console.log('handleHammerPinchMove');
    const dx = e.deltaX - (this.hammerStartP?.x || e.deltaX);
    const dy = e.deltaY - (this.hammerStartP?.y || e.deltaY);
    const dz = e.scale - (this.hammerStartP?.scale || e.scale);
    this.hammerStartP = { x: e.deltaX, y: e.deltaY, scale: e.scale };
    // console.log(e);
    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    this.updateBySmoothly(dx, dy, dz, e.center.x - clientBoundingRect.left, e.center.y - clientBoundingRect.top, e.pointerType);
    // console.log('handleHammerPan');
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
        // this.panZoomControl.pausePanning();
        this.isCurrentPressCaptured = true;
        captured = true;
      }
    }

    // Just in case we have a lingering capture
    if (!captured && this.isCurrentPressCaptured) {
      // TODO
      // this.panZoomControl.resumePanning();
      this.isCurrentPressCaptured = false;
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseMove (isCurrentPressCaptured: ${this.isCurrentPressCaptured})`);
    }
    if (this.isCurrentPressCaptured && this.options?.onPressMove) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const x = clientX * this.zoomFactor + this.left;
      const y = clientY * this.zoomFactor + this.top;
      if (this.options?.onPressMove(e, { x, y, clientX, clientY }) === 'RELEASE') {
        // TODO
        // this.panZoomControl.resumePanning();
        this.isCurrentPressCaptured = false;
      }
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseUp`);
    }
    if (this.isCurrentPressCaptured && this.options?.onPressEnd) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const x = clientX * this.zoomFactor + this.left;
      const y = clientY * this.zoomFactor + this.top;
      this.options?.onPressEnd(e, { x, y, clientX, clientY });
    }

    if (this.isCurrentPressCaptured) {
      // TODO
      // this.panZoomControl.resumePanning(true);
      this.isCurrentPressCaptured = false;
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
          // TODO
          // this.panZoomControl.pausePanning();
          this.isCurrentPressCaptured = true;
          captured = true;
        }
      }

      // Just in case we have a lingering capture
      if (!captured && this.isCurrentPressCaptured) {
        // TODO
        // this.panZoomControl.resumePanning();
        this.isCurrentPressCaptured = false;
      }
    } else if (e.touches.length >= 1 && this.isCurrentPressCaptured) {
      // If we detect a second finger touching the screen while a press is
      // captured...
      // TODO
      // this.panZoomControl.resumePanning();
      this.isCurrentPressCaptured = false;
      this.options?.onPressCancelled?.(e);
    }
  };

  // tslint:disable-next-line: no-empty
  private handleTouchMove = (e: TouchEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleTouchMove`);
    }
    if (e.touches.length === 1) {
      if (this.isCurrentPressCaptured && this.options?.onPressMove) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const x = clientX * this.zoomFactor + this.left;
        const y = clientY * this.zoomFactor + this.top;
        if (this.options?.onPressMove(e, { x, y, clientX, clientY }) === 'RELEASE') {
          // TODO
          // this.panZoomControl.resumePanning();
          this.isCurrentPressCaptured = false;
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
      if (this.isCurrentPressCaptured && this.options?.onPressEnd) {
        const clientX = e.changedTouches[0].clientX;
        const clientY = e.changedTouches[0].clientY;
        const x = clientX * this.zoomFactor + this.left;
        const y = clientY * this.zoomFactor + this.top;
        this.options?.onPressEnd(e, { x, y, clientX, clientY });
      }

      if (this.isCurrentPressCaptured) {
        // TODO
        // this.panZoomControl.resumePanning();
        this.isCurrentPressCaptured = false;
      }
    }
  };

  private tracker: any = { processed: true };
  private updateBySmoothly = (
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dz: ClientPixelUnit,
    pointerClientX: ClientPixelUnit,
    pointerClientY: ClientPixelUnit,
    type: string,
  ) => {
    if (this.tracker.processed) {
      this.tracker.dx = dx;
      this.tracker.dy = dy;
      this.tracker.dz = dz;
      this.tracker.pointerClientX = pointerClientX;
      this.tracker.pointerClientY = pointerClientY;
      this.tracker.type = type;
      this.tracker.processed = false;
    } else {
      if (this.tracker.type !== type) {
        this.updateBy(
          this.tracker.dx,
          this.tracker.dy,
          this.tracker.dz,
          this.tracker.pointerClientX,
          this.tracker.pointerClientY,
          this.tracker.type,
        );
        this.tracker.processed = true;
        this.updateBySmoothly(dx, dy, dz, pointerClientX, pointerClientY, type);
        return;
      } else {
        this.tracker.dx += dx;
        this.tracker.dy += dy;
        this.tracker.dz += dz;
        this.tracker.pointerClientX = pointerClientX;
        this.tracker.pointerClientY = pointerClientY;
      }
    }
  };

  // @ts-ignore
  // private handlePanZoomEvent = (e: any) => {
  private updateBy = (
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dz: ClientPixelUnit,
    pointerClientX: ClientPixelUnit,
    pointerClientY: ClientPixelUnit,
    type: string,
  ) => {
    // console.log({ dx, dy, dz, pointerClientX, pointerClientY, type, });
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handlePanZoomEvent`);
    }
    this.updateCounter++;
    if (this.updateCounter > 1) {
      console.warn(`this.updateCounter > 1: ` + this.updateCounter);
    }
    const writableThis = this as Writeable<ViewPort>;

    let zoomFactor = this.zoomFactor;
    if (dz !== 0) {
      if (type === 'wheel') {
        zoomFactor = (this.containerHeight * this.zoomFactor) / (this.containerHeight + dz * 2);
      } else {
        zoomFactor = zoomFactor + dz / 2;
      }
      //   if (type === 'mouse') {
      //     zoomFactor = (this.containerHeight * this.zoomFactor) / (this.containerHeight + dz * 2);
      //   } else if (type === 'touch') {
      //     // This logic is the same as the touch one above (which handles mouse
      //     // wheels) but I wanted to keep it separate in case we want to tweak it.
      //     //
      //     // The thing is, this logic seems fine for the mouse wheel but for touch
      //     // and pinch gestures I know the logic is not perfect here. It does a
      //     // decent job of keeping the areas that the user touched underneath
      //     // their fingers as they pinch or spread. 2 is just a magic number,
      //     // don't think much about it. A better way to do this might be to get
      //     // the finger positions (and track the old ones) and use that to make
      //     // sure the coordinates under both fingers (in the virtual space) stayed
      //     // the same... but at the same time that would have to factor in stuff
      //     // like using 2 fingers to drag so I am not sure that is easy... or
      //     // possible.
      //     zoomFactor = (this.containerHeight * this.zoomFactor) / (this.containerHeight + dz * 2);
      //   }
      // zoomFactor = zoomFactor + dz;
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

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
  };
}
