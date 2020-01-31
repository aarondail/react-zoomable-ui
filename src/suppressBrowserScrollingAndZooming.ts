export type CancelSuppressZoomingCallback = () => void;

/**
 * This is not used by the ViewPort, but if you have HTML elements around the
 * ViewPort you may want to suppress zooming or panning on the whole page. This
 * function will do that.
 */
export function suppressBrowserScrollingAndZooming(element: HTMLElement): CancelSuppressZoomingCallback {
  const handleWheel = (e: WheelEvent) => {
    // If we want to just suppress pinch-gestures on desktop browsers we can
    // look for whether the control key is pressed in the event. For whatever
    // reason, that can distinguish scrolling and pinching in this event.
    e.preventDefault();
  };
  const handleGestureChangeForSafari = (e: any) => {
    e.preventDefault();
  };

  element.addEventListener('wheel', handleWheel);
  element.addEventListener('gesturechange', handleGestureChangeForSafari);

  return () => {
    element.removeEventListener('wheel', handleWheel);
    element.removeEventListener('gesturechange', handleGestureChangeForSafari);
  };
}
