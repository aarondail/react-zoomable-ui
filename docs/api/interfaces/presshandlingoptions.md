[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [PressHandlingOptions](presshandlingoptions.md)

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

• **capturePressThresholdMs**? : _undefined | number_

_Defined in [src/PressInterpreter.ts:64](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L64)_

This is more of an advanced option. If set, this will be the number of
milliseconds until the press gesture is captured. Once it is captured, it
won't be interpreted as a tap, long tap, or pan, and the `onCapturePress*`
props will begin to be called.

The default is undefined (so presses won't be captured)

---

### `Optional` ignorePressEntirely

• **ignorePressEntirely**? : _undefined | false | true_

_Defined in [src/PressInterpreter.ts:34](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L34)_

---

### `Optional` longTapThresholdMs

• **longTapThresholdMs**? : _undefined | number_

_Defined in [src/PressInterpreter.ts:50](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L50)_

If a press is released after this threshold, it will be considered a long
tap. The default is undefined.

---

### `Optional` onCapturePressCancelled

• **onCapturePressCancelled**? : _undefined | function_

_Defined in [src/PressInterpreter.ts:68](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L68)_

---

### `Optional` onCapturePressEnd

• **onCapturePressEnd**? : _undefined | function_

_Defined in [src/PressInterpreter.ts:67](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L67)_

---

### `Optional` onCapturePressMove

• **onCapturePressMove**? : _undefined | function_

_Defined in [src/PressInterpreter.ts:66](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L66)_

---

### `Optional` onCapturePressStart

• **onCapturePressStart**? : _undefined | function_

_Defined in [src/PressInterpreter.ts:65](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L65)_

---

### `Optional` onLongTap

• **onLongTap**? : _undefined | function_

_Defined in [src/PressInterpreter.ts:52](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L52)_

---

### `Optional` onPotentialLongTap

• **onPotentialLongTap**? : _undefined | function_

_Defined in [src/PressInterpreter.ts:51](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L51)_

---

### `Optional` onPotentialTap

• **onPotentialTap**? : _undefined | function_

_Defined in [src/PressInterpreter.ts:43](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L43)_

---

### `Optional` onTap

• **onTap**? : _undefined | function_

_Defined in [src/PressInterpreter.ts:44](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L44)_

---

### `Optional` onTapAbandoned

• **onTapAbandoned**? : _undefined | function_

_Defined in [src/PressInterpreter.ts:54](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L54)_

---

### `Optional` potentialTapBounds

• **potentialTapBounds**? : _[ClientPixelUnit](../globals.md#clientpixelunit)_

_Defined in [src/PressInterpreter.ts:42](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/PressInterpreter.ts#L42)_

The area around the initial event in which the pointer can move before the
press is interpreted as just a pan. It will not be considered a tap or
long tap after the pointer moves outside that area, and it can't be
captured.
