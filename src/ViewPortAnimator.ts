import { ClientPixelUnit, VirtualSpacePixelUnit } from './ViewPort';

type UpdateMethod = (
  dx: VirtualSpacePixelUnit,
  dy: VirtualSpacePixelUnit,
  dz: VirtualSpacePixelUnit,
  pointerContainerX: ClientPixelUnit,
  pointerContainerY: ClientPixelUnit,
  type: string,
) => void;

export class ViewPortAnimator {
  private animationFrameId?: number;
  private hasPendingUpdate: boolean;
  private pendingUpdateParameters: Parameters<UpdateMethod>;

  public constructor(private readonly updateMethod: UpdateMethod) {
    this.hasPendingUpdate = false;
    this.pendingUpdateParameters = [0, 0, 0, 0, 0, ''];
  }

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  public updateBy = (
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dz: ClientPixelUnit,
    pointerContainerX: ClientPixelUnit,
    pointerContainerY: ClientPixelUnit,
    type: string,
  ) => {
    if (this.hasPendingUpdate === false) {
      this.pendingUpdateParameters[0] = dx;
      this.pendingUpdateParameters[1] = dy;
      this.pendingUpdateParameters[2] = dz;
      this.pendingUpdateParameters[3] = pointerContainerX;
      this.pendingUpdateParameters[4] = pointerContainerY;
      this.pendingUpdateParameters[5] = type;
      this.hasPendingUpdate = true;
      this.animationFrameId = requestAnimationFrame(this.handleAnimationFrame);
    } else {
      // There is already a pending update so we need to merge the new values
      // with that or do it if we don't think it can safely be merged
      if (this.pendingUpdateParameters[5] !== type && this.pendingUpdateParameters[5] !== '') {
        // The updates for from a different type (mouse, touch) so just do them
        // separately. If we try to merge them the update method might do the
        // wrong thing (even though its unlikely)
        this.updateMethod(...this.pendingUpdateParameters);
        this.hasPendingUpdate = false;
        // Just call ourselves again so we will hit the code above and schedule
        // the new update
        this.updateBy(dx, dy, dz, pointerContainerX, pointerContainerY, type);
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

  private handleAnimationFrame = (/*time: number*/) => {
    // var progress = time - (this.priorTimestamp || time);
    // this.priorTimestamp = time;
    if (this.hasPendingUpdate) {
      this.updateMethod(...this.pendingUpdateParameters);
      this.hasPendingUpdate = false;
    }
  };
}
