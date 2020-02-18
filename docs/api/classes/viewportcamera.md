[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [ViewPortCamera](viewportcamera.md)

# Class: ViewPortCamera

## Hierarchy

- **ViewPortCamera**

## Index

### Constructors

- [constructor](viewportcamera.md#constructor)

### Methods

- [centerFitAreaIntoView](viewportcamera.md#centerfitareaintoview)
- [centerFitHorizontalAreaIntoView](viewportcamera.md#centerfithorizontalareaintoview)
- [destroy](viewportcamera.md#destroy)
- [handleContainerSizeChanged](viewportcamera.md#handlecontainersizechanged)
- [moveBy](viewportcamera.md#moveby)
- [moveByInClientSpace](viewportcamera.md#movebyinclientspace)
- [moveWithDeceleration](viewportcamera.md#movewithdeceleration)
- [moveWithDecelerationInClientSpace](viewportcamera.md#movewithdecelerationinclientspace)
- [recenter](viewportcamera.md#recenter)
- [setBounds](viewportcamera.md#setbounds)
- [setBoundsToContainer](viewportcamera.md#setboundstocontainer)
- [updateTopLeft](viewportcamera.md#updatetopleft)

## Constructors

### constructor

\+ **new ViewPortCamera**(`values`: [ViewPortCameraValues](../interfaces/viewportcameravalues.md), `onUpdated?`: undefined | function): _[ViewPortCamera](viewportcamera.md)_

_Defined in [src/ViewPortCamera.ts:61](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L61)_

This is only intended to be constructed by the [ViewPort](viewport.md).

**Parameters:**

| Name         | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `values`     | [ViewPortCameraValues](../interfaces/viewportcameravalues.md) |
| `onUpdated?` | undefined &#124; function                                     |

**Returns:** _[ViewPortCamera](viewportcamera.md)_

## Methods

### centerFitAreaIntoView

▸ **centerFitAreaIntoView**(`area`: object, `additionalBounds?`: Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›, `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

_Defined in [src/ViewPortCamera.ts:87](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L87)_

**Parameters:**

▪ **area**: _object_

| Name     | Type                                                         |
| -------- | ------------------------------------------------------------ |
| `height` | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit) |
| `left`   | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit) |
| `top`    | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit) |
| `width`  | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit) |

▪`Optional` **additionalBounds**: _Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›_

▪`Optional` **animationOptions**: _[ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)_

**Returns:** _void_

---

### centerFitHorizontalAreaIntoView

▸ **centerFitHorizontalAreaIntoView**(`left`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `width`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `additionalBounds?`: Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›, `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

_Defined in [src/ViewPortCamera.ts:111](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L111)_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `left`              | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)                      |
| `width`             | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)                      |
| `additionalBounds?` | Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›                   |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### destroy

▸ **destroy**(): _void_

_Defined in [src/ViewPortCamera.ts:131](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L131)_

**Returns:** _void_

---

### handleContainerSizeChanged

▸ **handleContainerSizeChanged**(`width`: [ClientPixelUnit](../globals.md#clientpixelunit), `height`: [ClientPixelUnit](../globals.md#clientpixelunit)): _void_

_Defined in [src/ViewPortCamera.ts:233](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L233)_

This is not intended to be called by code outside of react-zoomable-ui itself.

**Parameters:**

| Name     | Type                                             |
| -------- | ------------------------------------------------ |
| `width`  | [ClientPixelUnit](../globals.md#clientpixelunit) |
| `height` | [ClientPixelUnit](../globals.md#clientpixelunit) |

**Returns:** _void_

---

### moveBy

▸ **moveBy**(`dx`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `dy`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `dZoom?`: [ZoomFactor](../globals.md#zoomfactor), `anchorContainerX?`: [ClientPixelUnit](../globals.md#clientpixelunit), `anchorContainerY?`: [ClientPixelUnit](../globals.md#clientpixelunit), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

_Defined in [src/ViewPortCamera.ts:138](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L138)_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `dx`                | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)                      |
| `dy`                | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)                      |
| `dZoom?`            | [ZoomFactor](../globals.md#zoomfactor)                                            |
| `anchorContainerX?` | [ClientPixelUnit](../globals.md#clientpixelunit)                                  |
| `anchorContainerY?` | [ClientPixelUnit](../globals.md#clientpixelunit)                                  |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### moveByInClientSpace

▸ **moveByInClientSpace**(`dx`: [ClientPixelUnit](../globals.md#clientpixelunit), `dy`: [ClientPixelUnit](../globals.md#clientpixelunit), `dZoom?`: [ZoomFactor](../globals.md#zoomfactor), `anchorContainerX?`: [ClientPixelUnit](../globals.md#clientpixelunit), `anchorContainerY?`: [ClientPixelUnit](../globals.md#clientpixelunit), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

_Defined in [src/ViewPortCamera.ts:160](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L160)_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `dx`                | [ClientPixelUnit](../globals.md#clientpixelunit)                                  |
| `dy`                | [ClientPixelUnit](../globals.md#clientpixelunit)                                  |
| `dZoom?`            | [ZoomFactor](../globals.md#zoomfactor)                                            |
| `anchorContainerX?` | [ClientPixelUnit](../globals.md#clientpixelunit)                                  |
| `anchorContainerY?` | [ClientPixelUnit](../globals.md#clientpixelunit)                                  |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### moveWithDeceleration

▸ **moveWithDeceleration**(`vx`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `vy`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `friction`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `preventInterruption?`: undefined | false | true): _void_

_Defined in [src/ViewPortCamera.ts:178](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L178)_

**Parameters:**

| Name                   | Type                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `vx`                   | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit) |
| `vy`                   | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit) |
| `friction`             | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit) |
| `preventInterruption?` | undefined &#124; false &#124; true                           |

**Returns:** _void_

---

### moveWithDecelerationInClientSpace

▸ **moveWithDecelerationInClientSpace**(`vx`: [ClientPixelUnit](../globals.md#clientpixelunit), `vy`: [ClientPixelUnit](../globals.md#clientpixelunit), `friction`: [ClientPixelUnit](../globals.md#clientpixelunit), `preventInterruption?`: undefined | false | true): _void_

_Defined in [src/ViewPortCamera.ts:216](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L216)_

**Parameters:**

| Name                   | Type                                             | Default |
| ---------------------- | ------------------------------------------------ | ------- |
| `vx`                   | [ClientPixelUnit](../globals.md#clientpixelunit) | -       |
| `vy`                   | [ClientPixelUnit](../globals.md#clientpixelunit) | -       |
| `friction`             | [ClientPixelUnit](../globals.md#clientpixelunit) | 0.84    |
| `preventInterruption?` | undefined &#124; false &#124; true               | -       |

**Returns:** _void_

---

### recenter

▸ **recenter**(`x`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `y`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `newZoomFactor?`: [ZoomFactor](../globals.md#zoomfactor), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

_Defined in [src/ViewPortCamera.ts:263](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L263)_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `x`                 | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)                      |
| `y`                 | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)                      |
| `newZoomFactor?`    | [ZoomFactor](../globals.md#zoomfactor)                                            |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### setBounds

▸ **setBounds**(`bounds`: [ViewPortBounds](../interfaces/viewportbounds.md)): _void_

_Defined in [src/ViewPortCamera.ts:296](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L296)_

This is not intended to be called by code outside of react-zoomable-ui
itself. It is hidden in the `ViewPortCameraInterface` that is exported
from this library.

**Parameters:**

| Name     | Type                                              |
| -------- | ------------------------------------------------- |
| `bounds` | [ViewPortBounds](../interfaces/viewportbounds.md) |

**Returns:** _void_

---

### setBoundsToContainer

▸ **setBoundsToContainer**(): _void_

_Defined in [src/ViewPortCamera.ts:304](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L304)_

**Returns:** _void_

---

### updateTopLeft

▸ **updateTopLeft**(`x`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `y`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `newZoomFactor?`: [ZoomFactor](../globals.md#zoomfactor), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

_Defined in [src/ViewPortCamera.ts:317](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPortCamera.ts#L317)_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `x`                 | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)                      |
| `y`                 | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)                      |
| `newZoomFactor?`    | [ZoomFactor](../globals.md#zoomfactor)                                            |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_