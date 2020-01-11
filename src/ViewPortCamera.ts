import { ClientPixelUnit, ViewPortBounds, VirtualSpacePixelUnit, ZoomFactor } from './ViewPort';

function clamp(from: number, to: number, bounds?: readonly [number | undefined, number | undefined]): ZoomFactor {
  if (bounds) {
    const [min, max] = bounds;
    if (min !== undefined && to < from && to < min) {
      return min;
    }
    if (max !== undefined && to > from && to > max) {
      return max;
    }
  }
  return to;
}

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
  private bounds?: ViewPortBounds;

  private animationFrameId?: number;
  private animatingVelocityX: VirtualSpacePixelUnit;
  private animatingVelocityY: VirtualSpacePixelUnit;
  private isAnimating: boolean;

  private workingValues: ViewPortCameraValues;

  constructor(private readonly values: ViewPortCameraValues, private readonly onUpdated?: () => void) {
    this.animatingVelocityX = 0;
    this.animatingVelocityY = 0;
    this.isAnimating = false;
    this.workingValues = { ...values };
  }

  public centerFitAreaIntoView(
    left: VirtualSpacePixelUnit,
    top: VirtualSpacePixelUnit,
    width: VirtualSpacePixelUnit,
    height: VirtualSpacePixelUnit,
    additionalBounds?: Pick<ViewPortBounds, 'z'>,
  ): void {
    const cx = left + width / 2;
    const cy = top + height / 2;
    const zoomFactorBasedOnWidth = this.workingValues.containerWidth / width;
    const zoomFactorBasedOnHeight = this.workingValues.containerHeight / height;
    let newZoomFactor = Math.min(zoomFactorBasedOnWidth, zoomFactorBasedOnHeight);
    newZoomFactor = clamp(this.workingValues.zoomFactor, newZoomFactor, additionalBounds?.z);
    this.recenter(cx, cy, newZoomFactor);
  }

  public centerFitHorizontalAreaIntoView(
    left: VirtualSpacePixelUnit,
    width: VirtualSpacePixelUnit,
    additionalBounds?: Pick<ViewPortBounds, 'z'>,
  ): void {
    const centerX = left + width / 2;
    let newZoomFactor = this.workingValues.containerWidth / width;
    newZoomFactor = clamp(this.workingValues.zoomFactor, newZoomFactor, additionalBounds?.z);
    this.updateTopLeft(centerX - this.workingValues.width / newZoomFactor / 2, this.workingValues.top, newZoomFactor);
  }

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  public moveByInClientSpace(
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dz: ClientPixelUnit,
    pointerContainerX: ClientPixelUnit,
    pointerContainerY: ClientPixelUnit,
    eventType?: 'mouse' | 'touch' | 'wheel',
  ) {
    let zoomFactor = this.workingValues.zoomFactor;
    if (dz !== 0) {
      // tslint:disable-next-line: prefer-conditional-expression
      if (eventType === 'wheel') {
        // In the wheel case this makes the zoom feel more like its going at a
        // linear speed.
        zoomFactor =
          (this.workingValues.containerHeight * this.workingValues.zoomFactor) /
          (this.workingValues.containerHeight + dz * 2);
      } else {
        // It feels too fast if we don't divide by two... some hammer.js issue?
        zoomFactor = zoomFactor + dz / 2;
      }
      zoomFactor = clamp(this.workingValues.zoomFactor, zoomFactor, this.bounds?.z);
    }

    let virtualSpaceCenterX: VirtualSpacePixelUnit;
    let virtualSpaceCenterY: VirtualSpacePixelUnit;

    // Basic pan handling
    virtualSpaceCenterX = this.workingValues.left + (-1 * dx) / zoomFactor;
    virtualSpaceCenterY = this.workingValues.top + (-1 * dy) / zoomFactor;

    // Zoom BUT keep the view coordinate under the mouse pointer CONSTANT
    const oldVirtualSpaceVisibleSpaceWidth = this.workingValues.containerWidth / this.workingValues.zoomFactor;
    const oldVirtualSpaceVisibleSpaceHeight = this.workingValues.containerHeight / this.workingValues.zoomFactor;
    this.workingValues.width = this.workingValues.containerWidth / zoomFactor;
    this.workingValues.height = this.workingValues.containerHeight / zoomFactor;
    this.workingValues.zoomFactor = zoomFactor;

    const virtualSpaceVisibleWidthDelta = this.workingValues.width - oldVirtualSpaceVisibleSpaceWidth;
    const virtualSpaceVisibleHeightDelta = this.workingValues.height - oldVirtualSpaceVisibleSpaceHeight;

    // The reason we use x and y here is to zoom in or out towards where the
    // pointer is positioned
    const xFocusPercent = pointerContainerX / this.workingValues.containerWidth;
    const yFocusPercent = pointerContainerY / this.workingValues.containerHeight;

    this.workingValues.left = virtualSpaceCenterX - virtualSpaceVisibleWidthDelta * xFocusPercent;
    this.workingValues.top = virtualSpaceCenterY - virtualSpaceVisibleHeightDelta * yFocusPercent;
    this.workingValues.centerX = virtualSpaceCenterX + this.workingValues.width / 2;
    this.workingValues.centerY = virtualSpaceCenterY + this.workingValues.height / 2;

    this.scheduleHardUpdate();
  }

  public moveByDecelerationInClientSpace = (vx: ClientPixelUnit, vy: ClientPixelUnit) => {
    const VELOCITY_BOOST = 20;
    this.animatingVelocityX += (vx * VELOCITY_BOOST) / this.workingValues.zoomFactor;
    this.animatingVelocityY += (vy * VELOCITY_BOOST) / this.workingValues.zoomFactor;
    this.scheduleAnimation();
  };

  public handleContainerSizeChanged(width: ClientPixelUnit, height: ClientPixelUnit) {
    if (width === this.workingValues.containerWidth && height === this.workingValues.containerHeight) {
      return;
    }

    this.workingValues.containerWidth = width;
    this.workingValues.containerHeight = height;
    this.workingValues.width = this.workingValues.containerWidth / this.workingValues.zoomFactor;
    this.workingValues.height = this.workingValues.containerHeight / this.workingValues.zoomFactor;

    // Keep focus on the top left, I guess?
    this.workingValues.centerX = this.workingValues.left + this.workingValues.width / 2;
    this.workingValues.centerY = this.workingValues.top + this.workingValues.height / 2;

    this.scheduleHardUpdate();
  }

  public recenter(x: VirtualSpacePixelUnit, y: VirtualSpacePixelUnit, newZoomFactor?: ZoomFactor): void {
    if (newZoomFactor !== undefined) {
      this.workingValues.zoomFactor = clamp(this.workingValues.zoomFactor, newZoomFactor, this.bounds?.z);
      this.workingValues.width = this.workingValues.containerWidth / this.workingValues.zoomFactor;
      this.workingValues.height = this.workingValues.containerHeight / this.workingValues.zoomFactor;
    }
    this.workingValues.centerX = x;
    this.workingValues.centerY = y;
    this.workingValues.left = x - this.workingValues.width / 2;
    this.workingValues.top = y - this.workingValues.height / 2;

    this.scheduleHardUpdate();
  }

  public setBounds(bounds?: ViewPortBounds) {
    this.bounds = bounds;
    this.scheduleHardUpdate();
  }

  public setBoundsToContent() {
    this.bounds = {
      x: [0, this.workingValues.containerWidth],
      y: [0, this.workingValues.containerHeight],
      // Can't zoom out but you can zoom in
      z: [1, undefined],
    };
    this.scheduleHardUpdate();
  }

  public updateTopLeft(x: VirtualSpacePixelUnit, y: VirtualSpacePixelUnit, zoomFactor?: ZoomFactor): void {
    if (zoomFactor !== undefined) {
      this.workingValues.zoomFactor = clamp(this.workingValues.zoomFactor, zoomFactor, this.bounds?.z);
      this.workingValues.width = this.workingValues.containerWidth / this.workingValues.zoomFactor;
      this.workingValues.height = this.workingValues.containerHeight / this.workingValues.zoomFactor;
    }
    this.workingValues.centerX = x + this.workingValues.width / 2;
    this.workingValues.centerY = y + this.workingValues.height / 2;
    this.workingValues.left = x;
    this.workingValues.top = y;

    this.scheduleHardUpdate();
  }

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

      if (Math.abs(this.animatingVelocityX) > 0 || Math.abs(this.animatingVelocityY) > 0) {
        this.workingValues.centerX -= this.animatingVelocityX;
        this.workingValues.centerY -= this.animatingVelocityY;
        this.workingValues.left -= this.animatingVelocityX;
        this.workingValues.top -= this.animatingVelocityY;
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
