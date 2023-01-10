import { invariant } from 'ts-invariant';
import { easeOutQuartic, parametricBlend, transitionNumber, Writeable } from './utils';
import { ClientPixelUnit, ViewPortBounds, VirtualSpacePixelUnit, VirtualSpaceRect, ZoomFactor } from './ViewPort';
import { ViewPortMath } from './ViewPortMath';

const DEFAULT_BOUNDS: readonly [number, number] = [0.001, 100];

export interface ViewPortCameraValues {
  // tslint:disable: readonly-keyword
  containerWidth: ClientPixelUnit;
  containerHeight: ClientPixelUnit;
  centerX: VirtualSpacePixelUnit;
  centerY: VirtualSpacePixelUnit;
  left: VirtualSpacePixelUnit;
  top: VirtualSpacePixelUnit;
  width: VirtualSpacePixelUnit;
  height: VirtualSpacePixelUnit;
  zoomFactor: ZoomFactor; // E.g. 2 is zoomed in, 1 is exactly at pixel perfect match to images, and 0.5 is zoomed out.
  // tslint:enable: readonly-keyword
}

export interface ViewPortCameraAnimationOptions {
  readonly durationMilliseconds: number;
  /**
   * Note that if the container size changes or `setBounds` is called, it will
   * still interrupt the animation. But instead of cancelling it, it will jump
   * to the end.
   */
  readonly preventInterruption?: boolean;
}

interface ViewPortCameraAnimation extends ViewPortCameraAnimationOptions {
  //  We can't reliably get the actual starting time when creating the animation
  //  so we set it later.
  // tslint:disable-next-line: readonly-keyword
  startingTimeMilliseconds?: number;
  readonly startingValues: ViewPortCameraValues;
  readonly targetValues: ViewPortCameraValues;
}

enum StopAnimationKind {
  FORCE = 'FORCE',
  INTERRUPT = 'INTERRUPT',
}

/**
 * This is the public interface to library users of the Camera. We basically
 * just want ot hide the `setBounds` method so its only called inside this
 * library.
 */
export type ViewPortCameraInterface = Omit<ViewPortCamera, 'setBounds'>;

/**
 * This class has methods to change and animate what portion of the virtual
 * space is visible in the `ViewPort`. You should not construct this directly,
 * rather get an instance from the `ViewPort`.
 */
export class ViewPortCamera {
  private derivedBounds: ViewPortBounds;

  private animationFrameId?: number;
  private animation?: ViewPortCameraAnimation;
  private workingValues: ViewPortCameraValues;

  /**
   * This is only intended to be constructed by the `ViewPort`. Get an instance
   * via the `viewPort` property.
   */
  constructor(
    private readonly values: ViewPortCameraValues,
    // This is used solely for the `centerFitElementIntoView` method. The logic for the translation
    // needs access to the `containerDiv` and so lives in the `ViewPort`, but for library uses it
    // makes somewhat more sense to have `centerFitElementIntoView` on this class. Perhaps the two
    // classes should be merged at some point (or translation logic should move to this class?).
    private readonly getElementVirtualSpaceCoordinates: (element: HTMLElement) => VirtualSpaceRect,
    private readonly onUpdated?: () => void,
  ) {
    const { containerWidth, containerHeight, centerX, centerY, left, top, width, height, zoomFactor } = values;

    this.workingValues = {
      containerWidth,
      containerHeight,
      centerX,
      centerY,
      left,
      top,
      width,
      height,
      zoomFactor,
    };

    // Semi-sane default bounds...
    this.derivedBounds = { zoom: DEFAULT_BOUNDS };
  }

  public centerFitAreaIntoView(
    area: {
      readonly left: VirtualSpacePixelUnit;
      readonly top: VirtualSpacePixelUnit;
      readonly width: VirtualSpacePixelUnit;
      readonly height: VirtualSpacePixelUnit;
    },
    additionalBounds?: Pick<ViewPortBounds, 'zoom'>,
    animationOptions?: ViewPortCameraAnimationOptions,
  ): void {
    if (!this.stopCurrentAnimation(StopAnimationKind.INTERRUPT)) {
      return;
    }

    const updateTarget = !animationOptions ? this.workingValues : { ...this.workingValues };
    ViewPortMath.centerFitArea(updateTarget, this.derivedBounds, area, additionalBounds);

    if (!animationOptions) {
      this.doImmediateUpdate();
    } else {
      this.scheduleAnimation(updateTarget, animationOptions);
    }
  }

