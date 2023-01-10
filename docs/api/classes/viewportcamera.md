# Class: ViewPortCamera

## Hierarchy

- **ViewPortCamera**

## Index

### Constructors

- [constructor](viewportcamera.md#constructor)

### Methods

- [centerFitAreaIntoView](viewportcamera.md#centerfitareaintoview)
- [centerFitElementIntoView](viewportcamera.md#centerfitelementintoview)
- [centerFitHorizontalAreaIntoView](viewportcamera.md#centerfithorizontalareaintoview)
- [destroy](viewportcamera.md#destroy)
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

\+ **new ViewPortCamera**(`values`: [ViewPortCameraValues](../interfaces/viewportcameravalues.md), `getElementVirtualSpaceCoordinates`: function, `onUpdated?`: undefined &#124; function): _[ViewPortCamera](viewportcamera.md)_

This is only intended to be constructed by the [ViewPort](viewport.md).

**Parameters:**

| Name         | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `values`     | [ViewPortCameraValues](../interfaces/viewportcameravalues.md) |
| `getElementVirtualSpaceCoordinates?` | function                              |
| `onUpdated?` | undefined &#124; function                                     |

**Returns:** _[ViewPortCamera](viewportcamera.md)_

## Methods

### centerFitAreaIntoView

▸ **centerFitAreaIntoView**(`area`: object, `additionalBounds?`: Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›, `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

▪ **area**: _object_

| Name     | Type                                                     |
| -------- | -------------------------------------------------------- |
| `height` | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit) |
| `left`   | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit) |
| `top`    | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit) |
| `width`  | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit) |

▪`Optional` **additionalBounds**: _Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›_

▪`Optional` **animationOptions**: _[ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)_

**Returns:** _void_

---

### centerFitElementIntoView

▸ **centerFitElementIntoView**(`element`: HTMLElement, `additionalBounds?`: Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›, `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

▪ **element**: HTMLElement

▪`Optional` **options**: _object_

| Name                                       | Type                                                              |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `elementExtraMarginForZoom`                | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)          |
| `elementExtraMarginForZoomInClientSpace`   | [ClientPixelUnit](../API.md#clientpixelunit)                      |
| `additionalBounds`                         | _Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›_ |


▪`Optional` **animationOptions**: _[ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)_

**Returns:** _void_

---

### centerFitHorizontalAreaIntoView

▸ **centerFitHorizontalAreaIntoView**(`left`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `width`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `additionalBounds?`: Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›, `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `left`              | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)                          |
| `width`             | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)                          |
| `additionalBounds?` | Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›                   |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### destroy

▸ **destroy**(): _void_

**Returns:** _void_

---

### moveBy

▸ **moveBy**(`dx`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `dy`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `dZoom?`: [ZoomFactor](../API.md#zoomfactor), `anchorContainerX?`: [ClientPixelUnit](../API.md#clientpixelunit), `anchorContainerY?`: [ClientPixelUnit](../API.md#clientpixelunit), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `dx`                | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)                          |
| `dy`                | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)                          |
| `dZoom?`            | [ZoomFactor](../API.md#zoomfactor)                                                |
| `anchorContainerX?` | [ClientPixelUnit](../API.md#clientpixelunit)                                      |
| `anchorContainerY?` | [ClientPixelUnit](../API.md#clientpixelunit)                                      |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### moveByInClientSpace

▸ **moveByInClientSpace**(`dx`: [ClientPixelUnit](../API.md#clientpixelunit), `dy`: [ClientPixelUnit](../API.md#clientpixelunit), `dZoom?`: [ZoomFactor](../API.md#zoomfactor), `anchorContainerX?`: [ClientPixelUnit](../API.md#clientpixelunit), `anchorContainerY?`: [ClientPixelUnit](../API.md#clientpixelunit), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `dx`                | [ClientPixelUnit](../API.md#clientpixelunit)                                      |
| `dy`                | [ClientPixelUnit](../API.md#clientpixelunit)                                      |
| `dZoom?`            | [ZoomFactor](../API.md#zoomfactor)                                                |
| `anchorContainerX?` | [ClientPixelUnit](../API.md#clientpixelunit)                                      |
| `anchorContainerY?` | [ClientPixelUnit](../API.md#clientpixelunit)                                      |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### moveWithDeceleration

▸ **moveWithDeceleration**(`vx`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `vy`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `friction`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `preventInterruption?`: undefined &#124; false &#124; true): _void_

**Parameters:**

| Name                   | Type                                                     |
| ---------------------- | -------------------------------------------------------- |
| `vx`                   | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit) |
| `vy`                   | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit) |
| `friction`             | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit) |
| `preventInterruption?` | undefined &#124; false &#124; true                       |

**Returns:** _void_

---

### moveWithDecelerationInClientSpace

▸ **moveWithDecelerationInClientSpace**(`vx`: [ClientPixelUnit](../API.md#clientpixelunit), `vy`: [ClientPixelUnit](../API.md#clientpixelunit), `friction`: [ClientPixelUnit](../API.md#clientpixelunit), `preventInterruption?`: undefined &#124; false &#124; true): _void_

**Parameters:**

| Name                   | Type                                         | Default |
| ---------------------- | -------------------------------------------- | ------- |
| `vx`                   | [ClientPixelUnit](../API.md#clientpixelunit) | -       |
| `vy`                   | [ClientPixelUnit](../API.md#clientpixelunit) | -       |
| `friction`             | [ClientPixelUnit](../API.md#clientpixelunit) | 0.84    |
| `preventInterruption?` | undefined &#124; false &#124; true           | -       |

**Returns:** _void_

---

### recenter

▸ **recenter**(`x`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `y`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `newZoomFactor?`: [ZoomFactor](../API.md#zoomfactor), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `x`                 | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)                          |
| `y`                 | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)                          |
| `newZoomFactor?`    | [ZoomFactor](../API.md#zoomfactor)                                                |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### setBounds

▸ **setBounds**(`bounds`: [ViewPortBounds](../interfaces/viewportbounds.md)): _void_

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

**Returns:** _void_

---

### updateTopLeft

▸ **updateTopLeft**(`x`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `y`: [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit), `newZoomFactor?`: [ZoomFactor](../API.md#zoomfactor), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `x`                 | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)                          |
| `y`                 | [VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)                          |
| `newZoomFactor?`    | [ZoomFactor](../API.md#zoomfactor)                                                |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_
