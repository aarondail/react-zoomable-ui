import { ScreenPixelUnit, VirtualSpaceUnit, ZoomFactor } from './ViewPort';
export interface ViewPortInterface {
  readonly viewLeft: VirtualSpaceUnit;
  readonly viewTop: VirtualSpaceUnit;
  readonly screenWidth: ScreenPixelUnit;
  readonly screenHeight: ScreenPixelUnit;
  readonly zoomFactor: ZoomFactor; // E.g. 2 is zoomed in, 1 is exactly at pixel perfect match to imgaes, and 0.5 is zoomed out.
  readonly addEventListener: (event: 'updated', listener: () => void) => void;
  readonly removeEventListener: (
    event: 'updated',
    listener: () => void,
  ) => void;
  readonly reset: () => void;
  readonly update: (
    newViewCenterX: VirtualSpaceUnit,
    newViewCenterY: VirtualSpaceUnit,
    newZoomFactor: ZoomFactor,
  ) => void;
}
