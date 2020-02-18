[react-zoomable-ui](README.md) › [Globals](globals.md)

# react-zoomable-ui

## Index

### Enumerations

- [StopAnimationKind](enums/stopanimationkind.md)

### Classes

- [ElementSizeChangePoller](classes/elementsizechangepoller.md)
- [NoPanArea](classes/nopanarea.md)
- [PressInterpreter](classes/pressinterpreter.md)
- [Pressable](classes/pressable.md)
- [Space](classes/space.md)
- [ViewPort](classes/viewport.md)
- [ViewPortCamera](classes/viewportcamera.md)

### Interfaces

- [NoPanAreaProps](interfaces/nopanareaprops.md)
- [PressEventCoordinates](interfaces/presseventcoordinates.md)
- [PressEventCoordinatesWithDeltas](interfaces/presseventcoordinateswithdeltas.md)
- [PressHandlingOptions](interfaces/presshandlingoptions.md)
- [PressableProps](interfaces/pressableprops.md)
- [PressableState](interfaces/pressablestate.md)
- [SpaceContextType](interfaces/spacecontexttype.md)
- [SpaceProps](interfaces/spaceprops.md)
- [SpaceState](interfaces/spacestate.md)
- [ViewPortBounds](interfaces/viewportbounds.md)
- [ViewPortCameraAnimation](interfaces/viewportcameraanimation.md)
- [ViewPortCameraAnimationOptions](interfaces/viewportcameraanimationoptions.md)
- [ViewPortCameraValues](interfaces/viewportcameravalues.md)
- [ViewPortOptions](interfaces/viewportoptions.md)
- [VirtualSpaceRect](interfaces/virtualspacerect.md)

### Type aliases

