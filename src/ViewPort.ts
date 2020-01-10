import Hammer from 'hammerjs';

import { browserIsSafariDesktop, isMouseEvent } from './utils';
import { ViewPortCamera, ViewPortCameraValues } from './ViewPortCamera';

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

export interface ViewPortBounds {
  readonly x?: readonly [VirtualSpacePixelUnit | undefined, VirtualSpacePixelUnit | undefined];
  readonly y?: readonly [VirtualSpacePixelUnit | undefined, VirtualSpacePixelUnit | undefined];
  readonly z?: readonly [VirtualSpacePixelUnit | undefined, VirtualSpacePixelUnit | undefined];
}

export interface ViewPortOptions {
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

  public readonly camera: ViewPortCamera;

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
    this.camera = new ViewPortCamera(this as ViewPortCameraValues, this.options?.onUpdated);
    this.camera.setBounds({ z: [0.001, 100] });

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

  public setBounds(bounds?: ViewPortBounds): void {
    this.camera.setBounds(bounds);
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
    this.camera.handleContainerSizeChanged(width, height);
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
    this.camera.moveByInClientSpace(0, 0, dz, pointerContainerX, pointerContainerY, 'mouse');
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
    this.camera.moveByInClientSpace(dx, dy, 0, pointerContainerX, pointerContainerY, e.pointerType as any);
  };

  private handleHammerPanEnd = (e: HammerInput) => {
    if (this.options?.debugEvents) {
      console.log(`ViewPort:handleHammerPanEnd (` + e.velocityX + ',' + e.velocityY + ')');
    }
    this.camera.moveByDecelerationInClientSpace(e.velocityX, e.velocityY);
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
    this.camera.moveByInClientSpace(dx, dy, dz, pointerContainerX, pointerContainerY, e.pointerType as any);
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
    this.camera.moveByInClientSpace(0, 0, e.deltaY * scale, pointerContainerX, pointerContainerY, 'wheel');
  };
}
