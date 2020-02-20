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
  readonly onPressContextMenu?: (e: MouseEvent, coordinates: PressEventCoordinates) => void;
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
  private hammer: HammerManager;
  private options?: ViewPortOptions;
  private inNonPanPressHandlingMode: undefined | 'capture' | 'ignore';

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
    this.inNonPanPressHandlingMode = undefined;

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
    this.camera = new ViewPortCamera(this as ViewPortCameraValues, this.options?.onUpdated);
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
    x: ClientPixelUnit,
    y: ClientPixelUnit,
  ): { readonly x: VirtualSpacePixelUnit; readonly y: VirtualSpacePixelUnit } {
    return {
      x: x / this.zoomFactor + this.left,
      y: y / this.zoomFactor + this.top,
    };
  }

  public translateClientRectToVirtualSpace(rectOrElement: ClientRect | HTMLElement): VirtualSpaceRect {
    if (!(rectOrElement as any).getBoundingClientRect) {
      const rect = rectOrElement as ClientRect;
      return {
        bottom: rect.bottom / this.zoomFactor + this.top,
        height: rect.height / this.zoomFactor,
        left: rect.left / this.zoomFactor + this.left,
        right: rect.right / this.zoomFactor + this.left,
        top: rect.top / this.zoomFactor + this.top,
        width: rect.width / this.zoomFactor,
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
    const x = clientX / this.zoomFactor + this.left;
    const y = clientY / this.zoomFactor + this.top;
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

    if (this.inNonPanPressHandlingMode) {
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
    if (!this.inNonPanPressHandlingMode) {
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
    if (!this.inNonPanPressHandlingMode) {
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
    if (e.buttons !== 1) {
      return;
    }

    this.inNonPanPressHandlingMode = this.options?.onPressStart?.(e, this.getPressCoordinatesFromEvent(e));

    if (this.inNonPanPressHandlingMode === 'capture') {
      e.preventDefault();
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseMove (inNonPanPressHandlingMode: ${this.inNonPanPressHandlingMode})`);
    }
    if (this.inNonPanPressHandlingMode === 'capture') {
      if (this.options?.onPressMove) {
        if (this.options.onPressMove(e, this.getPressCoordinatesFromEvent(e)) === 'release') {
          this.inNonPanPressHandlingMode = undefined;
        }
      }
    } else if (e.buttons === 0) {
      this.options?.onHover?.(e, this.getPressCoordinatesFromEvent(e));
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleMouseUp`);
    }
    if (this.inNonPanPressHandlingMode === 'capture' && this.options?.onPressEnd) {
      this.options?.onPressEnd(e, this.getPressCoordinatesFromEvent(e));
    }
    this.inNonPanPressHandlingMode = undefined;
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) {
      if (this.inNonPanPressHandlingMode) {
        this.inNonPanPressHandlingMode = undefined;
        this.options?.onPressCancel?.(e);
        return;
      }
    }

    this.inNonPanPressHandlingMode = this.options?.onPressStart?.(e, this.getPressCoordinatesFromEvent(e));

    if (this.inNonPanPressHandlingMode === 'capture') {
      e.preventDefault();
    }
  };

  private handleTouchMove = (e: TouchEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleTouchMove`);
    }
    if (e.touches.length === 1) {
      if (this.inNonPanPressHandlingMode === 'capture' && this.options?.onPressMove) {
        if (this.options?.onPressMove(e, this.getPressCoordinatesFromEvent(e)) === 'release') {
          this.inNonPanPressHandlingMode = undefined;
        }
      }
    }
  };

  private handleTouchEnd = (e: TouchEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleTouchEnd`);
    }
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      if (this.inNonPanPressHandlingMode === 'capture' && this.options?.onPressEnd) {
        this.options?.onPressEnd(e, this.getPressCoordinatesFromEvent(e));
      }
    }
  };

  private handleWheel = (e: WheelEvent) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleWheel`);
    }
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

    const dy = e.deltaY * scale;
    const dZoom = ((-1 * dy) / this.containerHeight) * this.zoomFactor;

    // Vertical scroll is doing to be interpreted by us as changing z
    this.camera.moveByInClientSpace(0, 0, dZoom, pointerContainerX, pointerContainerY);
  };
}