- [CancelSuppressZoomingCallback](globals.md#cancelsuppresszoomingcallback)
- [ClientPixelUnit](globals.md#clientpixelunit)
- [DecidePressHandlingCallback](globals.md#decidepresshandlingcallback)
- [InteractableComponent](globals.md#interactablecomponent)
- [ViewPortCameraInterface](globals.md#viewportcamerainterface)
- [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit)
- [Writeable](globals.md#writeable)
- [ZoomFactor](globals.md#zoomfactor)

### Variables

- [DEFAULT_BOUNDS](globals.md#const-default_bounds)
- [DEFAULT_LONG_TAP_THRESHOLD_MS](globals.md#const-default_long_tap_threshold_ms)
- [InteractableIdAttributeName](globals.md#const-interactableidattributename)
- [POTENTIAL_TAP_BOUNDS_DEFAULT](globals.md#const-potential_tap_bounds_default)
- [SpaceContext](globals.md#const-spacecontext)
- [browserIsAndroid](globals.md#const-browserisandroid)
- [browserIsSafari](globals.md#const-browserissafari)
- [browserIsSafariDesktop](globals.md#const-browserissafaridesktop)
- [idSuffix](globals.md#let-idsuffix)

### Functions

- [clamp](globals.md#clamp)
- [clampCenterOfLength](globals.md#clampcenteroflength)
- [generateRandomId](globals.md#const-generaterandomid)
- [getInteractableIdMostApplicableToElement](globals.md#getinteractableidmostapplicabletoelement)
- [isMouseEvent](globals.md#ismouseevent)
- [rectContainsPoint](globals.md#rectcontainspoint)
- [suppressBrowserZooming](globals.md#suppressbrowserzooming)
- [transitionNumber](globals.md#transitionnumber)
- [walkElementHierarchyUp](globals.md#walkelementhierarchyup)

### Object literals

- [ViewPortMath](globals.md#const-viewportmath)

## Type aliases

### CancelSuppressZoomingCallback

Ƭ **CancelSuppressZoomingCallback**: _function_

_Defined in [src/suppressBrowserZooming.ts:1](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/suppressBrowserZooming.ts#L1)_

#### Type declaration:

▸ (): _void_

---

### ClientPixelUnit

Ƭ **ClientPixelUnit**: _number_

_Defined in [src/ViewPort.ts:7](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L7)_

---

### DecidePressHandlingCallback

Ƭ **DecidePressHandlingCallback**: _function_

_Defined in [src/PressInterpreter.ts:28](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L28)_

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

_Defined in [src/Interactable.ts:8](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Interactable.ts#L8)_

A type that describes either [Pressable](classes/pressable.md) or [{NoPanArea}]. That is it.

---

### ViewPortCameraInterface

Ƭ **ViewPortCameraInterface**: _Omit‹[ViewPortCamera](classes/viewportcamera.md), "setBounds"›_

_Defined in [src/ViewPortCamera.ts:54](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortCamera.ts#L54)_

This is the public interface to library users of the Camera. We basically
just want ot hide the `setBounds` method so its only called inside this
library.

---

### VirtualSpacePixelUnit

Ƭ **VirtualSpacePixelUnit**: _number_

_Defined in [src/ViewPort.ts:9](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L9)_

---

### Writeable

Ƭ **Writeable**: _object_

_Defined in [src/utils.ts:1](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L1)_

#### Type declaration:

---

### ZoomFactor

Ƭ **ZoomFactor**: _number_

_Defined in [src/ViewPort.ts:11](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L11)_

## Variables

### `Const` DEFAULT_BOUNDS

• **DEFAULT_BOUNDS**: _keyof [number, number]_ = [0.001, 100]

_Defined in [src/ViewPortCamera.ts:6](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortCamera.ts#L6)_

---

### `Const` DEFAULT_LONG_TAP_THRESHOLD_MS

• **DEFAULT_LONG_TAP_THRESHOLD_MS**: _number_ = 500

_Defined in [src/Pressable.tsx:9](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Pressable.tsx#L9)_

---

### `Const` InteractableIdAttributeName

• **InteractableIdAttributeName**: _"x-react-zoomable-ui-interactable-id"_ = "x-react-zoomable-ui-interactable-id"

_Defined in [src/Interactable.ts:10](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Interactable.ts#L10)_

---

### `Const` POTENTIAL_TAP_BOUNDS_DEFAULT

• **POTENTIAL_TAP_BOUNDS_DEFAULT**: _[ClientPixelUnit](globals.md#clientpixelunit)_ = 8

_Defined in [src/PressInterpreter.ts:18](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L18)_

This is the number of client (screen) pixels that a press can move before it
is not considered a tap.

---

### `Const` SpaceContext

• **SpaceContext**: _Context‹[SpaceContextType](interfaces/spacecontexttype.md)›_ = React.createContext<SpaceContextType>(undefined as any)

_Defined in [src/SpaceContext.ts:20](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/SpaceContext.ts#L20)_

This React context can be used within a [Space](classes/space.md) to get access
to the [ViewPort](classes/viewport.md).

---

### `Const` browserIsAndroid

• **browserIsAndroid**: _null | RegExpMatchArray‹›_ = navigator.userAgent.match(/Android/)

_Defined in [src/utils.ts:65](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L65)_

---

### `Const` browserIsSafari

• **browserIsSafari**: _null | RegExpMatchArray‹›_ = navigator.vendor.match(/Apple/)

_Defined in [src/utils.ts:66](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L66)_

---

### `Const` browserIsSafariDesktop

• **browserIsSafariDesktop**: _null | false | true_ = browserIsSafari && typeof Touch === 'undefined'

_Defined in [src/utils.ts:67](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L67)_

---

### `Let` idSuffix

• **idSuffix**: _number_ = 0

_Defined in [src/utils.ts:3](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L3)_

## Functions

### clamp

▸ **clamp**(`value`: number, `bounds?`: keyof [number | undefined, number | undefined]): _number_

_Defined in [src/utils.ts:15](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L15)_

**Parameters:**

| Name      | Type                                                     |
| --------- | -------------------------------------------------------- |
| `value`   | number                                                   |
| `bounds?` | keyof [number &#124; undefined, number &#124; undefined] |

**Returns:** _number_

---

### clampCenterOfLength

▸ **clampCenterOfLength**(`centerValue`: number, `length`: number, `bounds?`: keyof [number | undefined, number | undefined]): _number_

_Defined in [src/utils.ts:28](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L28)_

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

_Defined in [src/utils.ts:8](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L8)_

This id should be safe to use as a class name. So don't use any special
characters that CSS might get confused by.

**Returns:** _string_

---

### getInteractableIdMostApplicableToElement

▸ **getInteractableIdMostApplicableToElement**(`element`: HTMLElement, `outerContainerClassName?`: undefined | string): _string | undefined_

_Defined in [src/Interactable.ts:17](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Interactable.ts#L17)_

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

_Defined in [src/utils.ts:69](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L69)_

**Parameters:**

| Name | Type                         |
| ---- | ---------------------------- |
| `e`  | MouseEvent &#124; TouchEvent |

**Returns:** _e is MouseEvent_

---

### rectContainsPoint

▸ **rectContainsPoint**(`clientRect`: ClientRect, `x`: number, `y`: number): _boolean_

_Defined in [src/utils.ts:49](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L49)_

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

_Defined in [src/suppressBrowserZooming.ts:10](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/suppressBrowserZooming.ts#L10)_

This is not used by the [ViewPort](classes/viewport.md), but if you have HTML elements around the
[ViewPort](classes/viewport.md) you may want to suppress zooming or panning on the whole page. This
function will do that.

**Returns:** _[CancelSuppressZoomingCallback](globals.md#cancelsuppresszoomingcallback)_

A callback which will stop the suppression.

---

### transitionNumber

▸ **transitionNumber**(`start`: number, `end`: number, `percent`: number): _number_

_Defined in [src/utils.ts:53](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L53)_

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

_Defined in [src/utils.ts:57](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/utils.ts#L57)_

**Parameters:**

| Name          | Type        |
| ------------- | ----------- |
| `leafElement` | HTMLElement |

**Returns:** _Iterable‹HTMLElement›_

## Object literals

### `Const` ViewPortMath

### ▪ **ViewPortMath**: _object_

_Defined in [src/ViewPortMath.ts:5](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortMath.ts#L5)_

### centerFitArea

▸ **centerFitArea**(`values`: [ViewPortCameraValues](interfaces/viewportcameravalues.md), `bounds`: [ViewPortBounds](interfaces/viewportbounds.md), `area`: object, `additionalBounds?`: Pick‹[ViewPortBounds](interfaces/viewportbounds.md), "zoom"›): _void_

_Defined in [src/ViewPortMath.ts:39](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortMath.ts#L39)_

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

_Defined in [src/ViewPortMath.ts:62](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortMath.ts#L62)_

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

_Defined in [src/ViewPortMath.ts:6](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortMath.ts#L6)_

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

_Defined in [src/ViewPortMath.ts:77](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortMath.ts#L77)_

**Parameters:**

| Name     | Type                                                       |
| -------- | ---------------------------------------------------------- |
| `values` | [ViewPortCameraValues](interfaces/viewportcameravalues.md) |
| `bounds` | [ViewPortBounds](interfaces/viewportbounds.md)             |

**Returns:** _void_

### updateBy

▸ **updateBy**(`values`: [ViewPortCameraValues](interfaces/viewportcameravalues.md), `bounds`: [ViewPortBounds](interfaces/viewportbounds.md), `dx`: [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit), `dy`: [VirtualSpacePixelUnit](globals.md#virtualspacepixelunit), `dZoom?`: [ZoomFactor](globals.md#zoomfactor), `anchorContainerX?`: [ClientPixelUnit](globals.md#clientpixelunit), `anchorContainerY?`: [ClientPixelUnit](globals.md#clientpixelunit)): _void_

_Defined in [src/ViewPortMath.ts:99](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortMath.ts#L99)_

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

_Defined in [src/ViewPortMath.ts:144](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortMath.ts#L144)_

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

_Defined in [src/ViewPortMath.ts:156](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortMath.ts#L156)_

**Parameters:**

| Name         | Type                                                       |
| ------------ | ---------------------------------------------------------- |
| `values`     | [ViewPortCameraValues](interfaces/viewportcameravalues.md) |
| `bounds`     | [ViewPortBounds](interfaces/viewportbounds.md)             |
| `zoomFactor` | [ZoomFactor](globals.md#zoomfactor)                        |

**Returns:** _void_
