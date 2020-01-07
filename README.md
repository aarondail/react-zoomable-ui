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
- Bad bug on iOS where sometimes impetus just dies due to pinching or something.
  - Probably this one https://github.com/chrisbateman/impetus/issues/13
    (...which has a fix and a PR and a fork repo but see the next item...)
- Library looks unmaintained, long standing PRs and issues

Additionally:

- We already have to listen for mouse and touch events in the ViewPort to
  support interaction (detecting taps, long taps, capturing the pan for drag
  and drop, etc) so we were some of the way there to doing what it did.
- I think we need a similar animation based mechanism for moving the ViewPort,
  independent of pan gestures.
- Note a hugely used library according to npm.

### Hammer pros over pan-zoom

- Better two finger panning support for unknown reasons.
- More active and widely used.
- Pinch worked out of the box for mobile Safari and Chrome (didnt have to do anything special like w/ pan-zoom).

### Why did we not use Hammer for everything (why still have our own mouse/touch listeners)?

Unfortunately the hammer press and tap recognizers don't entirely do what we
want. Press is almost what we want, but the order of `press` and `pressup`
events is non-deterministic and if a `pan` starts it kills the `press` (wont
get `pressup`) and sometimes when a pan starts we won't even get the `press`
event.

Tap happens after you release, so its also not what we want (still need to
know about the press when it starts, so we have the same problems as above)

This all ends up meaning its easier to handle presses with our own event
handlers on the mouse and touch events.
