export type CancelSuppressZoomingCallback = () => void;

/**
 * This is not used by the `ViewPort`, but if you have HTML elements around the
 * `ViewPort` you may want to suppress zooming or panning on the whole page. This
 * function will do that.
 *
 * @returns A callback which will stop the suppression.
 */
export function suppressBrowserZooming(): CancelSuppressZoomingCallback {
  const handleWheel = (e: WheelEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    // We just want to suppress pinch-gestures on desktop browsers. We have to
    // look for whether the control key is pressed in this event... for whatever
    // reason, that can distinguish scrolling and pinching in this event.
    if (e.ctrlKey) {
      e.preventDefault();
    }
  };
  const handleGestureStartForSafari = (e: any) => {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
  };
  const handleGestureChangeForSafari = (e: any) => {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
  };
  const handleTouchMove = (e: TouchEvent) => {
    if (e.defaultPrevented) {
      return;
    }
    if (e.touches.length === 2) {
      e.preventDefault();
    }
  };

  document.addEventListener('wheel', handleWheel, { passive: false });
  document.addEventListener('gesturestart', handleGestureStartForSafari);
  document.addEventListener('gesturechange', handleGestureChangeForSafari);
  document.addEventListener('touchmove', handleTouchMove, { passive: false });

  return () => {
    document.removeEventListener('wheel', handleWheel);
    document.removeEventListener('gesturestart', handleGestureStartForSafari);
    document.removeEventListener('gesturechange', handleGestureChangeForSafari);
    document.removeEventListener('touchmove', handleTouchMove);
  };
}
