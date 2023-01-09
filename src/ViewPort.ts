import Hammer from 'hammerjs';

import { browserIsSafariDesktop, isMouseEvent } from './utils';
import { ViewPortCamera, ViewPortCameraInterface, ViewPortCameraValues } from './ViewPortCamera';

/**
 * This is just a type alias for `number`. Variables or parameters of this type
 * refer to client (as in the browser window)'s concept of pixels (which are
 * not the same as screen pixels).
 *
 * So 0,0 is top left of browser window, and it increases to the bottom right
 * of the window.
 */
export type ClientPixelUnit = number;
/**
 * This is a type alias representing the pixels inside the virtual space
 * created by the library.
 *
 * So 0,0 is the top left pixel of the virtual space we want to render stuff
 * in, and it increases to the bottom and right.
 */
export type VirtualSpacePixelUnit = number;
/**
 * A type alias for number.  A zoom factor is the amount the virtual space is being zoomed in.  `2` represents 200% zoom (in), while `0.5` represents 50% zoom (so zoomed out).
 */
export type ZoomFactor = number;

export interface VirtualSpaceRect {
  readonly bottom: VirtualSpacePixelUnit;
  readonly height: VirtualSpacePixelUnit;
  readonly left: VirtualSpacePixelUnit;
  readonly right: VirtualSpacePixelUnit;
  readonly top: VirtualSpacePixelUnit;
  readonly width: VirtualSpacePixelUnit;
}

export interface PressEventCoordinates {
  readonly clientX: ClientPixelUnit;
  readonly clientY: ClientPixelUnit;
  readonly containerX: ClientPixelUnit;
  readonly containerY: ClientPixelUnit;
  readonly x: VirtualSpacePixelUnit;
  readonly y: VirtualSpacePixelUnit;
}

export interface ViewPortBounds {
  readonly x?: readonly [VirtualSpacePixelUnit | undefined, VirtualSpacePixelUnit | undefined];
  readonly y?: readonly [VirtualSpacePixelUnit | undefined, VirtualSpacePixelUnit | undefined];
  readonly zoom?: readonly [VirtualSpacePixelUnit | undefined, VirtualSpacePixelUnit | undefined];
}

export interface ViewPortOptions {
  readonly debugEvents?: boolean;

  /**
   * Called whenever the `ViewPort` updates any of its values.
   */
  readonly onUpdated?: () => void;

  /**
   * Called when a press (press being a left mouse click or a single finger
   * touch) starts in the `ViewPort`. The callback can return whether the
   * press should be captured, in which case the other `onPress*` methods
   * will be called. Or it can be ignored (in which case nothing at all will
   * happen). Finally, the callback can return `undefined` which will initiate
   * the default behavior: panning the virtual space.
   */
  readonly onPressStart?: (
    e: MouseEvent | TouchEvent,
    coordinates: PressEventCoordinates,
  ) => 'capture' | 'ignore' | undefined;
  /**
   * Called when a press moves, IF the press is currently captured (see
   * `onPressStart`). The callback can release the captured press by
   * returning `'release'`.
   */
  readonly onPressMove?: (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates) => 'release' | undefined;
  /**
   * Called when a press ends normally by the user releasing the mouse button
   * or lifting their finger.
   */
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
  /**
   * Called whenever a mouse pointer moves over the `ViewPort`.
   */
  readonly onHover?: (e: MouseEvent, coordinates: PressEventCoordinates) => void;
  /**
   * Called when a right click happens inside the `ViewPort`.
   */
  readonly onContextMenu?: (e: MouseEvent, coordinates: PressEventCoordinates) => void;

  /**
   * By default two finger trackpad gestures are always handled as a zoom
   * in/zoom out, like with Google Maps.  If this is set to true, then
   * only pinch/spread gestures will be handled like that, and pan style two
   * finger gestures will be handled as a pan.
   *
   * However, this will cause mouse wheel interactions to behave like vertical
   * panning rather than zoom in/zoom out.  There is sadly no great way around
   * this, but there are some techniques you can use to guess whether the user
   * is using a mouse or a trackpad.
   */
  readonly treatTwoFingerTrackPadGesturesLikeTouch?: boolean;

  /**
   * By default right clicks with mice (and two finger taps with trackpads) are
   * sent to `onContextMenu`.  If this is set to true, then instead of that
   * they will begin a pan gesture.  The user can thus, right click and drag
   * the mouse to pan (or use two fingers and tap and drag on a trackpad).
   *
   * Note that if this is true `onContextMenu` will not be called, and none of
   * the other other "press" callbacks passed as part of this options object
   * will be called for the pan gesture (e.g. `onPressStart`).
   */
  readonly treatRightClickAsPan?: boolean;
}

