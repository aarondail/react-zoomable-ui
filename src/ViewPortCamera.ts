import { clamp } from './utils';
import { ClientPixelUnit, VirtualSpacePixelUnit, ZoomFactor, ZoomFactorMinMaxOptions } from './ViewPort';

type MoveByMethod = (
  dx: VirtualSpacePixelUnit,
  dy: VirtualSpacePixelUnit,
  dz: VirtualSpacePixelUnit,
  pointerContainerX: ClientPixelUnit,
  pointerContainerY: ClientPixelUnit,
  eventType?: 'mouse' | 'touch' | 'wheel',
) => void;

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
  private animationFrameId?: number;
  private hasPendingUpdate: boolean;
  private pendingUpdateParameters: Parameters<MoveByMethod>;

  private doingDecel?: boolean;
  private decel?: any;

  constructor(
    private readonly values: ViewPortCameraValues,
    private readonly onUpdated?: () => void,
    private readonly zoomMinMax?: ZoomFactorMinMaxOptions,
  ) {
    this.hasPendingUpdate = false;
    this.pendingUpdateParameters = [0, 0, 0, 0, 0, undefined];
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
    const zoomFactorBasedOnWidth = this.values.containerWidth / width;
    const zoomFactorBasedOnHeight = this.values.containerHeight / height;
    let newZoomFactor = Math.min(zoomFactorBasedOnWidth, zoomFactorBasedOnHeight);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, options);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, this.zoomMinMax);
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
    newZoomFactor = this.clampZoomFactor(newZoomFactor, this.zoomMinMax);
    this.updateTopLeft(centerX - this.values.width / newZoomFactor / 2, this.values.top, newZoomFactor);
  }

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  public moveBy = (
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dz: ClientPixelUnit,
    pointerContainerX: ClientPixelUnit,
    pointerContainerY: ClientPixelUnit,
    eventType?: 'mouse' | 'touch' | 'wheel',
  ) => {
    if (this.hasPendingUpdate === false) {
      this.pendingUpdateParameters[0] = dx;
      this.pendingUpdateParameters[1] = dy;
      this.pendingUpdateParameters[2] = dz;
      this.pendingUpdateParameters[3] = pointerContainerX;
      this.pendingUpdateParameters[4] = pointerContainerY;
      this.pendingUpdateParameters[5] = eventType;
      this.hasPendingUpdate = true;
      this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
    } else {
      // There is already a pending update so we need to merge the new values
      // with that or do it if we don't think it can safely be merged
      if (this.pendingUpdateParameters[5] !== eventType && this.pendingUpdateParameters[5] !== undefined) {
        // The updates for from a different type (mouse, touch) so just do them
        // separately. If we try to merge them the update method might do the
        // wrong thing (even though its unlikely)
        this.moveBy(...this.pendingUpdateParameters);
        this.hasPendingUpdate = false;
        // Just call ourselves again so we will hit the code above and schedule
        // the new update
        this.moveByPrime(dx, dy, dz, pointerContainerX, pointerContainerY, eventType);
      } else {
        // Merge the pending update with the new values
        this.pendingUpdateParameters[0] += dx;
        this.pendingUpdateParameters[1] += dy;
        this.pendingUpdateParameters[2] += dz;
        this.pendingUpdateParameters[3] = pointerContainerX;
        this.pendingUpdateParameters[4] = pointerContainerY;
      }
    }
  };

  public moveByDeceleration = (vx: ClientPixelUnit, vy: ClientPixelUnit) => {
    // TODO do better
    if (this.hasPendingUpdate) {
      this.hasPendingUpdate = false;
    }

    const C = 20;
    this.doingDecel = true;
    this.decel = {
      vx: vx * C,
      vy: vy * C,
    };
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
    }
  };

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

  public recenter(x: VirtualSpacePixelUnit, y: VirtualSpacePixelUnit, newZoomFactor?: ZoomFactor): void {
    if (newZoomFactor !== undefined) {
      this.values.zoomFactor = this.clampZoomFactor(newZoomFactor, this.zoomMinMax);
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
      this.values.zoomFactor = this.clampZoomFactor(zoomFactor, this.zoomMinMax);
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

  private handleAnimationFrame = (/*time: number*/) => {
    this.animationFrameId = undefined;
    // var progress = time - (this.priorTimestamp || time);
    // this.priorTimestamp = time;
    if (this.hasPendingUpdate) {
      this.moveByPrime(...this.pendingUpdateParameters);
      this.doingDecel = false;
      this.hasPendingUpdate = false;
    }
    if (this.doingDecel) {
      console.log('doingdecel');
      let dx = this.decel.vx * 0.84;
      if (Math.abs(dx) < 0.2) {
        dx = 0;
      }
      this.decel.vx = dx;
      let dy = this.decel.vy * 0.84;
      if (Math.abs(dy) < 0.2) {
        dy = 0;
      }
      this.decel.vy = dy;

      if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
        // TODO dx and dy are in client but shoudl be invirtual pixels
        this.moveByPrime(dx, dy, 0, 0, 0, undefined);
        this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
      }
    }
  };

  private moveByPrime(
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
      zoomFactor = this.clampZoomFactor(zoomFactor, this.zoomMinMax);
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
}
