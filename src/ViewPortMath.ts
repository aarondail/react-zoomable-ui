import { clamp, clampCenterOfLength } from './utils';
import { ClientPixelUnit, ViewPortBounds, VirtualSpacePixelUnit, ZoomFactor } from './ViewPort';
import { ViewPortCameraValues } from './ViewPortCamera';

export const ViewPortMath = {
  deriveActualZoomBounds(
    { containerWidth, containerHeight }: ViewPortCameraValues,
    bounds: ViewPortBounds,
    defaultZoomBounds: readonly [number, number],
  ): Pick<ViewPortBounds, 'zoom'> {
    let min;
    let max;
    if (bounds?.x && bounds.x?.[0] !== undefined && bounds.x?.[1] !== undefined) {
      const space: VirtualSpacePixelUnit = bounds.x[1] - bounds.x[0];
      min = containerWidth / space;
    }
    if (bounds?.y && bounds.y?.[0] !== undefined && bounds.y?.[1] !== undefined) {
      const space: VirtualSpacePixelUnit = bounds.y[1] - bounds.y[0];
      min = min ? Math.max(min, containerHeight / space) : containerHeight / space;
    }
    if (bounds?.zoom) {
      if (bounds.zoom[0] !== undefined) {
        min = min ? Math.max(min, bounds.zoom[0]) : bounds.zoom[0];
      }
      if (bounds.zoom[1] !== undefined) {
        max = bounds.zoom[1];
      }
    }
    if (min === undefined) {
      if (max === undefined) {
        return { zoom: defaultZoomBounds };
      }
      return { zoom: [defaultZoomBounds[0], max] };
    } else {
      return { zoom: [min, max ?? defaultZoomBounds[1]] };
    }
  },

  centerFitArea(
    values: ViewPortCameraValues,
    bounds: ViewPortBounds,
    area: {
      readonly left: VirtualSpacePixelUnit;
      readonly top: VirtualSpacePixelUnit;
      readonly width: VirtualSpacePixelUnit;
      readonly height: VirtualSpacePixelUnit;
    },
    additionalBounds?: Pick<ViewPortBounds, 'zoom'>,
  ): void {
    const { left, top, width, height } = area;
    const cx = left + width / 2;
    const cy = top + height / 2;
    const zoomFactorBasedOnWidth = values.containerWidth / width;
    const zoomFactorBasedOnHeight = values.containerHeight / height;
    let newZoomFactor = Math.min(zoomFactorBasedOnWidth, zoomFactorBasedOnHeight);
    newZoomFactor = clamp(newZoomFactor, additionalBounds?.zoom);
    newZoomFactor = clamp(newZoomFactor, bounds.zoom);
    ViewPortMath.updateZoom(values, bounds, newZoomFactor);
    ViewPortMath.updateTopLeft(values, bounds, cx - values.width / 2, cy - values.height / 2);
  },

  centerFitHorizontalArea(
    values: ViewPortCameraValues,
    bounds: ViewPortBounds,
    left: VirtualSpacePixelUnit,
    width: VirtualSpacePixelUnit,
    additionalBounds?: Pick<ViewPortBounds, 'zoom'>,
  ): void {
    let newZoomFactor = values.containerWidth / width;
    newZoomFactor = clamp(newZoomFactor, additionalBounds?.zoom);
    newZoomFactor = clamp(newZoomFactor, bounds.zoom);
    const top = values.top;
    ViewPortMath.updateZoom(values, bounds, newZoomFactor);
    ViewPortMath.updateTopLeft(values, bounds, left, top);
  },

  updateBounds(values: ViewPortCameraValues, bounds: ViewPortBounds) {
    values.zoomFactor = clamp(values.zoomFactor, bounds.zoom);
    const oldVirtualSpaceVisibleSpaceWidth = values.width;
    const oldVirtualSpaceVisibleSpaceHeight = values.height;
    values.width = values.containerWidth / values.zoomFactor;
    values.height = values.containerHeight / values.zoomFactor;

    values.centerX = clampCenterOfLength(
      values.centerX + (values.width - oldVirtualSpaceVisibleSpaceWidth) / 2,
      values.width,
      bounds?.x,
    );
    values.centerY = clampCenterOfLength(
      values.centerY + (values.height - oldVirtualSpaceVisibleSpaceHeight) / 2,
      values.height,
      bounds?.y,
    );
    values.left = values.centerX - values.width / 2;
    values.top = values.centerY - values.height / 2;
  },

  // Combine these
  updateBy(
    values: ViewPortCameraValues,
    bounds: ViewPortBounds,
    dx: VirtualSpacePixelUnit,
    dy: VirtualSpacePixelUnit,
    dZoom?: ZoomFactor,
    anchorContainerX?: ClientPixelUnit,
    anchorContainerY?: ClientPixelUnit,
  ) {
    // The math in here could probably get cleaned up...

    const oldVirtualSpaceVisibleSpaceWidth = values.containerWidth / values.zoomFactor;
    const oldVirtualSpaceVisibleSpaceHeight = values.containerHeight / values.zoomFactor;

    // Basic pan handling
    const virtualSpaceNewLeft = values.left + dx;
    const virtualSpaceNewTop = values.top + dy;

    if (dZoom !== undefined && dZoom !== 0) {
      ViewPortMath.updateZoom(values, bounds, values.zoomFactor + dZoom);
    }

    // Zoom BUT keep the view coordinate under the mouse pointer CONSTANT
    const virtualSpaceVisibleWidthDelta = values.width - oldVirtualSpaceVisibleSpaceWidth;
    const virtualSpaceVisibleHeightDelta = values.height - oldVirtualSpaceVisibleSpaceHeight;

    // The reason we use x and y here is to zoom in or out towards where the
    // pointer is positioned
    const xFocusPercent = anchorContainerX === undefined ? 0.5 : anchorContainerX / values.containerWidth;
    const yFocusPercent = anchorContainerY === undefined ? 0.5 : anchorContainerY / values.containerHeight;

    values.centerX = clampCenterOfLength(
      virtualSpaceNewLeft - virtualSpaceVisibleWidthDelta * xFocusPercent + values.width / 2,
      values.width,
      bounds?.x,
    );
    values.centerY = clampCenterOfLength(
      virtualSpaceNewTop - virtualSpaceVisibleHeightDelta * yFocusPercent + values.height / 2,
      values.height,
      bounds?.y,
    );
    values.left = values.centerX - values.width / 2;
    values.top = values.centerY - values.height / 2;
  },

  updateTopLeft(
    values: ViewPortCameraValues,
    bounds: ViewPortBounds,
    x: VirtualSpacePixelUnit,
    y: VirtualSpacePixelUnit,
  ): void {
    values.centerX = clampCenterOfLength(x + values.width / 2, values.width, bounds.x);
    values.centerY = clampCenterOfLength(y + values.height / 2, values.height, bounds.y);
    values.left = values.centerX - values.width / 2;
    values.top = values.centerY - values.height / 2;
  },

  updateZoom(values: ViewPortCameraValues, bounds: ViewPortBounds, zoomFactor: ZoomFactor) {
    if (zoomFactor !== undefined) {
      values.zoomFactor = clamp(zoomFactor, bounds.zoom);
      values.width = values.containerWidth / values.zoomFactor;
      values.height = values.containerHeight / values.zoomFactor;
      values.left = values.centerX - values.width / 2;
      values.top = values.centerY - values.height / 2;
    }
  },
};