/**
 * The `ViewPort` represents a "view" into a virtual space, that is not
 * tied to the available screen space or HTML elements. Because of this, it is
 * infinite, but it also uses its own "units" (virtual space pixels).
 *
 * You can think of the view port as describing what rectangular portion of the
 * virtual space (from top left to bottom right) should be visible inside the
 * bounds of containing HTML element where the virtual space is being rendered.
 *
 * Please see the [ Guide ](../../Guide.md) for more details.
 */
export class ViewPort {
  // While these public properties APPEAR readonly they are in fact NOT. They
  // are just readonly for consumer's of this class. They are changed by the
  // ViewPortCamera.
  public readonly containerWidth: ClientPixelUnit;
  public readonly containerHeight: ClientPixelUnit;
  public readonly centerX: VirtualSpacePixelUnit;
  public readonly centerY: VirtualSpacePixelUnit;
  public readonly left: VirtualSpacePixelUnit;
  public readonly top: VirtualSpacePixelUnit;
  public readonly width: VirtualSpacePixelUnit;
  public readonly height: VirtualSpacePixelUnit;
  public readonly zoomFactor: ZoomFactor; // E.g. 2 is zoomed in, 1 is exactly at pixel perfect match to images, and 0.5 is zoomed out.

  /**
   * The camera provides methods to move and animate the `ViewPort`.
   */
  public readonly camera: ViewPortCameraInterface;

  private readonly containerDiv: HTMLElement;
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
  // This is only used if the treatRightClickAsPan option is set to true.
  // Note this is also for two finger trackpad tap and drag panning
  private rightClickPanState?: {
    lastClientX: number;
    lastClientY: number;
    velocityX: number;
    velocityY: number;
  };
  private hammer: HammerManager;
  private options?: ViewPortOptions;
  private pressHandlingMode: undefined | 'rightclickpan' | 'capture' | 'ignore';

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
    this.pressHandlingMode = undefined;

    // Bind methods JIC
    // tslint:disable-next-line: unnecessary-bind
    this.setBounds = this.setBounds.bind(this);
    this.updateContainerSize = this.updateContainerSize.bind(this);
    this.translateClientXYCoordinatesToVirtualSpace = this.translateClientXYCoordinatesToVirtualSpace.bind(this);
    this.translateClientRectToVirtualSpace = this.translateClientRectToVirtualSpace.bind(this);

    // Set the div's styles
    this.containerDiv.style.overflow = 'hidden';
    this.containerDiv.style.padding = '0';

    // Setup other stuff
    this.camera = new ViewPortCamera(
      this as ViewPortCameraValues,
      this.translateClientRectToVirtualSpace,
      this.options?.onUpdated,
    );
    // Tell the camera about our div size this has to be after we change the style above...
    this.updateContainerSize();

    // Add event listeners
    // We use hammer for handling pinches and panning, and our own listeners for
    // everything else, including taps.

    this.containerDiv.addEventListener('mousedown', this.handleMouseDown);
    this.containerDiv.addEventListener('mousemove', this.handleMouseMove);
    // Doing this on window to catch it if it goes outside the window
    window.addEventListener('mouseup', this.handleMouseUp);
    this.containerDiv.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.containerDiv.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.containerDiv.addEventListener('touchend', this.handleTouchEnd);
    this.containerDiv.addEventListener('contextmenu', this.handleContextMenu);

    // There is no good way to detect whether an individual element is
    // resized. We can only do that at the window level. There are some
    // techniques for tracking element sizes, and we provide an OPTIONAL
    // polling based technique. But since watching for window resizes WILL
    // work for many use cases we do that here, and it shouldn't interfere
    // with any more specific techniques.
    window.addEventListener('resize', this.updateContainerSize);

