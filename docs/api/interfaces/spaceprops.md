[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [SpaceProps](spaceprops.md)

# Interface: SpaceProps

## Hierarchy

- **SpaceProps**

## Index

### Properties

- [className](spaceprops.md#optional-classname)
- [id](spaceprops.md#optional-id)
- [innerDivClassName](spaceprops.md#optional-innerdivclassname)
- [innerDivStyle](spaceprops.md#optional-innerdivstyle)
- [onCreate](spaceprops.md#optional-oncreate)
- [onDecideHowToHandlePress](spaceprops.md#optional-ondecidehowtohandlepress)
- [onHover](spaceprops.md#optional-onhover)
- [onPressContextMenu](spaceprops.md#optional-onpresscontextmenu)
- [onUpdated](spaceprops.md#optional-onupdated)
- [pollForElementResizing](spaceprops.md#optional-pollforelementresizing)
- [style](spaceprops.md#optional-style)

## Properties

### `Optional` className

• **className**? : _undefined | string_

_Defined in [src/Space.tsx:20](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L20)_

Optional CSS class to use on the outer `div` that the [Space](../classes/space.md) renders.

---

### `Optional` id

• **id**? : _undefined | string_

_Defined in [src/Space.tsx:16](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L16)_

Optional id to use on the outer `div` that the [Space](../classes/space.md) renders.

---

### `Optional` innerDivClassName

• **innerDivClassName**? : _undefined | string_

_Defined in [src/Space.tsx:29](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L29)_

Optional CSS class to use on the inner `div` that the [Space](../classes/space.md) scales and
transforms.

---

### `Optional` innerDivStyle

• **innerDivStyle**? : _React.CSSProperties_

_Defined in [src/Space.tsx:34](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L34)_

Optional styles class to use on the inner `div` that the [Space](../classes/space.md) scales
and transforms.

---

### `Optional` onCreate

• **onCreate**? : _undefined | function_

_Defined in [src/Space.tsx:47](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L47)_

Called when the `Space` first creates the outer `div` and sets up the
[ViewPort](../classes/viewport.md), but before the inner `div` and the `Space's children have
been first rendered. This can be used, for example, to make the
[ViewPort](../classes/viewport.md) focus on a certain portion of the virtual space.

---

### `Optional` onDecideHowToHandlePress

• **onDecideHowToHandlePress**? : _[DecidePressHandlingCallback](../globals.md#decidepresshandlingcallback)_

_Defined in [src/Space.tsx:64](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L64)_

Optional callback to be called when a press is initiated in the space.
Generally you should prefer to use [Pressable](../classes/pressable.md) to handle presses, but
this can be used as a lower level alternative. The result of the callback
is a [PressHandlingOptions](presshandlingoptions.md) (or `undefined`) that describes how the
press should be handled.

If the callback returns a [PressHandlingOptions](presshandlingoptions.md) it will take precedence
over [Pressable](../classes/pressable.md) and [NoPanArea](../classes/nopanarea.md) components (even if the press was on
one of those).

---

### `Optional` onHover

• **onHover**? : _undefined | function_

_Defined in [src/Space.tsx:68](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L68)_

Called when a mouse hover event happens anywhere in the [Space](../classes/space.md).

---

### `Optional` onPressContextMenu

• **onPressContextMenu**? : _undefined | function_

_Defined in [src/Space.tsx:76](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L76)_

Called when a right click event happens anywhere in the [Space](../classes/space.md).

**`returns`** Whether to prevent (`true`) a [Pressable](../classes/pressable.md) from also handling
this event (if it was also the target).

---

### `Optional` onUpdated

• **onUpdated**? : _undefined | function_

_Defined in [src/Space.tsx:51](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L51)_

Called whenever the [ViewPort](../classes/viewport.md) is updated.

---

### `Optional` pollForElementResizing

• **pollForElementResizing**? : _undefined | false | true_

_Defined in [src/Space.tsx:39](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L39)_

If set, the `Space` will poll every 500ms for changes to its parent element's size. This only has to be used if the
parent element can resize for reasons other than the window resizing, and if the [updateSize](../classes/space.md#updatesize) is not used.

---

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in [src/Space.tsx:24](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L24)_

Optional styles to set on the outer `div` that the [Space](../classes/space.md) renders.
