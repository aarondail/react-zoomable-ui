These are some internal notes about how I implemented gesture handling.

### Why not use impetus?

I wanted to selectively ignore pan gestures sometimes, but this was tricky to do with impetus with the after-touch-end-momentum-pan-animation that impetus does. I think I was able to work around this everywhere but iOS (maybe Android too).

Additionally:

- Non-left mouse buttons were triggering pans.
- There was a bad bug on iOS where impetus just died due to pinching or something like that (probably this one: https://github.com/chrisbateman/impetus/issues/13).
- I think we need a similar animation based mechanism for moving the ViewPort, independent of pan gestures.
- The library is maybe un or under maintained at this point.
- Finally its not a hugely used library, according to npm.

### Why not pan-zoom?

Pan-zoom is built on impetus so it inherits all those issues above. Additionally some things did not work "out of the box", like pinching on mobile Safari and mobile Chrome.

### Why Hammer.js?

- Most things "just worked".
- More active and widely used.
- Good two finger panning support.

### Why did we not use Hammer for everything (why still have our own mouse/touch listeners)?

Unfortunately the hammer press and tap recognizers don't entirely do what we want. Press is almost what we want, but the order of `press` and `pressup` events is non-deterministic and if a `pan` starts it kills the `press` (wont get `pressup`) and sometimes when a pan starts we won't even get the `press` event.

Its just easier to handle presses with our own event handlers on the mouse and touch events.