    this.containerDiv.addEventListener('wheel', this.handleWheel, { passive: false });

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
  }

  /**
   * Called this to detach all event listeners that the `ViewPort` sets up.
   * After this is called no further updates will happen.
   */
  public destroy(): void {
    this.camera.destroy();

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

  /**
   * Constrain the virtual space so the user can not pan beyond, and the camera
   * cannot show anything beyond, the provided min/max values for x, y, and the
   * zoom factor.
   */
  public setBounds(bounds: ViewPortBounds): void {
    // The `camera` is really a `ViewPortCamera`, we just declare the field as
    // `ViewPortCameraInterface` to hide the `setBounds` method on it.
    (this.camera as ViewPortCamera).setBounds(bounds);
  }

  public translateClientXYCoordinatesToVirtualSpace(
    clientX: ClientPixelUnit,
    clientY: ClientPixelUnit,
  ): { readonly x: VirtualSpacePixelUnit; readonly y: VirtualSpacePixelUnit } {
    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    const containerX = clientX - clientBoundingRect.left;
    const containerY = clientY - clientBoundingRect.top;
    const x = containerX / this.zoomFactor + this.left;
    const y = containerY / this.zoomFactor + this.top;

    return { x, y };
  }

  public translateClientRectToVirtualSpace(rectOrElement: ClientRect | HTMLElement): VirtualSpaceRect {
    if (!(rectOrElement as any).getBoundingClientRect) {
      const rect = rectOrElement as ClientRect;

      const clientBoundingRect = this.containerDiv.getBoundingClientRect();
      const containerX = rect.left - clientBoundingRect.left;
      const containerY = rect.top - clientBoundingRect.top;
      const left = containerX / this.zoomFactor + this.left;
      const top = containerY / this.zoomFactor + this.top;
      const height = rect.height / this.zoomFactor;
      const width = rect.width / this.zoomFactor;

      return {
        left,
        top,
        height,
        width,
        right: left + width,
        bottom: top + height,
      };
    } else {
      const element = rectOrElement as HTMLElement;
      return this.translateClientRectToVirtualSpace(element.getBoundingClientRect());
    }
  }

  /**
   * This should be used when the div is resized. By default resizes due to the
   * window itself resizing will be automatically handled, but any other
   * resizes won't be handled (since there isn't a good way to get notified
   * when the div resizes.
   *
   * If you are getting access to the `ViewPort` via `Space` or
   * `SpaceContext` you should not call this method directly and should
   * instead call the `Space.updateSize` method.
   */
  public updateContainerSize() {
    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    const { width, height } = clientBoundingRect;
    this.camera.handleContainerSizeChanged(width, height);
  }

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
    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    const containerX = clientX - clientBoundingRect.left;
    const containerY = clientY - clientBoundingRect.top;
    const x = containerX / this.zoomFactor + this.left;
    const y = containerY / this.zoomFactor + this.top;
    return { x, y, clientX, clientY, containerX, containerY };
  };

  private handleContextMenu = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleContextMenu`);
    }
    if (this.options?.treatRightClickAsPan) {
      e.preventDefault();
    } else {
      this.options?.onContextMenu?.(e, this.getPressCoordinatesFromEvent(e));
    }
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
    // Divide by 2 so it feels less fast
    const dZoom = (e.scale - this.currentDesktopSafariGestureState.scale) / 2;
    this.currentDesktopSafariGestureState.scale = e.scale;
    this.camera.moveByInClientSpace(0, 0, dZoom, pointerContainerX, pointerContainerY);
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

    const dx = this.currentHammerGestureState.deltaX - e.deltaX;
    const dy = this.currentHammerGestureState.deltaY - e.deltaY;
    this.currentHammerGestureState.deltaX = e.deltaX;
    this.currentHammerGestureState.deltaY = e.deltaY;

    if (this.pressHandlingMode) {
      return;
    }
    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    const pointerContainerX = e.center.x - clientBoundingRect.left;
    const pointerContainerY = e.center.y - clientBoundingRect.top;
    this.camera.moveByInClientSpace(dx, dy, 0, pointerContainerX, pointerContainerY);
  };

  private handleHammerPanEnd = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPanEnd (` + e.velocityX + ',' + e.velocityY + ')');
    }
    if (!this.pressHandlingMode) {
      // Negative one because the direction of the pointer is the opposite of
      // the direction we are moving the viewport. Multiplying by 20 makes it
      // feel more normal.
      this.camera.moveWithDecelerationInClientSpace(-1 * e.velocityX * 20, -1 * e.velocityY * 20);
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

    const dx = this.currentHammerGestureState.deltaX - e.deltaX;
    const dy = this.currentHammerGestureState.deltaY - e.deltaY;
    // Divide by 2 so it feels less fast
    const dZoom = (e.scale - (this.currentHammerGestureState.scale || e.scale)) / 2;

    this.currentHammerGestureState.deltaX = e.deltaX;
    this.currentHammerGestureState.deltaY = e.deltaY;
    this.currentHammerGestureState.scale = e.scale;

    const clientBoundingRect = this.containerDiv.getBoundingClientRect();
    const pointerContainerX = e.center.x - clientBoundingRect.left;
    const pointerContainerY = e.center.y - clientBoundingRect.top;
    this.camera.moveByInClientSpace(dx, dy, dZoom, pointerContainerX, pointerContainerY);
  };

  private handleHammerPinchEnd = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPinchEnd`);
    }
    if (!this.pressHandlingMode) {
      // Negative one because the direction of the pointer is the opposite of
      // the direction we are moving the viewport. Multiplying by 20 makes it
      // feel more normal.
      this.camera.moveWithDecelerationInClientSpace(-1 * e.velocityX * 20, -1 * e.velocityY * 20);
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
    // e.buttons === 2
    const isLeftOnly = e.buttons === 1;
    const isRightOnly = e.buttons === 2;
    const shouldHandleAsPan = isLeftOnly || (this.options?.treatRightClickAsPan && isRightOnly);
    if (!shouldHandleAsPan) {
      return;
    }

    if (isLeftOnly) {
      this.pressHandlingMode = this.options?.onPressStart?.(e, this.getPressCoordinatesFromEvent(e));
      if (this.pressHandlingMode === 'capture') {
        e.preventDefault();
      }
    } else if (isRightOnly) {
      e.preventDefault();
      // Sadly hammer.js doesn't give us an option to treat right clicks as
      // pans so we have to make this work ourselves.
      this.pressHandlingMode = 'rightclickpan';
      this.rightClickPanState = {
        lastClientX: e.clientX,
        lastClientY: e.clientY,
        velocityX: 0,
        velocityY: 0,
      };
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseMove (pressHandlingMode: ${this.pressHandlingMode})`);
    }
    if (this.pressHandlingMode === 'capture') {
      if (e.buttons !== 1) {
        // Intentionally don't do anything... maybe cancel here?
      } else {
        if (this.options?.onPressMove) {
          if (this.options.onPressMove(e, this.getPressCoordinatesFromEvent(e)) === 'release') {
            this.pressHandlingMode = undefined;
          }
        }
      }
    } else if (this.pressHandlingMode === 'rightclickpan') {
      if (e.buttons !== 2 || !this.rightClickPanState) {
        // Intentionally don't do anything... maybe reset this.pressHandlingMode?
      } else {
        const dx = this.rightClickPanState.lastClientX - e.clientX;
        const dy = this.rightClickPanState.lastClientY - e.clientY;
        this.rightClickPanState.lastClientX = e.clientX;
        this.rightClickPanState.lastClientY = e.clientY;
        this.rightClickPanState.velocityX = dx;
        this.rightClickPanState.velocityY = dy;

        const clientBoundingRect = this.containerDiv.getBoundingClientRect();
        const pointerContainerX = e.clientX - clientBoundingRect.left;
        const pointerContainerY = e.clientY - clientBoundingRect.top;
        this.camera.moveByInClientSpace(dx, dy, 0, pointerContainerX, pointerContainerY);
      }
    } else if (e.buttons === 0) {
      this.options?.onHover?.(e, this.getPressCoordinatesFromEvent(e));
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseUp`);
    }
    if (this.pressHandlingMode === 'capture' && this.options?.onPressEnd) {
      this.options?.onPressEnd(e, this.getPressCoordinatesFromEvent(e));
    }
    if (this.pressHandlingMode === 'rightclickpan' && this.rightClickPanState) {
      const dx = this.rightClickPanState.velocityX;
      const dy = this.rightClickPanState.velocityY;

      this.camera.moveWithDecelerationInClientSpace(dx, dy);
    }

    this.pressHandlingMode = undefined;
    this.rightClickPanState = undefined;
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) {
      if (this.pressHandlingMode) {
        this.pressHandlingMode = undefined;
        this.options?.onPressCancel?.(e);
        return;
      }
    }

    this.pressHandlingMode = this.options?.onPressStart?.(e, this.getPressCoordinatesFromEvent(e));

    if (this.pressHandlingMode === 'capture') {
      e.preventDefault();
    }
  };

  private handleTouchMove = (e: TouchEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleTouchMove`);
    }
    if (e.touches.length === 1) {
      if (this.pressHandlingMode === 'capture' && this.options?.onPressMove) {
        if (this.options?.onPressMove(e, this.getPressCoordinatesFromEvent(e)) === 'release') {
          this.pressHandlingMode = undefined;
        }
      }
    }
  };

  private handleTouchEnd = (e: TouchEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleTouchEnd`);
    }
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      if (this.pressHandlingMode === 'capture' && this.options?.onPressEnd) {
        this.options?.onPressEnd(e, this.getPressCoordinatesFromEvent(e));
      }
    }
  };

  private handleWheel = (e: WheelEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleWheel`, e);
    }

    e.preventDefault();

    let isPrimarilyZoom = true;
    if (this.options?.treatTwoFingerTrackPadGesturesLikeTouch) {
      // For whatever reason, desktop browsers send pinch gestures with ctrlKey set to true.
      isPrimarilyZoom = e.ctrlKey;
    }

    if (isPrimarilyZoom) {
      let scale = e.ctrlKey ? 5 : 1; // This feels more right...
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

      const dy = e.deltaY * scale;
      const dZoom = ((-1 * dy) / this.containerHeight) * this.zoomFactor;

      // Vertical scroll is doing to be interpreted by us as changing z
      this.camera.moveByInClientSpace(0, 0, dZoom, pointerContainerX, pointerContainerY);
    } else {
      this.camera.moveByInClientSpace(e.deltaX / 2, e.deltaY / 2, 0);
    }
  };
}
