# Interface: PressableProps

## Hierarchy

- **PressableProps**

## Index

### Properties

- [capturePressClassName](pressableprops.md#optional-capturepressclassname)
- [capturePressStyle](pressableprops.md#optional-capturepressstyle)
- [capturePressThresholdMs](pressableprops.md#optional-capturepressthresholdms)
- [children](pressableprops.md#optional-children)
- [className](pressableprops.md#optional-classname)
- [disabled](pressableprops.md#optional-disabled)
- [disabledClassName](pressableprops.md#optional-disabledclassname)
- [disabledStyle](pressableprops.md#optional-disabledstyle)
- [hoverClassName](pressableprops.md#optional-hoverclassname)
- [hoverStyle](pressableprops.md#optional-hoverstyle)
- [id](pressableprops.md#optional-id)
- [longTapThresholdMs](pressableprops.md#optional-longtapthresholdms)
- [onCapturePressCancelled](pressableprops.md#optional-oncapturepresscancelled)
- [onCapturePressEnd](pressableprops.md#optional-oncapturepressend)
- [onCapturePressMove](pressableprops.md#optional-oncapturepressmove)
- [onCapturePressStart](pressableprops.md#optional-oncapturepressstart)
- [onLongTap](pressableprops.md#optional-onlongtap)
- [onContextMenu](pressableprops.md#optional-oncontextmenu)
- [onTap](pressableprops.md#optional-ontap)
- [potentialLongTapClassName](pressableprops.md#optional-potentiallongtapclassname)
- [potentialLongTapStyle](pressableprops.md#optional-potentiallongtapstyle)
- [potentialTapClassName](pressableprops.md#optional-potentialtapclassname)
- [potentialTapStyle](pressableprops.md#optional-potentialtapstyle)
- [style](pressableprops.md#optional-style)

## Properties

### `Optional` capturePressClassName

• **capturePressClassName**? : _undefined &#124; string_

---

### `Optional` capturePressStyle

• **capturePressStyle**? : _React.CSSProperties_

---

### `Optional` capturePressThresholdMs

• **capturePressThresholdMs**? : _undefined &#124; number_

This is more of an advanced option. If set, this will be the number of
milliseconds until the [Pressable](../classes/pressable.md) captures a press. Once it is
captured it won't be interpreted as a tap, long tap, or a pan, and the
`onCapturePress*` props will begin to be called.

The default is undefined (so presses won't be captured)

---

### `Optional` children

• **children**? : _React.ReactNode &#124; function_

---

### `Optional` className

• **className**? : _undefined &#124; string_

---

### `Optional` disabled

• **disabled**? : _undefined &#124; false &#124; true_

---

### `Optional` disabledClassName

• **disabledClassName**? : _undefined &#124; string_

---

### `Optional` disabledStyle

• **disabledStyle**? : _React.CSSProperties_

---

### `Optional` hoverClassName

• **hoverClassName**? : _undefined &#124; string_

---

### `Optional` hoverStyle

• **hoverStyle**? : _React.CSSProperties_

---

### `Optional` id

• **id**? : _undefined &#124; string_

---

### `Optional` longTapThresholdMs

• **longTapThresholdMs**? : _undefined &#124; number_

If a press is released after this threshold, it will be considered a long
tap. The default is undefined if there is no `onLongTap` prop, or 500
milliseconds if there is.

---

### `Optional` onCapturePressCancelled

• **onCapturePressCancelled**? : _undefined &#124; function_

---

### `Optional` onCapturePressEnd

• **onCapturePressEnd**? : _undefined &#124; function_

---

### `Optional` onCapturePressMove

• **onCapturePressMove**? : _undefined &#124; function_

---

### `Optional` onCapturePressStart

• **onCapturePressStart**? : _undefined &#124; function_

---

### `Optional` onLongTap

• **onLongTap**? : _undefined &#124; function_

---

### `Optional` onContextMenu

• **onContextMenu**? : _undefined &#124; function_

Called on a right click.

---

### `Optional` onTap

• **onTap**? : _undefined &#124; function_

---

### `Optional` potentialLongTapClassName

• **potentialLongTapClassName**? : _undefined &#124; string_

---

### `Optional` potentialLongTapStyle

• **potentialLongTapStyle**? : _React.CSSProperties_

---

### `Optional` potentialTapClassName

• **potentialTapClassName**? : _undefined &#124; string_

---

### `Optional` potentialTapStyle

• **potentialTapStyle**? : _React.CSSProperties_

---

### `Optional` style

• **style**? : _React.CSSProperties_
