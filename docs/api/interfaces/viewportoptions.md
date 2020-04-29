# Interface: ViewPortOptions

## Hierarchy

- **ViewPortOptions**

## Index

### Properties

- [onHover](viewportoptions.md#optional-onhover)
- [onPressCancel](viewportoptions.md#optional-onpresscancel)
- [onContextMenu](viewportoptions.md#optional-oncontextmenu)
- [onPressEnd](viewportoptions.md#optional-onpressend)
- [onPressMove](viewportoptions.md#optional-onpressmove)
- [onPressStart](viewportoptions.md#optional-onpressstart)
- [onUpdated](viewportoptions.md#optional-onupdated)
- [treatRightClickAsPan](viewportoptions.md#optional-treatrightclickaspan)
- [treatTwoFingerTrackPadGesturesLikeTouch](viewportoptions.md#optional-treattwofingertrackpadgesturesliketouch)

## Properties

### `Optional` onHover

• **onHover**? : _undefined &#124; function_

---

### `Optional` onPressCancel

• **onPressCancel**? : _undefined &#124; function_

After a press starts there are some cases where it can be canceled rather
than ended. For example when on finger starts touching the screen that
will trigger `onPressStart`. If a second finger starts touching the screen
though, that will cause the press to be "cancelled". A press is
effectively a single finger touch or mouse/track-pad click and drag
motion.

---

### `Optional` onContextMenu

• **onContextMenu**? : _undefined &#124; function_

Called when a right click happens inside the [ViewPort](../classes/viewport.md).

---

### `Optional` onPressEnd

• **onPressEnd**? : _undefined &#124; function_

Called when a press ends normally by the user releasing the mouse button
or lifting their finger.

---

### `Optional` onPressMove

• **onPressMove**? : _undefined &#124; function_

Called when a press moves, IF the press is currently captured (see
[onPressStart](viewportoptions.md#optional-onpressstart)). The callback can release the captured press by
returning `'release'`.

---

### `Optional` onPressStart

• **onPressStart**? : _undefined &#124; function_

Called when a press (press being a left mouse click or a single finger
touch) starts in the [ViewPort](../classes/viewport.md). The callback can return whether the
interaction should be captured, in which case the other `onPress*` methods
will be called. Or it can be ignored (in which case nothing at all will
happen). Finally, the callback can return `undefined` which will initiate
the default behavior: panning the virtual space.

---

### `Optional` onUpdated

• **onUpdated**? : _undefined &#124; function_

Called whenever the [ViewPort](../classes/viewport.md) updates any of its values.

---

### `Optional` treatRightClickAsPan

• **treatRightClickAsPan**? : _undefined &#124; boolean_

By default right clicks with mice (and two finger taps with trackpads) are
sent to `onContextMenu`. If this is set to true, then instead of that
they will begin a pan gesture. The user can thus, right click and drag
the mouse to pan (or use two fingers and tap and drag on a trackpad).

Note that if this is true `onContextMenu` will not be called, and none of
the other other "press" callbacks passed as part of this options object
will be called for the pan gesture (e.g. `onPressStart`).

---

### `Optional` treatTwoFingerTrackPadGesturesLikeTouch

• **treatTwoFingerTrackPadGesturesLikeTouch**? : _undefined &#124; boolean_

By default two finger trackpad gestures are always handled as a zoom
in/zoom out, like with Google Maps. If this is set to true, then
only pinch/spread gestures will be handled like that, and pan style two
finger gestures will be handled as a pan.

However, this will cause mouse wheel interactions to behave like vertical
panning rather than zoom in/zoom out. There is sadly no great way around
this, but there are some techniques you can use to guess whether the user
is using a mouse or a trackpad.
