// 0,0 as top left of browser window to screenWidth, screenHeight as button right.
export type ScreenPixelUnit = number;
// 0,0 as the top left of the virtual space we want to render stuff in, increasing to the bottom right.
export type VirtualSpaceUnit = number;
// 2 means 2x zoomed in, 0.5 means 2x zoomed out.
export type ZoomFactor = number;

export interface ViewPortInterface {
  readonly virtualSpaceLeft: VirtualSpaceUnit;
  readonly virtualSpaceTop: VirtualSpaceUnit;
  readonly containerWidth: ScreenPixelUnit;
  readonly containerHeight: ScreenPixelUnit;
  readonly zoomFactor: ZoomFactor; // E.g. 2 is zoomed in, 1 is exactly at pixel perfect match to imgaes, and 0.5 is zoomed out.

  readonly addEventListener: (event: 'updated', listener: () => void) => void;
  readonly removeEventListener: (event: 'updated', listener: () => void) => void;
  readonly reset: () => void;
  readonly update: (
    newVirtualSpaceCenterX: VirtualSpaceUnit,
    newVirtualSpaceCenterY: VirtualSpaceUnit,
    newZoomFactor: ZoomFactor,
  ) => void;
}
