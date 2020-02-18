# Interface: ViewPortOptions

## Hierarchy

- **ViewPortOptions**

## Properties

### `Optional` debugEvents

• **debugEvents**? : _undefined | false | true_

---

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

---

### `Optional` onPressEnd

• **onPressEnd**? : _undefined | function_

---

### `Optional` onPressMove

• **onPressMove**? : _undefined | function_

---

### `Optional` onPressStart

• **onPressStart**? : _undefined | function_

---

### `Optional` onUpdated

• **onUpdated**? : _undefined | function_
