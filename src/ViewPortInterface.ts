// 0,0 as top left of browser window to screenWidth, screenHeight as button right.
export type ScreenPixelUnit = number;
// 0,0 as the top left pixel of the virtual space we want to render stuff in, increasing to the bottom right.
export type VirtualSpacePixelUnit = number;
// 2 means 2x zoomed in, 0.5 means 2x zoomed out.
export type ZoomFactor = number;

/**
 * THe ViewPortInterface represents a "view" into a virtual space, that is not
 * tied to the available screen space or HTML elements. Because of this, it is
 * infinite, but it also uses its own "units" (virtual space pixels).
 *
 * You can think of the view port as describing what rectangular portion of the
 * virtual space (from top left to bottom right) should be visible inside the
 * bounds of containing HTML element where the virtual space is being rendered.
 *
 * The properties on this interface are readonly, as updates should be made via
 * specific methods like `update`.
 */
export interface ViewPortInterface {
  readonly left: VirtualSpacePixelUnit;
  readonly top: VirtualSpacePixelUnit;
  readonly centerX: VirtualSpacePixelUnit;
  readonly centerY: VirtualSpacePixelUnit;
  readonly width: VirtualSpacePixelUnit;
  readonly height: VirtualSpacePixelUnit;
  readonly zoomFactor: ZoomFactor; // E.g. 2 is zoomed in, 1 is exactly at pixel perfect match to imgaes, and 0.5 is zoomed out.

  readonly containerWidth: ScreenPixelUnit;
  readonly containerHeight: ScreenPixelUnit;

  readonly addEventListener: (event: 'updated', listener: () => void) => void;
  readonly removeEventListener: (event: 'updated', listener: () => void) => void;
  readonly reset: () => void;
  readonly update: (centerX: VirtualSpacePixelUnit, centerY: VirtualSpacePixelUnit, newZoomFactor: ZoomFactor) => void;
}
