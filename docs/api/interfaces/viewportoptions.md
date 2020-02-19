# Interface: ViewPortOptions

## Hierarchy

- **ViewPortOptions**

## Index

### Properties

- [onHover](viewportoptions.md#optional-onhover)
- [onPressCancel](viewportoptions.md#optional-onpresscancel)
- [onPressContextMenu](viewportoptions.md#optional-onpresscontextmenu)
- [onPressEnd](viewportoptions.md#optional-onpressend)
- [onPressMove](viewportoptions.md#optional-onpressmove)
- [onPressStart](viewportoptions.md#optional-onpressstart)
- [onUpdated](viewportoptions.md#optional-onupdated)

## Properties

### `Optional` onHover

• **onHover**? : _undefined | function_

---

### `Optional` onPressCancel

• **onPressCancel**? : _undefined | function_

After a press starts there are some cases where it can be canceled rather
than ended. For example when on finger starts touching the screen that
will trigger `onPressStart`. If a second finger starts touching the screen
though, that will cause the press to be "cancelled". A press is
effectively a single finger touch or mouse/track-pad click and drag
motion.

---

### `Optional` onPressContextMenu

• **onPressContextMenu**? : _undefined | function_

Called when a right click happens inside the [ViewPort](../classes/viewport.md).

---

### `Optional` onPressEnd

• **onPressEnd**? : _undefined | function_

Called when a press ends normally by the user releasing the mouse button
or lifting their finger.

---

### `Optional` onPressMove

• **onPressMove**? : _undefined | function_

Called when a press moves, IF the press is currently captured (see
[onPressStart](viewportoptions.md#optional-onpressstart)). The callback can release the captured press by
returning `'release'`.

---

### `Optional` onPressStart

• **onPressStart**? : _undefined | function_

Called when a press (press being a left mouse click or a single finger
touch) starts in the [ViewPort](../classes/viewport.md). The callback can return whether the
interaction should be captured, in which case the other `onPress*` methods
will be called. Or it can be ignored (in which case nothing at all will
happen). Finally, the callback can return `undefined` which will initiate
the default behavior: panning the virtual space.

---

### `Optional` onUpdated

• **onUpdated**? : _undefined | function_

Called whenever the [ViewPort](../classes/viewport.md) updates any of its values.
