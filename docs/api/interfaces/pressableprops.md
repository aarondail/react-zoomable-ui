# Interface: PressableProps

## Hierarchy

- **PressableProps**

## Properties

### `Optional` capturePressClassName

• **capturePressClassName**? : _undefined | string_

---

### `Optional` capturePressStyle

• **capturePressStyle**? : _React.CSSProperties_

---

### `Optional` capturePressThresholdMs

• **capturePressThresholdMs**? : _undefined | number_

This is more of an advanced option. If set, this will be the number of
milliseconds until the [Pressable](../classes/pressable.md) captures a press gesture. Once it is
captured it won't be interpreted as a tap, long tap, or a pan, and the
`onCapturePress*` props will begin to be called.

The default is undefined (so presses won't be captured)

---

### `Optional` children

• **children**? : _React.ReactNode | function_

---

### `Optional` className

• **className**? : _undefined | string_

---

### `Optional` disabled

• **disabled**? : _undefined | false | true_

---

### `Optional` disabledClassName

• **disabledClassName**? : _undefined | string_

---

### `Optional` disabledStyle

• **disabledStyle**? : _React.CSSProperties_

---

### `Optional` hoverClassName

• **hoverClassName**? : _undefined | string_

---

### `Optional` hoverStyle

• **hoverStyle**? : _React.CSSProperties_

---

### `Optional` id

• **id**? : _undefined | string_

---

### `Optional` longTapThresholdMs

• **longTapThresholdMs**? : _undefined | number_

If a press is released after this threshold, it will be considered a long
tap. The default is undefined if there is no `onLongTap` prop, or 500
milliseconds if there is.

---

### `Optional` onCapturePressCancelled

• **onCapturePressCancelled**? : _undefined | function_

---

### `Optional` onCapturePressEnd

• **onCapturePressEnd**? : _undefined | function_

---

### `Optional` onCapturePressMove

• **onCapturePressMove**? : _undefined | function_

---

### `Optional` onCapturePressStart

• **onCapturePressStart**? : _undefined | function_

---

### `Optional` onLongTap

• **onLongTap**? : _undefined | function_

---

### `Optional` onPressContextMenu

• **onPressContextMenu**? : _undefined | function_

Called on a right click.

---

### `Optional` onTap

• **onTap**? : _undefined | function_

---

### `Optional` potentialLongTapClassName

• **potentialLongTapClassName**? : _undefined | string_

---

### `Optional` potentialLongTapStyle

• **potentialLongTapStyle**? : _React.CSSProperties_

---

### `Optional` potentialTapClassName

• **potentialTapClassName**? : _undefined | string_

---

### `Optional` potentialTapStyle

• **potentialTapStyle**? : _React.CSSProperties_

---

### `Optional` style

• **style**? : _React.CSSProperties_
