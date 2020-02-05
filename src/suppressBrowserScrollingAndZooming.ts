import { walkElementHierarchyUp } from './utils';

export type CancelSuppressBrowserScrollingAndZoomingCallback = () => void;

// Found this technique and combined them from these two sources:
// https://stackoverflow.com/a/36900407
// https://gist.github.com/jlbruno/1100124
function isVerticallyScrollable(node: HTMLElement) {
  const { overflowY } = getComputedStyle(node);
  return (overflowY === 'scroll' || overflowY === 'auto') && node.scrollHeight > node.clientHeight;
}

function isItSafeToSuppressScrollsOn(node: HTMLElement) {
  for (const e of walkElementHierarchyUp(node)) {
    if (document.body === node) {
      return true;
    }
    if (isVerticallyScrollable(e)) {
      return false;
    }
  }
  // Probably should never get here since we check for the body above
  return true;
}

/**
 * This is not used by the ViewPort, but if you have HTML elements around the
 * ViewPort you may want to suppress zooming or panning on the whole page. This
 * function will do that.
 */
export function suppressBrowserScrollingAndZooming(): CancelSuppressBrowserScrollingAndZoomingCallback {
  const handleWheel = (e: WheelEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    // If we want to just suppress pinch-gestures on desktop browsers we could
    // look for whether the control key is pressed in the event. For whatever
    // reason, that can distinguish scrolling and pinching in this event.

    // We want to see if any element at or above the target is scroll-able
    // (aside from the document itself). If we do find a scroll-able element we
    // want to let the event happen.
    if (!e.target || isItSafeToSuppressScrollsOn(e.target as any)) {
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
  const handleTouchMove = (e: any) => {
    if (e.defaultPrevented) {
      return;
    }

    // We want to see if any element at or above the target is scroll-able
    // (aside from the document itself). If we do find a scroll-able element we
    // want to let the event happen.
    if (!e.target || isItSafeToSuppressScrollsOn(e.target as any)) {
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
