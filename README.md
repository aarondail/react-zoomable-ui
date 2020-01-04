## ZOOMABLE UI

Components:

- Pan zoom area
- With inner elements that can respond in a nuanced way to presss and long-presses
- The elements can trigger a press, drag on the area, or long-press and become draggable.
- Draggable and droppable objects

## Notes that need to be added to somewhere later to understand

## Cavets

1. Scrollable area inside the zoomable area:

- For components in a <Space> don't use overflow: scroll/auto inside the Zoomable Space... at least for Chrome (Safari seems ok)
- Basically you can't make scrollable via overflow :( otherwise it is too janky

## Browser Support

1. Edge, only mouse works 100%. Touch does for single finger gestures, not
   pinch/spread. Will revisit when edge moves to Chromium. Unsure about
   touchpad, but its probably fine though pinch/zoom may not work.

Unsure about IE. Probably fine for mouse and fails horribly for touch.

Unsure about stylus.

## Notes to Self

### Why did we not use impetus?

- We had to selectively ignore pan gestures sometimes, but this was tricky with the after-touch-end-momentum-pan-animation that impetus does. I think
  I was able to work around this everywhere but iOS (maybe Android too)
- Non left mouse buttons were triggering impetus
- Library looks unmaintained, long standing PRs and issues
- Specifically this one https://github.com/chrisbateman/impetus/issues/13 which has a fix and a PR and a fork repo.

Additionally:

- We already have to listen for mouse and touch events in the ViewPort to
  support interaction (detecting taps, long taps, capturing the pan for drag
  and drop, etc) so we were some of the way there to doing what it did.
- I think we need a similar animation based mechanism for moving the ViewPort,
  independent of pan gestures.
- Note a hugely used library according to npm.

### Why not hammer.js?

Not sure, need to investigate. Probably need to do the animation stuff
anyways but could overall be better.