  public centerFitElementIntoView(
    element: HTMLElement,
    options?: {
      elementExtraMarginForZoom?: VirtualSpacePixelUnit;
      elementExtraMarginForZoomInClientSpace?: ClientPixelUnit;
      additionalBounds?: Pick<ViewPortBounds, 'zoom'>;
    },
    animationOptions?: ViewPortCameraAnimationOptions,
  ): void {
    if (!this.stopCurrentAnimation(StopAnimationKind.INTERRUPT)) {
      return;
    }

    const area = this.getElementVirtualSpaceCoordinates(element) as Writeable<VirtualSpaceRect>;
    if (options?.elementExtraMarginForZoom) {
      area.top -= options.elementExtraMarginForZoom;
      area.left -= options.elementExtraMarginForZoom;
      area.bottom += options.elementExtraMarginForZoom;
      area.right += options.elementExtraMarginForZoom;
      area.width += options.elementExtraMarginForZoom * 2;
      area.height += options.elementExtraMarginForZoom * 2;
    }
    const updateTarget = !animationOptions ? this.workingValues : { ...this.workingValues };
    ViewPortMath.centerFitArea(updateTarget, this.derivedBounds, area, options?.additionalBounds);

    // This has to be done after the centerFitArea so we know what the final zoomFactor is
    if (options?.elementExtraMarginForZoomInClientSpace) {
      const additionalMargin = options.elementExtraMarginForZoomInClientSpace / updateTarget.zoomFactor;
      area.top -= additionalMargin;
      area.left -= additionalMargin;
      area.bottom += additionalMargin;
      area.right += additionalMargin;
      area.width += additionalMargin * 2;
      area.height += additionalMargin * 2;

      ViewPortMath.centerFitArea(updateTarget, this.derivedBounds, area, options?.additionalBounds);
    }

    if (!animationOptions) {
      this.doImmediateUpdate();
    } else {
      this.scheduleAnimation(updateTarget, animationOptions);
    }
  }

  public centerFitHorizontalAreaIntoView(
    left: VirtualSpacePixelUnit,
    width: VirtualSpacePixelUnit,
    additionalBounds?: Pick<ViewPortBounds, 'zoom'>,
    animationOptions?: ViewPortCameraAnimationOptions,
  ): void {
    if (!this.stopCurrentAnimation(StopAnimationKind.INTERRUPT)) {
      return;
    }

    const updateTarget = !animationOptions ? this.workingValues : { ...this.workingValues };
    ViewPortMath.centerFitHorizontalArea(updateTarget, this.derivedBounds, left, width, additionalBounds);

    if (!animationOptions) {
      this.doImmediateUpdate();
    } else {
      this.scheduleAnimation(updateTarget, animationOptions);
    }
  }

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  public moveBy(
    dx: VirtualSpacePixelUnit,
    dy: VirtualSpacePixelUnit,
    dZoom?: ZoomFactor,
    anchorContainerX?: ClientPixelUnit,
    anchorContainerY?: ClientPixelUnit,
    animationOptions?: ViewPortCameraAnimationOptions,
  ) {
    if (!this.stopCurrentAnimation(StopAnimationKind.INTERRUPT)) {
      return;
    }

    const updateTarget = !animationOptions ? this.workingValues : { ...this.workingValues };
    ViewPortMath.updateBy(updateTarget, this.derivedBounds, dx, dy, dZoom, anchorContainerX, anchorContainerY);

    if (!animationOptions) {
      this.doImmediateUpdate();
    } else {
      this.scheduleAnimation(updateTarget, animationOptions);
    }
  }

  public moveByInClientSpace(
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dZoom?: ZoomFactor,
    anchorContainerX?: ClientPixelUnit,
    anchorContainerY?: ClientPixelUnit,
    animationOptions?: ViewPortCameraAnimationOptions,
  ) {
    this.moveBy(
      dx / this.workingValues.zoomFactor,
      dy / this.workingValues.zoomFactor,
      dZoom,
      anchorContainerX,
      anchorContainerY,
      animationOptions,
    );
  }

  public moveWithDeceleration(
    vx: VirtualSpacePixelUnit,
    vy: VirtualSpacePixelUnit,
    friction: VirtualSpacePixelUnit,
    preventInterruption?: boolean,
  ) {
    if (!this.stopCurrentAnimation(StopAnimationKind.INTERRUPT)) {
      return;
    }

    const finalFriction = Math.min(Math.abs(friction), 0.99);
    const updateTarget = { ...this.workingValues };

    // Figure out roughly how many animation frames we need, where we decrease
    // the velocity by the friction on each frame, to get to 0 velocity. Also
    // keep track of how far we go.
    let currentVX = vx;
    let currentVY = vy;
    let dx = vx;
    let dy = vy;
    let animationFramesNeeded = 1; // Skip the first frame since its trivial
    while (Math.abs(currentVX) > 0.2 || Math.abs(currentVY) > 0.2) {
      currentVX *= finalFriction;
      dx += currentVX;
      currentVY *= finalFriction;
      dy += currentVY;
      animationFramesNeeded++;
    }

    ViewPortMath.updateBy(updateTarget, this.derivedBounds, dx, dy, 0);

    const animationOptions = {
      preventInterruption,
      durationMilliseconds: (1000 / 60) * animationFramesNeeded,
    };
    this.scheduleAnimation(updateTarget, animationOptions);
  }

