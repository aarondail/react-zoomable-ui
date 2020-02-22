# Interface: PressHandlingOptions

## Hierarchy

- **PressHandlingOptions**

## Index

### Properties

- [capturePressThresholdMs](presshandlingoptions.md#optional-capturepressthresholdms)
- [ignorePressEntirely](presshandlingoptions.md#optional-ignorepressentirely)
- [longTapThresholdMs](presshandlingoptions.md#optional-longtapthresholdms)
- [onCapturePressCancelled](presshandlingoptions.md#optional-oncapturepresscancelled)
- [onCapturePressEnd](presshandlingoptions.md#optional-oncapturepressend)
- [onCapturePressMove](presshandlingoptions.md#optional-oncapturepressmove)
- [onCapturePressStart](presshandlingoptions.md#optional-oncapturepressstart)
- [onLongTap](presshandlingoptions.md#optional-onlongtap)
- [onPotentialLongTap](presshandlingoptions.md#optional-onpotentiallongtap)
- [onPotentialTap](presshandlingoptions.md#optional-onpotentialtap)
- [onTap](presshandlingoptions.md#optional-ontap)
- [onTapAbandoned](presshandlingoptions.md#optional-ontapabandoned)
- [potentialTapBounds](presshandlingoptions.md#optional-potentialtapbounds)

## Properties

### `Optional` capturePressThresholdMs

• **capturePressThresholdMs**? : _undefined &#124; number_

This is more of an advanced option. If set, this will be the number of
milliseconds until the press is captured. Once it is captured, it
won't be interpreted as a tap, long tap, or pan, and the `onCapturePress*`
props will begin to be called.

The default is undefined (so presses won't be captured)

---

### `Optional` ignorePressEntirely

• **ignorePressEntirely**? : _undefined | false &#124; true_

---

### `Optional` longTapThresholdMs

• **longTapThresholdMs**? : _undefined &#124; number_

If a press is released after this threshold, it will be considered a long
tap. The default is undefined.

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

### `Optional` onPotentialLongTap

• **onPotentialLongTap**? : _undefined &#124; function_

---

### `Optional` onPotentialTap

• **onPotentialTap**? : _undefined &#124; function_

---

### `Optional` onTap

• **onTap**? : _undefined &#124; function_

---

### `Optional` onTapAbandoned

• **onTapAbandoned**? : _undefined &#124; function_

---

### `Optional` potentialTapBounds

• **potentialTapBounds**? : _[ClientPixelUnit](../API.md#clientpixelunit)_

The area around the initial event in which the pointer can move before the
press is interpreted as just a pan. It will not be considered a tap or
long tap after the pointer moves outside that area, and it can't be
captured.
