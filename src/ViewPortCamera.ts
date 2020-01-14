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

export class ViewPortCamera {
  private derivedBounds: ViewPortBounds;

  private animationFrameId?: number;
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
  ): void {
    ViewPortMath.centerFitArea(this.workingValues, this.derivedBounds, area, additionalBounds);
    this.scheduleHardUpdate();
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
  ) {
    ViewPortMath.updateBy(this.workingValues, this.derivedBounds, dx, dy, dZoom, anchorContainerX, anchorContainerY);
    this.scheduleHardUpdate();
  }

  public moveByInClientSpace(
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dZoom?: ZoomFactor,
    anchorContainerX?: ClientPixelUnit,
    anchorContainerY?: ClientPixelUnit,
  ) {
    ViewPortMath.updateBy(
      this.workingValues,
      this.derivedBounds,
      dx / this.workingValues.zoomFactor,
      dy / this.workingValues.zoomFactor,
      dZoom,
      anchorContainerX,
      anchorContainerY,
    );
    this.scheduleHardUpdate();
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

  public recenter(x: VirtualSpacePixelUnit, y: VirtualSpacePixelUnit, newZoomFactor?: ZoomFactor): void {
    if (newZoomFactor) {
      ViewPortMath.updateZoom(this.workingValues, this.derivedBounds, newZoomFactor);
    }
    ViewPortMath.updateTopLeft(
      this.workingValues,
      this.derivedBounds,
      x - this.workingValues.width / 2,
      y - this.workingValues.height / 2,
    );
    this.scheduleHardUpdate();
  }

  /**
   * This is not intended to be called by code outside of react-zoomable-ui itself.
   */
  public setBounds(bounds: ViewPortBounds) {
    this.derivedBounds = { ...bounds };

    this.dealWithBoundsChanges();
  }

  public setBoundsToContainer() {
    this.derivedBounds = {
      x: [0, this.workingValues.containerWidth],
      y: [0, this.workingValues.containerHeight],
      // Can't zoom out but you can zoom in
      zoom: [1, undefined],
    };
    this.dealWithBoundsChanges();
  }

  public updateTopLeft(x: VirtualSpacePixelUnit, y: VirtualSpacePixelUnit, newZoomFactor?: ZoomFactor): void {
    if (newZoomFactor) {
      ViewPortMath.updateZoom(this.workingValues, this.derivedBounds, newZoomFactor);
    }
    ViewPortMath.updateTopLeft(this.workingValues, this.derivedBounds, x, y);
    this.scheduleHardUpdate();
  }

  private dealWithBoundsChanges = () => {
    this.derivedBounds = {
      ...this.derivedBounds,
      ...ViewPortMath.deriveActualZoomBounds(this.workingValues, this.derivedBounds),
    };
    ViewPortMath.updateBounds(this.workingValues, this.derivedBounds);
    this.scheduleHardUpdate();
  };

  private handleAnimationFrame = (/*time: number*/) => {
    this.animationFrameId = undefined;
    // var progress = time - (this.priorTimestamp || time);
    // this.priorTimestamp = time;
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

    this.values.centerX = this.workingValues.centerX;
    this.values.centerY = this.workingValues.centerY;
    this.values.containerHeight = this.workingValues.containerHeight;
    this.values.containerWidth = this.workingValues.containerWidth;
    this.values.height = this.workingValues.height;
    this.values.left = this.workingValues.left;
    this.values.width = this.workingValues.width;
    this.values.top = this.workingValues.top;
    this.values.zoomFactor = this.workingValues.zoomFactor;

    this.onUpdated?.();
  };

  private scheduleAnimation() {
    this.isAnimating = true;
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
    }
  }

  private scheduleHardUpdate() {
    this.isAnimating = false;
    this.animatingVelocityX = 0;
    this.animatingVelocityY = 0;
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
    }
  }
}
