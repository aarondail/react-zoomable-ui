import { clamp } from './utils';
import { ClientPixelUnit, VirtualSpacePixelUnit, ZoomFactor, ZoomFactorMinMaxOptions } from './ViewPort';

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
  constructor(
    private readonly values: ViewPortCameraValues,
    private readonly onUpdated?: () => void,
    private readonly options?: ZoomFactorMinMaxOptions,
  ) {}

  public centerFitAreaIntoView(
    left: VirtualSpacePixelUnit,
    top: VirtualSpacePixelUnit,
    width: VirtualSpacePixelUnit,
    height: VirtualSpacePixelUnit,
    options?: ZoomFactorMinMaxOptions,
  ): void {
    const cx = left + width / 2;
    const cy = top + height / 2;
    const zoomFactorBasedOnWidth = this.values.containerWidth / width;
    const zoomFactorBasedOnHeight = this.values.containerHeight / height;
    let newZoomFactor = Math.min(zoomFactorBasedOnWidth, zoomFactorBasedOnHeight);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, options);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
    this.recenter(cx, cy, newZoomFactor);
  }

  public centerFitHorizontalAreaIntoView(
    left: VirtualSpacePixelUnit,
    width: VirtualSpacePixelUnit,
    options?: ZoomFactorMinMaxOptions,
  ): void {
    const centerX = left + width / 2;
    let newZoomFactor = this.values.containerWidth / width;
    newZoomFactor = this.clampZoomFactor(newZoomFactor, options);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
    this.updateTopLeft(centerX - this.values.width / newZoomFactor / 2, this.values.top, newZoomFactor);
  }

  public handleContainerSizeChanged(width: ClientPixelUnit, height: ClientPixelUnit) {
    if (width === this.values.containerWidth && height === this.values.containerHeight) {
      return;
    }

    this.values.containerWidth = width;
    this.values.containerHeight = height;
    this.values.width = this.values.containerWidth / this.values.zoomFactor;
    this.values.height = this.values.containerHeight / this.values.zoomFactor;

    // Keep focus on the top left, I guess?
    this.values.centerX = this.values.left + this.values.width / 2;
    this.values.centerY = this.values.top + this.values.height / 2;

    this.onUpdated?.();
  }

  public moveBy(
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dz: ClientPixelUnit,
    pointerContainerX: ClientPixelUnit,
    pointerContainerY: ClientPixelUnit,
    eventType?: 'mouse' | 'touch' | 'wheel',
  ) {
    let zoomFactor = this.values.zoomFactor;
    if (dz !== 0) {
      // tslint:disable-next-line: prefer-conditional-expression
      if (eventType === 'wheel') {
        // In the wheel case this makes the zoom feel more like its going at a
        // linear speed.
        zoomFactor = (this.values.containerHeight * this.values.zoomFactor) / (this.values.containerHeight + dz * 2);
      } else {
        // It feels too fast if we don't divide by two... some hammer.js issue?
        zoomFactor = zoomFactor + dz / 2;
      }
      zoomFactor = this.clampZoomFactor(zoomFactor, this.options);
    }

    let virtualSpaceCenterX: VirtualSpacePixelUnit;
    let virtualSpaceCenterY: VirtualSpacePixelUnit;

    // Basic pan handling
    virtualSpaceCenterX = this.values.left + (-1 * dx) / zoomFactor;
    virtualSpaceCenterY = this.values.top + (-1 * dy) / zoomFactor;

    // Zoom BUT keep the view coordinate under the mouse pointer CONSTANT
    const oldVirtualSpaceVisibleSpaceWidth = this.values.containerWidth / this.values.zoomFactor;
    const oldVirtualSpaceVisibleSpaceHeight = this.values.containerHeight / this.values.zoomFactor;
    this.values.width = this.values.containerWidth / zoomFactor;
    this.values.height = this.values.containerHeight / zoomFactor;
    this.values.zoomFactor = zoomFactor;

    const virtualSpaceVisibleWidthDelta = this.values.width - oldVirtualSpaceVisibleSpaceWidth;
    const virtualSpaceVisibleHeightDelta = this.values.height - oldVirtualSpaceVisibleSpaceHeight;

    // The reason we use x and y here is to zoom in or out towards where the
    // pointer is positioned
    const xFocusPercent = pointerContainerX / this.values.containerWidth;
    const yFocusPercent = pointerContainerY / this.values.containerHeight;

    this.values.left = virtualSpaceCenterX - virtualSpaceVisibleWidthDelta * xFocusPercent;
    this.values.top = virtualSpaceCenterY - virtualSpaceVisibleHeightDelta * yFocusPercent;
    this.values.centerX = virtualSpaceCenterX + this.values.width / 2;
    this.values.centerY = virtualSpaceCenterY + this.values.height / 2;

    this.onUpdated?.();
  }

  public recenter(x: VirtualSpacePixelUnit, y: VirtualSpacePixelUnit, newZoomFactor?: ZoomFactor): void {
    if (newZoomFactor !== undefined) {
      this.values.zoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
      this.values.width = this.values.containerWidth / this.values.zoomFactor;
      this.values.height = this.values.containerHeight / this.values.zoomFactor;
    }
    this.values.centerX = x;
    this.values.centerY = y;
    this.values.left = x - this.values.width / 2;
    this.values.top = y - this.values.height / 2;
    this.onUpdated?.();
  }

  public updateTopLeft(x: VirtualSpacePixelUnit, y: VirtualSpacePixelUnit, zoomFactor?: ZoomFactor): void {
    if (zoomFactor !== undefined) {
      this.values.zoomFactor = this.clampZoomFactor(zoomFactor, this.options);
      this.values.width = this.values.containerWidth / this.values.zoomFactor;
      this.values.height = this.values.containerHeight / this.values.zoomFactor;
    }
    this.values.centerX = x + this.values.width / 2;
    this.values.centerY = y + this.values.height / 2;
    this.values.left = x;
    this.values.top = y;
    this.onUpdated?.();
  }

  private clampZoomFactor = (value: ZoomFactor, minMax?: ZoomFactorMinMaxOptions) => {
    return clamp(value, minMax?.zoomFactorMin || 0.01, minMax?.zoomFactorMax || 10);
  };
}
