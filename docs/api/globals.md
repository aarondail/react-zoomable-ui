# react-zoomable-ui

## Type aliases

### CancelSuppressZoomingCallback

Ƭ **CancelSuppressZoomingCallback**: _function_

#### Type declaration:

▸ (): _void_

---

### ClientPixelUnit

Ƭ **ClientPixelUnit**: _number_

---

### DecidePressHandlingCallback

Ƭ **DecidePressHandlingCallback**: _function_

This type of callback is given to the [PressInterpreter](classes/pressinterpreter.md) and takes one of
the underlying events that starts a "press" as far as the library is
concerned (either a left click mouse down event, or a single finger touch
start event), and returns an [PressHandlingOptions](interfaces/presshandlingoptions.md) object (or
`undefined`) detailing how the [PressInterpreter](classes/pressinterpreter.md) should handle the
"press" gesture.

#### Type declaration:

▸ (`e`: MouseEvent | TouchEvent, `coordinates`: [PressEventCoordinates](interfaces/presseventcoordinates.md)): _[PressHandlingOptions](interfaces/presshandlingoptions.md) | undefined_

**Parameters:**

| Name          | Type                                                         |
| ------------- | ------------------------------------------------------------ |
| `e`           | MouseEvent &#124; TouchEvent                                 |
| `coordinates` | [PressEventCoordinates](interfaces/presseventcoordinates.md) |

---

### InteractableComponent

Ƭ **InteractableComponent**: _[Pressable](classes/pressable.md) | [NoPanArea](classes/nopanarea.md)_

A type that describes either [Pressable](classes/pressable.md) or [{NoPanArea}]. That is it.

---

### ViewPortCameraInterface

Ƭ **ViewPortCameraInterface**: _Omit‹[ViewPortCamera](classes/viewportcamera.md), "setBounds"›_

This is the public interface to library users of the Camera. We basically
just want ot hide the `setBounds` method so its only called inside this
library.

---

### VirtualSpacePixelUnit

Ƭ **VirtualSpacePixelUnit**: _number_

---

### Writeable

Ƭ **Writeable**: _object_

#### Type declaration:

---

### ZoomFactor

Ƭ **ZoomFactor**: _number_

## Variables

### `Const` DEFAULT_BOUNDS

• **DEFAULT_BOUNDS**: _keyof [number, number]_ = [0.001, 100]

---

### `Const` DEFAULT_LONG_TAP_THRESHOLD_MS

• **DEFAULT_LONG_TAP_THRESHOLD_MS**: _number_ = 500

---

### `Const` InteractableIdAttributeName

• **InteractableIdAttributeName**: _"x-react-zoomable-ui-interactable-id"_ = "x-react-zoomable-ui-interactable-id"

---

### `Const` POTENTIAL_TAP_BOUNDS_DEFAULT

