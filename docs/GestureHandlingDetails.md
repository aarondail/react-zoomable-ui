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

// TODO

### https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone
