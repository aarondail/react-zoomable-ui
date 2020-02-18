[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [ViewPortOptions](viewportoptions.md)

# Interface: ViewPortOptions

## Hierarchy

- **ViewPortOptions**

## Index

### Properties

- [debugEvents](viewportoptions.md#optional-debugevents)
- [onHover](viewportoptions.md#optional-onhover)
- [onPressCancel](viewportoptions.md#optional-onpresscancel)
- [onPressContextMenu](viewportoptions.md#optional-onpresscontextmenu)
- [onPressEnd](viewportoptions.md#optional-onpressend)
- [onPressMove](viewportoptions.md#optional-onpressmove)
- [onPressStart](viewportoptions.md#optional-onpressstart)
- [onUpdated](viewportoptions.md#optional-onupdated)

## Properties

### `Optional` debugEvents

• **debugEvents**? : _undefined | false | true_

_Defined in [src/ViewPort.ts:38](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L38)_

---

### `Optional` onHover

• **onHover**? : _undefined | function_

_Defined in [src/ViewPort.ts:57](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L57)_

---

### `Optional` onPressCancel

• **onPressCancel**? : _undefined | function_

_Defined in [src/ViewPort.ts:56](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L56)_

After a press starts there are some cases where it can be canceled rather
than ended. For example when on finger starts touching the screen that
will trigger `onPressStart`. If a second finger starts touching the screen
though, that will cause the press to be "cancelled". A press is
effectively a single finger touch or mouse/track-pad click and drag
motion.

---

### `Optional` onPressContextMenu

• **onPressContextMenu**? : _undefined | function_

_Defined in [src/ViewPort.ts:58](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L58)_

---

### `Optional` onPressEnd

• **onPressEnd**? : _undefined | function_

_Defined in [src/ViewPort.ts:47](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L47)_

---

### `Optional` onPressMove

• **onPressMove**? : _undefined | function_

_Defined in [src/ViewPort.ts:46](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L46)_

---

### `Optional` onPressStart

• **onPressStart**? : _undefined | function_

_Defined in [src/ViewPort.ts:42](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L42)_

---

### `Optional` onUpdated

• **onUpdated**? : _undefined | function_

_Defined in [src/ViewPort.ts:40](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L40)_