• **POTENTIAL_TAP_BOUNDS_DEFAULT**: _[ClientPixelUnit](globals.md#clientpixelunit)_ = 8

This is the number of client (screen) pixels that a press can move before it
is not considered a tap.

---

### `Const` SpaceContext

• **SpaceContext**: _Context‹[SpaceContextType](interfaces/spacecontexttype.md)›_ = React.createContext<SpaceContextType>(undefined as any)

This React context can be used within a [Space](classes/space.md) to get access
to the [ViewPort](classes/viewport.md).

---

### `Const` browserIsAndroid

• **browserIsAndroid**: _null | RegExpMatchArray‹›_ = navigator.userAgent.match(/Android/)

---

### `Const` browserIsSafari

• **browserIsSafari**: _null | RegExpMatchArray‹›_ = navigator.vendor.match(/Apple/)

---

### `Const` browserIsSafariDesktop

• **browserIsSafariDesktop**: _null | false | true_ = browserIsSafari && typeof Touch === 'undefined'

---

### `Let` idSuffix

• **idSuffix**: _number_ = 0

## Functions

### clamp

▸ **clamp**(`value`: number, `bounds?`: keyof [number | undefined, number | undefined]): _number_

**Parameters:**

| Name      | Type                                                     |
| --------- | -------------------------------------------------------- |
| `value`   | number                                                   |
| `bounds?` | keyof [number &#124; undefined, number &#124; undefined] |

**Returns:** _number_

---

### clampCenterOfLength

▸ **clampCenterOfLength**(`centerValue`: number, `length`: number, `bounds?`: keyof [number | undefined, number | undefined]): _number_

**Parameters:**

| Name          | Type                                                     |
| ------------- | -------------------------------------------------------- |
| `centerValue` | number                                                   |
| `length`      | number                                                   |
| `bounds?`     | keyof [number &#124; undefined, number &#124; undefined] |

**Returns:** _number_

---

### `Const` generateRandomId

▸ **generateRandomId**(): _string_

This id should be safe to use as a class name. So don't use any special
characters that CSS might get confused by.

**Returns:** _string_

---

### getInteractableIdMostApplicableToElement

▸ **getInteractableIdMostApplicableToElement**(`element`: HTMLElement, `outerContainerClassName?`: undefined | string): _string | undefined_

Helper function that returns the nearest ancestor element to the passed
element that is an interactable (either [Pressable](classes/pressable.md) or [NoPanArea](classes/nopanarea.md)), or
the element itself if it is interactable.

**Parameters:**

| Name                       | Type                    |
| -------------------------- | ----------------------- |
| `element`                  | HTMLElement             |
| `outerContainerClassName?` | undefined &#124; string |

**Returns:** _string | undefined_

---

### isMouseEvent

▸ **isMouseEvent**(`e`: MouseEvent | TouchEvent): _e is MouseEvent_

**Parameters:**

| Name | Type                         |
| ---- | ---------------------------- |
| `e`  | MouseEvent &#124; TouchEvent |

**Returns:** _e is MouseEvent_

---

### rectContainsPoint

▸ **rectContainsPoint**(`clientRect`: ClientRect, `x`: number, `y`: number): _boolean_

**Parameters:**

| Name         | Type       |
| ------------ | ---------- |
| `clientRect` | ClientRect |
| `x`          | number     |
| `y`          | number     |

**Returns:** _boolean_

---

### suppressBrowserZooming

▸ **suppressBrowserZooming**(): _[CancelSuppressZoomingCallback](globals.md#cancelsuppresszoomingcallback)_

This is not used by the [ViewPort](classes/viewport.md), but if you have HTML elements around the
[ViewPort](classes/viewport.md) you may want to suppress zooming or panning on the whole page. This
function will do that.

**Returns:** _[CancelSuppressZoomingCallback](globals.md#cancelsuppresszoomingcallback)_

A callback which will stop the suppression.

---

### transitionNumber

▸ **transitionNumber**(`start`: number, `end`: number, `percent`: number): _number_

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| `start`   | number |
| `end`     | number |
| `percent` | number |

**Returns:** _number_

---

### walkElementHierarchyUp

▸ **walkElementHierarchyUp**(`leafElement`: HTMLElement): _Iterable‹HTMLElement›_

**Parameters:**

| Name          | Type        |
| ------------- | ----------- |
| `leafElement` | HTMLElement |

**Returns:** _Iterable‹HTMLElement›_

## Object literals

### `Const` ViewPortMath

### ▪ **ViewPortMath**: _object_

### centerFitArea

▸ **centerFitArea**(`values`: [ViewPortCameraValues](interfaces/viewportcameravalues.md), `bounds`: [ViewPortBounds](interfaces/viewportbounds.md), `area`: object, `additionalBounds?`: Pick‹[ViewPortBounds](interfaces/viewportbounds.md), "zoom"›): _void_

**Parameters:**

▪ **values**: _[ViewPortCameraValues](interfaces/viewportcameravalues.md)_

▪ **bounds**: _[ViewPortBounds](interfaces/viewportbounds.md)_

▪ **area**: _object_

| Name     | Type                                                      |
| -------- | --------------------------------------------------------- |
| `height` | [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit) |
| `left`   | [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit) |
| `top`    | [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit) |
| `width`  | [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit) |

▪`Optional` **additionalBounds**: _Pick‹[ViewPortBounds](interfaces/viewportbounds.md), "zoom"›_

**Returns:** _void_

### centerFitHorizontalArea

▸ **centerFitHorizontalArea**(`values`: [ViewPortCameraValues](interfaces/viewportcameravalues.md), `bounds`: [ViewPortBounds](interfaces/viewportbounds.md), `left`: [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit), `width`: [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit), `additionalBounds?`: Pick‹[ViewPortBounds](interfaces/viewportbounds.md), "zoom"›): _void_

**Parameters:**

| Name                | Type                                                         |
| ------------------- | ------------------------------------------------------------ |
| `values`            | [ViewPortCameraValues](interfaces/viewportcameravalues.md)   |
| `bounds`            | [ViewPortBounds](interfaces/viewportbounds.md)               |
| `left`              | [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit)    |
| `width`             | [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit)    |
| `additionalBounds?` | Pick‹[ViewPortBounds](interfaces/viewportbounds.md), "zoom"› |

**Returns:** _void_

### deriveActualZoomBounds

▸ **deriveActualZoomBounds**(`__namedParameters`: object, `bounds`: [ViewPortBounds](interfaces/viewportbounds.md), `defaultZoomBounds`: keyof [number, number]): _Pick‹[ViewPortBounds](interfaces/viewportbounds.md), "zoom"›_

**Parameters:**

▪ **\_\_namedParameters**: _object_

| Name              | Type   |
| ----------------- | ------ |
| `containerHeight` | number |
| `containerWidth`  | number |

▪ **bounds**: _[ViewPortBounds](interfaces/viewportbounds.md)_

▪ **defaultZoomBounds**: _keyof [number, number]_

**Returns:** _Pick‹[ViewPortBounds](interfaces/viewportbounds.md), "zoom"›_

### updateBounds

▸ **updateBounds**(`values`: [ViewPortCameraValues](interfaces/viewportcameravalues.md), `bounds`: [ViewPortBounds](interfaces/viewportbounds.md)): _void_

**Parameters:**

| Name     | Type                                                       |
| -------- | ---------------------------------------------------------- |
| `values` | [ViewPortCameraValues](interfaces/viewportcameravalues.md) |
| `bounds` | [ViewPortBounds](interfaces/viewportbounds.md)             |

**Returns:** _void_

### updateBy

▸ **updateBy**(`values`: [ViewPortCameraValues](interfaces/viewportcameravalues.md), `bounds`: [ViewPortBounds](interfaces/viewportbounds.md), `dx`: [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit), `dy`: [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit), `dZoom?`: [ZoomFactor](globals.md#zoomfactor), `anchorContainerX?`: [ClientPixelUnit](globals.md#clientpixelunit), `anchorContainerY?`: [ClientPixelUnit](globals.md#clientpixelunit)): _void_

**Parameters:**

| Name                | Type                                                       |
| ------------------- | ---------------------------------------------------------- |
| `values`            | [ViewPortCameraValues](interfaces/viewportcameravalues.md) |
| `bounds`            | [ViewPortBounds](interfaces/viewportbounds.md)             |
| `dx`                | [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit)  |
| `dy`                | [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit)  |
| `dZoom?`            | [ZoomFactor](globals.md#zoomfactor)                        |
| `anchorContainerX?` | [ClientPixelUnit](globals.md#clientpixelunit)              |
| `anchorContainerY?` | [ClientPixelUnit](globals.md#clientpixelunit)              |

**Returns:** _void_

### updateTopLeft

▸ **updateTopLeft**(`values`: [ViewPortCameraValues](interfaces/viewportcameravalues.md), `bounds`: [ViewPortBounds](interfaces/viewportbounds.md), `x`: [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit), `y`: [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit)): _void_

**Parameters:**

| Name     | Type                                                       |
| -------- | ---------------------------------------------------------- |
| `values` | [ViewPortCameraValues](interfaces/viewportcameravalues.md) |
| `bounds` | [ViewPortBounds](interfaces/viewportbounds.md)             |
| `x`      | [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit)  |
| `y`      | [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit)  |

**Returns:** _void_

### updateZoom

▸ **updateZoom**(`values`: [ViewPortCameraValues](interfaces/viewportcameravalues.md), `bounds`: [ViewPortBounds](interfaces/viewportbounds.md), `zoomFactor`: [ZoomFactor](globals.md#zoomfactor)): _void_

**Parameters:**

| Name         | Type                                                       |
| ------------ | ---------------------------------------------------------- |
| `values`     | [ViewPortCameraValues](interfaces/viewportcameravalues.md) |
| `bounds`     | [ViewPortBounds](interfaces/viewportbounds.md)             |
| `zoomFactor` | [ZoomFactor](globals.md#zoomfactor)                        |

**Returns:** _void_
