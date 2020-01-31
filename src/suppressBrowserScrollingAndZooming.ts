export type CancelSuppressBrowserScrollingAndZoomingCallback = () => void;

/**
 * This is not used by the ViewPort, but if you have HTML elements around the
 * ViewPort you may want to suppress zooming or panning on the whole page. This
 * function will do that.
 */
export function suppressBrowserScrollingAndZooming(): CancelSuppressBrowserScrollingAndZoomingCallback {
  const handleWheel = (e: WheelEvent) => {
    // If we want to just suppress pinch-gestures on desktop browsers we can
    // look for whether the control key is pressed in the event. For whatever
    // reason, that can distinguish scrolling and pinching in this event.
    e.preventDefault();
  };
  const handleGestureStartForSafari = (e: any) => {
    e.preventDefault();
  };
  const handleGestureChangeForSafari = (e: any) => {
    e.preventDefault();
  };
  const handleTouchMove = (e: any) => {
    e.preventDefault();
  };

  document.addEventListener('wheel', handleWheel);
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