  public moveWithDecelerationInClientSpace(
    vx: ClientPixelUnit,
    vy: ClientPixelUnit,
    friction: ClientPixelUnit = 0.84,
    preventInterruption?: boolean,
  ) {
    this.moveWithDeceleration(
      vx / this.workingValues.zoomFactor,
      vy / this.workingValues.zoomFactor,
      friction,
      preventInterruption,
    );
  }

  /**
   * This is not intended to be called by code outside of react-zoomable-ui itself.
   */
  public handleContainerSizeChanged(width: ClientPixelUnit, height: ClientPixelUnit) {
    if (width === this.workingValues.containerWidth && height === this.workingValues.containerHeight) {
      return;
    }

    // We don't know how to deal with this when an animation is in progress so
    // we either cancel it or run it to completion.
    this.stopCurrentAnimation(StopAnimationKind.FORCE);

    // This is intended to handle the case where we first get our container dimensions
    const wasZeroWidthHeightCenter =
      this.workingValues.width === 0 &&
      this.workingValues.height === 0 &&
      this.workingValues.centerX === 0 &&
      this.workingValues.centerY === 0;

    this.workingValues.containerWidth = width;
    this.workingValues.containerHeight = height;
    this.workingValues.width = this.workingValues.containerWidth / this.workingValues.zoomFactor;
    this.workingValues.height = this.workingValues.containerHeight / this.workingValues.zoomFactor;

    if (wasZeroWidthHeightCenter) {
      this.workingValues.centerX = this.workingValues.width / 2;
      this.workingValues.centerY = this.workingValues.height / 2;
    }

    // The new container height and width may influence the actual z bounds
    this.dealWithBoundsChanges();
  }

  public recenter(
    x: VirtualSpacePixelUnit,
    y: VirtualSpacePixelUnit,
    newZoomFactor?: ZoomFactor,
    animationOptions?: ViewPortCameraAnimationOptions,
  ): void {
    if (!this.stopCurrentAnimation(StopAnimationKind.INTERRUPT)) {
      return;
    }

    const updateTarget = !animationOptions ? this.workingValues : { ...this.workingValues };
    if (newZoomFactor) {
      ViewPortMath.updateZoom(updateTarget, this.derivedBounds, newZoomFactor);
    }
    ViewPortMath.updateTopLeft(
      updateTarget,
      this.derivedBounds,
      x - updateTarget.width / 2,
      y - updateTarget.height / 2,
    );

    if (!animationOptions) {
      this.doImmediateUpdate();
    } else {
      this.scheduleAnimation(updateTarget, animationOptions);
    }
  }

  /**
   * This is not intended to be called by code outside of react-zoomable-ui
   * itself. It is hidden in the `ViewPortCameraInterface` that is exported
   * from this library.
   */
  public setBounds(bounds: ViewPortBounds) {
    // We don't know how to deal with this when an animation is in progress so
    // we either cancel it or run it to completion.
    this.stopCurrentAnimation(StopAnimationKind.FORCE);
    this.derivedBounds = { ...bounds };
    this.dealWithBoundsChanges();
  }

  public setBoundsToContainer() {
    // We don't know how to deal with this when an animation is in progress so
    // we either cancel it or run it to completion.
    this.stopCurrentAnimation(StopAnimationKind.FORCE);
    this.derivedBounds = {
      x: [0, this.workingValues.containerWidth],
      y: [0, this.workingValues.containerHeight],
      // Can't zoom out but you can zoom in
      zoom: [1, undefined],
    };
    this.dealWithBoundsChanges();
  }

  public updateTopLeft(
    x: VirtualSpacePixelUnit,
    y: VirtualSpacePixelUnit,
    newZoomFactor?: ZoomFactor,
    animationOptions?: ViewPortCameraAnimationOptions,
  ): void {
    if (!this.stopCurrentAnimation(StopAnimationKind.INTERRUPT)) {
      return;
    }

    const updateTarget = !animationOptions ? this.workingValues : { ...this.workingValues };
    if (newZoomFactor) {
      ViewPortMath.updateZoom(updateTarget, this.derivedBounds, newZoomFactor);
    }
    ViewPortMath.updateTopLeft(updateTarget, this.derivedBounds, x, y);

    if (!animationOptions) {
      this.doImmediateUpdate();
    } else {
      this.scheduleAnimation(updateTarget, animationOptions);
    }
  }

