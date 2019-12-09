// tslint:disable-next-line: no-implicit-dependencies - Disable this until we get our changes merged into pan-zoom
import { PanZoomEvent } from 'pan-zoom';

import { clamp } from './utils';
import { ScreenPixelUnit, ViewPortInterface, VirtualSpaceUnit, ZoomFactor } from './ViewPortInterface';

export class ViewPort implements ViewPortInterface {
  public virtualSpaceLeft: VirtualSpaceUnit;
  public virtualSpaceTop: VirtualSpaceUnit;
  public containerWidth: ScreenPixelUnit;
  public containerHeight: ScreenPixelUnit;
  public zoomFactor: ZoomFactor; // E.g. 2 is zoomed in, 1 is exactly at pixel perfect match to images, and 0.5 is zoomed out.

  // tslint:disable-next-line:readonly-array
  private updateListeners: Array<() => void>;

  constructor(private readonly zoomFactorMin?: number, private readonly zoomFactorMax?: number) {
    this.updateListeners = [];
    this.virtualSpaceLeft = 0;
    this.virtualSpaceTop = 0;
    this.containerWidth = 0;
    this.containerHeight = 0;
    this.zoomFactor = 1;
  }

  public addEventListener(event: 'updated', listener: () => void): void {
    this.updateListeners.push(listener);
  }

  public processPanZoomEvent = (e: PanZoomEvent) => {
    let zoomFactor = this.zoomFactor;
    if (e.dz !== 0) {
      if (e.type === 'mouse') {
        zoomFactor = (this.containerHeight * this.zoomFactor) / (this.containerHeight + e.dz * 2);
      } else if (e.type === 'touch') {
        // This logic is the same as the touch one above (which handles mouse
        // wheels) but I wanted to keep it separate in case we want to tweak it.
        //
        // The thing is, this logic seems fine for the mouse wheel but for touch
        // and pinch gestures I know the logic is not perfect here. It does a
        // decent job of keeping the areas that the user touched underneath
        // their fingers as they pinch or spread. 2 is just a magic number,
        // don't think much about it. A better way to do this might be to get
        // the finger positions (and track the old ones) and use that to make
        // sure the coordinates under both fingers (in the virtual space) stayed
        // the same... but at the same time that would have to factor in stuff
        // like using 2 fingers to drag so I am not sure that is easy... or
        // possible.
        zoomFactor = (this.containerHeight * this.zoomFactor) / (this.containerHeight + e.dz * 2);
      }
      zoomFactor = clamp(zoomFactor, this.zoomFactorMin || 0.01, this.zoomFactorMax || 10);
    }

    let virtualSpaceCenterX: VirtualSpaceUnit;
    let virtualSpaceCenterY: VirtualSpaceUnit;

    // Basic pan handling
    virtualSpaceCenterX = this.virtualSpaceLeft + (-1 * e.dx) / zoomFactor;
    virtualSpaceCenterY = this.virtualSpaceTop + (-1 * e.dy) / zoomFactor;

    // Zoom BUT keep the view coordinate under the mouse pointer CONSTANT
    const oldVirtualSpaceVisibleSpaceWidth = this.containerWidth / this.zoomFactor;
    const oldVirtualSpaceVisibleSpaceHeight = this.containerHeight / this.zoomFactor;
    const newVirtualSpaceVisibleWidth = this.containerWidth / zoomFactor;
    const newVirtualSpaceVisibleHeight = this.containerHeight / zoomFactor;

    const virtualSpaceVisibleWidthDelta = newVirtualSpaceVisibleWidth - oldVirtualSpaceVisibleSpaceWidth;
    const virtualSpaceVisibleHeightDelta = newVirtualSpaceVisibleHeight - oldVirtualSpaceVisibleSpaceHeight;

    // The reason we use x and y here is to zoom in or out towards where the
    // pointer is positioned
    const xFocusPercent = e.x / this.containerWidth;
    const yFocusPercent = e.y / this.containerHeight;

    virtualSpaceCenterX = virtualSpaceCenterX - virtualSpaceVisibleWidthDelta * xFocusPercent;
    virtualSpaceCenterY = virtualSpaceCenterY - virtualSpaceVisibleHeightDelta * yFocusPercent;

    // And finally we are done
    this.update(virtualSpaceCenterX, virtualSpaceCenterY, zoomFactor);
  };

  public removeEventListener(event: 'updated', listener: () => void): void {
    const index = this.updateListeners.indexOf(listener);
    if (index >= 0) {
      this.updateListeners.splice(index, 1);
    }
  }

  public reset(): void {
    this.virtualSpaceLeft = 0;
    this.virtualSpaceTop = 0;
    this.containerWidth = 0;
    this.containerHeight = 0;
    this.zoomFactor = 1;
    this.updateListeners = [];
  }

  public update(newViewCenterX: VirtualSpaceUnit, newViewCenterY: VirtualSpaceUnit, newZoomFactor: ZoomFactor): void {
    this.virtualSpaceLeft = newViewCenterX;
    this.virtualSpaceTop = newViewCenterY;
    this.zoomFactor = newZoomFactor;

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
  }

  public updateContainerDimensions(width: ScreenPixelUnit, height: ScreenPixelUnit): void {
    this.containerWidth = width;
    this.containerHeight = height;

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
  }
}
