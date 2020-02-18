[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [PressableProps](pressableprops.md)

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
- [onPressContextMenu](pressableprops.md#optional-onpresscontextmenu)
- [onTap](pressableprops.md#optional-ontap)
- [potentialLongTapClassName](pressableprops.md#optional-potentiallongtapclassname)
- [potentialLongTapStyle](pressableprops.md#optional-potentiallongtapstyle)
- [potentialTapClassName](pressableprops.md#optional-potentialtapclassname)
- [potentialTapStyle](pressableprops.md#optional-potentialtapstyle)
- [style](pressableprops.md#optional-style)

## Properties

### `Optional` capturePressClassName

• **capturePressClassName**? : _undefined | string_

_Defined in [src/Pressable.tsx:17](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L17)_

---

### `Optional` capturePressStyle

• **capturePressStyle**? : _React.CSSProperties_

_Defined in [src/Pressable.tsx:23](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L23)_

---

### `Optional` capturePressThresholdMs

• **capturePressThresholdMs**? : _undefined | number_

_Defined in [src/Pressable.tsx:36](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L36)_

This is more of an advanced option. If set, this will be the number of
milliseconds until the [Pressable](../classes/pressable.md) captures a press gesture. Once it is
captured it won't be interpreted as a tap, long tap, or a pan, and the
`onCapturePress*` props will begin to be called.

The default is undefined (so presses won't be captured)

---

### `Optional` children

• **children**? : _React.ReactNode | function_

_Defined in [src/Pressable.tsx:13](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L13)_

---

### `Optional` className

• **className**? : _undefined | string_

_Defined in [src/Pressable.tsx:14](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L14)_

---

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in [src/Pressable.tsx:27](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L27)_

---

### `Optional` disabledClassName

• **disabledClassName**? : _undefined | string_

_Defined in [src/Pressable.tsx:18](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L18)_

---

### `Optional` disabledStyle

• **disabledStyle**? : _React.CSSProperties_

_Defined in [src/Pressable.tsx:24](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L24)_

---

### `Optional` hoverClassName

• **hoverClassName**? : _undefined | string_

_Defined in [src/Pressable.tsx:19](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L19)_

---

### `Optional` hoverStyle

• **hoverStyle**? : _React.CSSProperties_

_Defined in [src/Pressable.tsx:25](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L25)_

---

### `Optional` id

• **id**? : _undefined | string_

_Defined in [src/Pressable.tsx:12](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L12)_

---

### `Optional` longTapThresholdMs

• **longTapThresholdMs**? : _undefined | number_

_Defined in [src/Pressable.tsx:42](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L42)_

If a press is released after this threshold, it will be considered a long
tap. The default is undefined if there is no `onLongTap` prop, or 500
milliseconds if there is.

---

### `Optional` onCapturePressCancelled

• **onCapturePressCancelled**? : _undefined | function_

_Defined in [src/Pressable.tsx:56](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L56)_

---

### `Optional` onCapturePressEnd

• **onCapturePressEnd**? : _undefined | function_

_Defined in [src/Pressable.tsx:52](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L52)_

---

### `Optional` onCapturePressMove

• **onCapturePressMove**? : _undefined | function_

_Defined in [src/Pressable.tsx:47](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L47)_

---

### `Optional` onCapturePressStart

• **onCapturePressStart**? : _undefined | function_

_Defined in [src/Pressable.tsx:46](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L46)_

---

### `Optional` onLongTap

• **onLongTap**? : _undefined | function_

_Defined in [src/Pressable.tsx:45](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L45)_

---

### `Optional` onPressContextMenu

• **onPressContextMenu**? : _undefined | function_

_Defined in [src/Pressable.tsx:60](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L60)_

Called on a right click.

---

### `Optional` onTap

• **onTap**? : _undefined | function_

_Defined in [src/Pressable.tsx:44](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L44)_

---

### `Optional` potentialLongTapClassName

• **potentialLongTapClassName**? : _undefined | string_

_Defined in [src/Pressable.tsx:16](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L16)_

---

### `Optional` potentialLongTapStyle

• **potentialLongTapStyle**? : _React.CSSProperties_

_Defined in [src/Pressable.tsx:22](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L22)_

---

### `Optional` potentialTapClassName

• **potentialTapClassName**? : _undefined | string_

_Defined in [src/Pressable.tsx:15](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L15)_

---

### `Optional` potentialTapStyle

• **potentialTapStyle**? : _React.CSSProperties_

_Defined in [src/Pressable.tsx:21](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L21)_

---

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in [src/Pressable.tsx:20](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L20)_