  private advanceCurrentAnimation(percent: number) {
    if (!this.animation) {
      return;
    }

    const { targetValues: tv, startingValues: sv } = this.animation;
    if (percent >= 1) {
      this.copyValues(tv, this.workingValues);
    } else {
      // The reason we use `updateBy` with deltas is that when changing the zoom
      // factor, sometimes, like when it is already small, there is some weird
      // effect the math has where the animation appears to go down and to the
      // right quite a bit before coming back up and to the left. Totally
      // bizarre. Not really sure why to be honest, but I think it is due to us
      // not being able to adjust the anchor position when the zoom changes, and
      // thus getting the wrong x and y positions.
      // Anyways, doing small updateBys like this is easier and is similar to
      // what happens when zooming in and out with the mouse wheel.

      const xyModifiedPercent = easeOutQuartic(percent);
      const dx = transitionNumber(sv.centerX, tv.centerX, xyModifiedPercent) - this.workingValues.centerX;
      const dy = transitionNumber(sv.centerY, tv.centerY, xyModifiedPercent) - this.workingValues.centerY;

      // If we are animating the x or y camera position AND the zoom, using this
      // parametricBlend looks a lot better than doing the easeOutQuartic above.
      // (If we are just animating zoom then easeOutQuartic is fine though.)
      const zModifiedPercent = parametricBlend(percent * percent * percent);
      const dz = transitionNumber(sv.zoomFactor, tv.zoomFactor, zModifiedPercent) - this.workingValues.zoomFactor;

      ViewPortMath.updateBy(this.workingValues, this.derivedBounds, dx, dy, dz);
    }
  }

  private copyValues = (values: ViewPortCameraValues, to: ViewPortCameraValues) => {
    // Its faster to do it this way rather than use Object.assign, though it
    // probably doesn't matter much.
    to.centerX = values.centerX;
    to.centerY = values.centerY;
    to.containerHeight = values.containerHeight;
    to.containerWidth = values.containerWidth;
    to.height = values.height;
    to.left = values.left;
    to.width = values.width;
    to.top = values.top;
    to.zoomFactor = values.zoomFactor;
  };

  private dealWithBoundsChanges = () => {
    this.derivedBounds = {
      ...this.derivedBounds,
      ...ViewPortMath.deriveActualZoomBounds(this.workingValues, this.derivedBounds, DEFAULT_BOUNDS),
    };
    ViewPortMath.updateBounds(this.workingValues, this.derivedBounds);
    this.doImmediateUpdate();
  };

  private doImmediateUpdate() {
    // If there was a pending animation it should have been committed before
    // this was called (so that the working values could have been updated)
    invariant(!this.animation, 'Cannot do immediate update while an animation is in progress.');

    // This probably shouldn't happen but JIC there is a pending callback lets cancel it
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    // Apply value updates and broadcast the event
    this.copyValues(this.workingValues, this.values);
    this.onUpdated?.();
  }

  private handleAnimationFrame = (time: number) => {
    this.animationFrameId = undefined;
    if (this.animation) {
      if (this.animation.startingTimeMilliseconds === undefined) {
        this.animation.startingTimeMilliseconds = time - 1000 / 60; // Pretending like we are one frame into the animation
      }
      const completionPercent = (time - this.animation.startingTimeMilliseconds) / this.animation.durationMilliseconds;
      this.advanceCurrentAnimation(completionPercent);
      if (completionPercent < 1) {
        if (!this.animationFrameId) {
          this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
        }
      } else {
        this.animation = undefined;
      }
    }

    this.copyValues(this.workingValues, this.values);
    this.onUpdated?.();
  };

  private scheduleAnimation(targetValues: ViewPortCameraValues, animationOptions: ViewPortCameraAnimationOptions) {
    invariant(!this.animation, 'Cannot schedule animation while another animation is still in progress.');

    this.animation = {
      startingValues: { ...this.workingValues },
      targetValues,
      // We don't have a good way to get the high-res time that will be passed
      // to requestAnimationFrame (performance.now() is greater than the next
      // time we get in requestAnimationFrame for some reason, sometimes). So we
      // set this to null and deal with it in handleAnimationFrame.
      startingTimeMilliseconds: undefined,
      ...animationOptions,
    };
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
    }
  }

  private stopCurrentAnimation(stopKind: StopAnimationKind) {
    if (this.animation) {
      if (this.animation.preventInterruption) {
        if (stopKind === StopAnimationKind.FORCE) {
          this.copyValues(this.animation.targetValues, this.workingValues);
        } else {
          return false;
        }
      }
      this.animation = undefined;
    }
    return true;
  }
}
