import { invariant } from 'ts-invariant';
import { transitionNumber } from './utils';
import { ClientPixelUnit, ViewPortBounds, VirtualSpacePixelUnit, ZoomFactor } from './ViewPort';
import { ViewPortMath } from './ViewPortMath';

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

export class ViewPortCamera {
  private derivedBounds: ViewPortBounds;

  private animationFrameId?: number;

  private newAnimation?: ViewPortCameraAnimation;

  private animatingVelocityX: VirtualSpacePixelUnit;
  private animatingVelocityY: VirtualSpacePixelUnit;
  private isAnimating: boolean;

  private workingValues: ViewPortCameraValues;

  constructor(private readonly values: ViewPortCameraValues, private readonly onUpdated?: () => void) {
    this.animatingVelocityX = 0;
    this.animatingVelocityY = 0;
    this.isAnimating = false;

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
    this.derivedBounds = { zoom: [0.001, 100] };
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
    if (this.newAnimation) {
      if (this.newAnimation.preventInterruption) {
        return;
      } else {
        this.newAnimation = undefined;
      }
    }

    const updateTarget = !animationOptions ? this.workingValues : { ...this.workingValues };
    ViewPortMath.centerFitArea(updateTarget, this.derivedBounds, area, additionalBounds);

    if (!animationOptions) {
      this.scheduleHardUpdate();
    } else {
      this.scheduleNewAnimation(updateTarget, animationOptions);
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
    if (this.newAnimation) {
      if (this.newAnimation.preventInterruption) {
        return;
      } else {
        this.newAnimation = undefined;
      }
    }

    const updateTarget = !animationOptions ? this.workingValues : { ...this.workingValues };
    ViewPortMath.updateBy(updateTarget, this.derivedBounds, dx, dy, dZoom, anchorContainerX, anchorContainerY);

    if (!animationOptions) {
      this.scheduleHardUpdate();
    } else {
      this.scheduleNewAnimation(updateTarget, animationOptions);
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
    if (this.newAnimation) {
      if (this.newAnimation.preventInterruption) {
        return;
      } else {
        this.newAnimation = undefined;
      }
    }

    const updateTarget = !animationOptions ? this.workingValues : { ...this.workingValues };
    ViewPortMath.updateBy(
      updateTarget,
      this.derivedBounds,
      dx / this.workingValues.zoomFactor,
      dy / this.workingValues.zoomFactor,
      dZoom,
      anchorContainerX,
      anchorContainerY,
    );

    if (!animationOptions) {
      this.scheduleHardUpdate();
    } else {
      this.scheduleNewAnimation(updateTarget, animationOptions);
    }
  }

  public moveByDeceleration(vx: VirtualSpacePixelUnit, vy: VirtualSpacePixelUnit) {
    this.animatingVelocityX += vx;
    this.animatingVelocityY += vy;
    this.scheduleAnimation();
  }

  public moveByDecelerationInClientSpace(vx: ClientPixelUnit, vy: ClientPixelUnit) {
    this.animatingVelocityX += vx / this.workingValues.zoomFactor;
    this.animatingVelocityY += vy / this.workingValues.zoomFactor;
    this.scheduleAnimation();
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
    if (this.newAnimation) {
      if (this.newAnimation.preventInterruption) {
        this.copyValues(this.newAnimation.targetValues, this.workingValues);
      }
      this.newAnimation = undefined;
    }

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
    if (this.newAnimation) {
      if (this.newAnimation.preventInterruption) {
        return;
      } else {
        this.newAnimation = undefined;
      }
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
      this.scheduleHardUpdate();
    } else {
      this.scheduleNewAnimation(updateTarget, animationOptions);
    }
  }

  /**
   * This is not intended to be called by code outside of react-zoomable-ui itself.
   */
  public setBounds(bounds: ViewPortBounds) {
    // We don't know how to deal with this when an animation is in progress so
    // we either cancel it or run it to completion.
    if (this.newAnimation) {
      if (this.newAnimation.preventInterruption) {
        this.copyValues(this.newAnimation.targetValues, this.workingValues);
      }
      this.newAnimation = undefined;
    }

    this.derivedBounds = { ...bounds };

    this.dealWithBoundsChanges();
  }

  public setBoundsToContainer() {
    // We don't know how to deal with this when an animation is in progress so
    // we either cancel it or run it to completion.
    if (this.newAnimation) {
      if (this.newAnimation.preventInterruption) {
        this.copyValues(this.newAnimation.targetValues, this.workingValues);
      }
      this.newAnimation = undefined;
    }

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
    if (this.newAnimation) {
      if (this.newAnimation.preventInterruption) {
        return;
      } else {
        this.newAnimation = undefined;
      }
    }

    const updateTarget = !animationOptions ? this.workingValues : { ...this.workingValues };

    if (newZoomFactor) {
      ViewPortMath.updateZoom(updateTarget, this.derivedBounds, newZoomFactor);
    }
    ViewPortMath.updateTopLeft(updateTarget, this.derivedBounds, x, y);

    if (!animationOptions) {
      this.scheduleHardUpdate();
    } else {
      this.scheduleNewAnimation(updateTarget, animationOptions);
    }
  }

  private applyCurrentAnimation(percent: number) {
    if (!this.newAnimation) {
      return;
    }

    const { targetValues: tv, startingValues: sv } = this.newAnimation;
    if (percent >= 1) {
      this.copyValues(tv, this.workingValues);
    } else {
      // Simple ease out quartic
      const z = 1 - percent;
      const p = 1 - z * z * z * z;

      // The reason we use `updateBy` with deltas is that when changing the zoom
      // factor, sometimes, like when it is already small, there is some weird
      // effect the math has where the animation appears to go down and to the
      // right quite a bit before coming back up and to the left. Totally
      // bizarre. Not really sure why to be honest, but I think it is due to us
      // not being able to adjust the anchor position when the zoom changes, and
      // thus getting the wrong x and y positions.
      // Anyways, doing small updateBys like this is easier and is similar to
      // what happens when zooming in and out with the mouse wheel.
      const dx = transitionNumber(sv.centerX, tv.centerX, p) - this.workingValues.centerX;
      const dy = transitionNumber(sv.centerY, tv.centerY, p) - this.workingValues.centerY;
      const dz = transitionNumber(sv.zoomFactor, tv.zoomFactor, p) - this.workingValues.zoomFactor;
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
      ...ViewPortMath.deriveActualZoomBounds(this.workingValues, this.derivedBounds),
    };
    ViewPortMath.updateBounds(this.workingValues, this.derivedBounds);
    this.scheduleHardUpdate();
  };

  private handleAnimationFrame = (time: number) => {
    this.animationFrameId = undefined;
    if (this.isAnimating) {
      const FRICTION = 0.84;
      this.animatingVelocityX *= FRICTION;
      if (Math.abs(this.animatingVelocityX) < 0.2) {
        this.animatingVelocityX = 0;
      }
      this.animatingVelocityY *= FRICTION;
      if (Math.abs(this.animatingVelocityY) < 0.2) {
        this.animatingVelocityY = 0;
      }

      // Note we subtract the animation velocity because...
      if (Math.abs(this.animatingVelocityX) > 0 || Math.abs(this.animatingVelocityY) > 0) {
        if (
          this.animatingVelocityX < 0 &&
          this.derivedBounds?.x?.[0] !== undefined &&
          this.workingValues.left + this.animatingVelocityX < this.derivedBounds.x[0]
        ) {
          this.animatingVelocityX *= 0;
          this.workingValues.centerX = this.derivedBounds.x[0] + this.workingValues.width / 2;
        } else if (
          this.animatingVelocityX > 0 &&
          this.derivedBounds?.x?.[1] !== undefined &&
          this.workingValues.left + this.workingValues.width + this.animatingVelocityX > this.derivedBounds.x[1]
        ) {
          this.animatingVelocityX *= 0;
          this.workingValues.centerX = this.derivedBounds.x[1] - this.workingValues.width / 2;
        } else {
          this.workingValues.centerX += this.animatingVelocityX;
        }

        if (
          this.animatingVelocityY < 0 &&
          this.derivedBounds?.y?.[0] !== undefined &&
          this.workingValues.top + this.animatingVelocityY < this.derivedBounds.y[0]
        ) {
          this.animatingVelocityY *= 0;
          this.workingValues.centerY = this.derivedBounds.y[0] + this.workingValues.height / 2;
        } else if (
          this.animatingVelocityY > 0 &&
          this.derivedBounds?.y?.[1] !== undefined &&
          this.workingValues.top + this.workingValues.height + this.animatingVelocityY > this.derivedBounds.y[1]
        ) {
          this.animatingVelocityY *= 0;
          this.workingValues.centerY = this.derivedBounds.y[1] - this.workingValues.height / 2;
        } else {
          this.workingValues.centerY += this.animatingVelocityY;
        }

        this.workingValues.left = this.workingValues.centerX - this.workingValues.width / 2;
        this.workingValues.top = this.workingValues.centerY - this.workingValues.height / 2;
        // Continue animating
        this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
      } else {
        this.animatingVelocityX = 0;
        this.animatingVelocityY = 0;
        this.isAnimating = false;
      }
    }

    if (this.newAnimation) {
      if (this.newAnimation.startingTimeMilliseconds === undefined) {
        this.newAnimation.startingTimeMilliseconds = time - 1000 / 60; // Pretending like we are one frame into the animation
      }
      const completionPercent =
        (time - this.newAnimation.startingTimeMilliseconds) / this.newAnimation.durationMilliseconds;
      this.applyCurrentAnimation(completionPercent);
      if (completionPercent < 1) {
        if (!this.animationFrameId) {
          this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
        }
      } else {
        this.newAnimation = undefined;
      }
    }

    this.copyValues(this.workingValues, this.values);

    this.onUpdated?.();
  };

  private scheduleAnimation() {
    this.isAnimating = true;
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
    }
  }

  private scheduleNewAnimation(targetValues: ViewPortCameraValues, animationOptions: ViewPortCameraAnimationOptions) {
    invariant(!this.newAnimation, 'Cannot schedule animation while another animation is still in progress.');

    this.newAnimation = {
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

  private scheduleHardUpdate() {
    this.isAnimating = false;
    this.animatingVelocityX = 0;
    this.animatingVelocityY = 0;
    // If there was a pending animation it should have been committed before
    // this was called (so that the working values could have been updated)
    this.newAnimation = undefined;
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
    }
  }
}
