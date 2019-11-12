// tslint:disable-next-line: no-implicit-dependencies - Disable this until we get our changes merged into pan-zoom
import { PanZoomEvent } from 'pan-zoom';

import { clamp } from './utils';
import { ViewPortInterface } from './ViewPortInterface';

// 0,0 as top left of browser window to screenWidth, screenHeight as button right.
export type ScreenPixelUnit = number;
// 0,0 as the top left of the virtual space we want to render stuff in, increasing to the bottom right.
export type VirtualSpaceUnit = number;
// 2 means 2x zoomed in, 0.5 means 2x zoomed out.
export type ZoomFactor = number;

export class ViewPort implements ViewPortInterface {
  public viewLeft: VirtualSpaceUnit;
  public viewTop: VirtualSpaceUnit;
  // public viewCenterX: WorkSpaceVirtualSpaceUnits;
  // public viewCenterY: WorkSpaceVirtualSpaceUnits;
  public screenWidth: ScreenPixelUnit;
  public screenHeight: ScreenPixelUnit;
  public zoomFactor: ZoomFactor; // E.g. 2 is zoomed in, 1 is exactly at pixel perfect match to imgaes, and 0.5 is zoomed out.

  // tslint:disable-next-line:readonly-array
  private updateListeners: Array<() => void>;

  constructor(
    private readonly zoomFactorMin?: number,
    private readonly zoomFactorMax?: number,
  ) {
    this.updateListeners = [];
    this.viewLeft = 0;
    this.viewTop = 0;
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.zoomFactor = 1;
  }

  public addEventListener(event: 'updated', listener: () => void): void {
    this.updateListeners.push(listener);
  }

  public processPanZoomEvent = (e: PanZoomEvent) => {
    // During the very initial startup sometimes we get a pan/zoom that has 0
    // for these. Ignore it in this case. Probably a better plan would be to try
    // and init pan zoom at some pointer point.
    if (e.x === 0 && e.y === 0) {
      return;
    }

    // Zoom
    let zoomFactor = this.zoomFactor;
    zoomFactor -= e.dz / 100;
    // Don't let the zoomFactor get to 0 otherwise it gets stuck ;)
    zoomFactor = clamp(
      zoomFactor,
      this.zoomFactorMin || 0.01,
      this.zoomFactorMax || 10,
    );

    let viewCenterX: VirtualSpaceUnit;
    let viewCenterY: VirtualSpaceUnit;

    // Basic pan handling
    viewCenterX = this.viewLeft + (-1 * e.dx) / zoomFactor;
    viewCenterY = this.viewTop + (-1 * e.dy) / zoomFactor;

    // Zoom BUT keep the view coordinate under the mouse pointer CONSTANT
    const oldViewWidth = this.screenWidth / this.zoomFactor;
    const oldViewHeight = this.screenHeight / this.zoomFactor;
    const newViewWidth = this.screenWidth / zoomFactor;
    const newViewHeight = this.screenHeight / zoomFactor;

    const viewPortWidthDelta = newViewWidth - oldViewWidth;
    const viewPortHeightDelta = newViewHeight - oldViewHeight;

    // The reason we use x and y here is to zoom in or out towards where the
    // pointer is positioned
    const xFocusPercent = e.x / this.screenWidth;
    const yFocusPercent = e.y / this.screenHeight;

    viewCenterX = viewCenterX - viewPortWidthDelta * xFocusPercent;
    viewCenterY = viewCenterY - viewPortHeightDelta * yFocusPercent;

    // And finally we are done
    this.update(viewCenterX, viewCenterY, zoomFactor);
  };

  public removeEventListener(event: 'updated', listener: () => void): void {
    const index = this.updateListeners.indexOf(listener);
    if (index >= 0) {
      this.updateListeners.splice(index, 1);
    }
  }

  public reset(): void {
    this.viewLeft = 0;
    this.viewTop = 0;
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.zoomFactor = 1;
    this.updateListeners = [];
  }

  public update(
    newViewCenterX: VirtualSpaceUnit,
    newViewCenterY: VirtualSpaceUnit,
    newZoomFactor: ZoomFactor,
  ): void {
    this.viewLeft = newViewCenterX;
    this.viewTop = newViewCenterY;
    this.zoomFactor = newZoomFactor;

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
  }

  public updateScreenDimensions(
    width: ScreenPixelUnit,
    height: ScreenPixelUnit,
  ): void {
    this.screenWidth = width;
    this.screenHeight = height;

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
  }
}
