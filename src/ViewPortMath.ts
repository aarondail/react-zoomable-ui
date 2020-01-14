import { clamp, clampCenterOfLength } from './utils';
import { ClientPixelUnit, ViewPortBounds, VirtualSpacePixelUnit, ZoomFactor } from './ViewPort';
import { ViewPortCameraValues } from './ViewPortCamera';

export const ViewPortMath = {
  deriveActualZoomBounds(
    bounds: ViewPortBounds,
    containerWidth: ClientPixelUnit,
    containerHeight: ClientPixelUnit,
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
    return { zoom: min === undefined && max === undefined ? undefined : [min, max] };
  },

  // Try to get rid of
  centerOn(
    values: ViewPortCameraValues,
    bounds: ViewPortBounds,
    x: VirtualSpacePixelUnit,
    y: VirtualSpacePixelUnit,
    zoomFactor?: ZoomFactor,
  ): void {
    if (zoomFactor !== undefined) {
      values.zoomFactor = clamp(zoomFactor, bounds.zoom);
      values.width = values.containerWidth / values.zoomFactor;
      values.height = values.containerHeight / values.zoomFactor;
    }

    values.centerX = clampCenterOfLength(x, values.width, bounds.x);
    values.centerY = clampCenterOfLength(y, values.height, bounds.y);
    values.left = values.centerX - values.width / 2;
    values.top = values.centerY - values.height / 2;
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
    ViewPortMath.centerOn(values, bounds, cx, cy, newZoomFactor);
  },

  updateBounds(values: ViewPortCameraValues, bounds: ViewPortBounds) {
    values.zoomFactor = clamp(values.zoomFactor, bounds.zoom);
    const oldVirtualSpaceVisibleSpaceWidth = values.width;
    const oldVirtualSpaceVisibleSpaceHeight = values.height;
    values.width = values.containerWidth / values.zoomFactor;
    values.height = values.containerHeight / values.zoomFactor;

    // And clamp down on the x and y position of the camera
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
    anchorContainerX?: VirtualSpacePixelUnit,
    anchorContainerY?: VirtualSpacePixelUnit,
  ) {
    // Translate all the coordinates to client pixels and then let the other
    // method deal with this...
    ViewPortMath.updateByInClientPixels(
      values,
      bounds,
      dx * values.zoomFactor,
      dy * values.zoomFactor,
      dZoom,
      anchorContainerX !== undefined ? anchorContainerX * values.zoomFactor : undefined,
      anchorContainerY !== undefined ? anchorContainerY * values.zoomFactor : undefined,
    );
  },

  updateByInClientPixels(
    values: ViewPortCameraValues,
    bounds: ViewPortBounds,
    dx: ClientPixelUnit,
    dy: ClientPixelUnit,
    dZoom?: ZoomFactor,
    anchorContainerX?: ClientPixelUnit,
    anchorContainerY?: ClientPixelUnit,
  ) {
    let zoomFactor = values.zoomFactor;
    if (dZoom !== undefined && dZoom !== 0) {
      zoomFactor += dZoom;
      zoomFactor = clamp(zoomFactor, bounds.zoom);
    }

    // Basic pan handling
    const virtualSpaceNewLeft = values.left + dx / zoomFactor;
    const virtualSpaceNewTop = values.top + dy / zoomFactor;

    // The math below here could probably get cleaned up...

    // Zoom BUT keep the view coordinate under the mouse pointer CONSTANT
    const oldVirtualSpaceVisibleSpaceWidth = values.containerWidth / values.zoomFactor;
    const oldVirtualSpaceVisibleSpaceHeight = values.containerHeight / values.zoomFactor;
    values.width = values.containerWidth / zoomFactor;
    values.height = values.containerHeight / zoomFactor;
    values.zoomFactor = zoomFactor;

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
    zoomFactor?: ZoomFactor,
  ): void {
    // This looks deceptively like recenter, but if the zoomFactor is changing
    // the width and height area gets changed and so it can result in a
    // different result
    if (zoomFactor !== undefined) {
      values.zoomFactor = clamp(zoomFactor, bounds.zoom);
      values.width = values.containerWidth / values.zoomFactor;
      values.height = values.containerHeight / values.zoomFactor;
    }
    values.centerX = clampCenterOfLength(x + values.width / 2, values.width, bounds.x);
    values.centerY = clampCenterOfLength(y + values.height / 2, values.height, bounds.y);
    values.left = values.centerX - values.width / 2;
    values.top = values.centerY - values.height / 2;
  },
};
