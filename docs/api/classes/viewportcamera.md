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

**Parameters:**

▪ **area**: _object_

| Name     | Type                                                     |
| -------- | -------------------------------------------------------- |
| `height` | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit) |
| `left`   | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit) |
| `top`    | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit) |
| `width`  | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit) |

▪`Optional` **additionalBounds**: _Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›_

▪`Optional` **animationOptions**: _[ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)_

**Returns:** _void_

---

### centerFitHorizontalAreaIntoView

▸ **centerFitHorizontalAreaIntoView**(`left`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `width`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `additionalBounds?`: Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›, `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `left`              | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit)                          |
| `width`             | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit)                          |
| `additionalBounds?` | Pick‹[ViewPortBounds](../interfaces/viewportbounds.md), "zoom"›                   |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### destroy

▸ **destroy**(): _void_

**Returns:** _void_

---

### handleContainerSizeChanged

▸ **handleContainerSizeChanged**(`width`: [ClientPixelUnit](../api.md#clientpixelunit), `height`: [ClientPixelUnit](../api.md#clientpixelunit)): _void_

This is not intended to be called by code outside of react-zoomable-ui itself.

**Parameters:**

| Name     | Type                                         |
| -------- | -------------------------------------------- |
| `width`  | [ClientPixelUnit](../api.md#clientpixelunit) |
| `height` | [ClientPixelUnit](../api.md#clientpixelunit) |

**Returns:** _void_

---

### moveBy

▸ **moveBy**(`dx`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `dy`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `dZoom?`: [ZoomFactor](../api.md#zoomfactor), `anchorContainerX?`: [ClientPixelUnit](../api.md#clientpixelunit), `anchorContainerY?`: [ClientPixelUnit](../api.md#clientpixelunit), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `dx`                | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit)                          |
| `dy`                | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit)                          |
| `dZoom?`            | [ZoomFactor](../api.md#zoomfactor)                                                |
| `anchorContainerX?` | [ClientPixelUnit](../api.md#clientpixelunit)                                      |
| `anchorContainerY?` | [ClientPixelUnit](../api.md#clientpixelunit)                                      |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### moveByInClientSpace

▸ **moveByInClientSpace**(`dx`: [ClientPixelUnit](../api.md#clientpixelunit), `dy`: [ClientPixelUnit](../api.md#clientpixelunit), `dZoom?`: [ZoomFactor](../api.md#zoomfactor), `anchorContainerX?`: [ClientPixelUnit](../api.md#clientpixelunit), `anchorContainerY?`: [ClientPixelUnit](../api.md#clientpixelunit), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `dx`                | [ClientPixelUnit](../api.md#clientpixelunit)                                      |
| `dy`                | [ClientPixelUnit](../api.md#clientpixelunit)                                      |
| `dZoom?`            | [ZoomFactor](../api.md#zoomfactor)                                                |
| `anchorContainerX?` | [ClientPixelUnit](../api.md#clientpixelunit)                                      |
| `anchorContainerY?` | [ClientPixelUnit](../api.md#clientpixelunit)                                      |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_

---

### moveWithDeceleration

▸ **moveWithDeceleration**(`vx`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `vy`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `friction`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `preventInterruption?`: undefined | false | true): _void_

**Parameters:**

| Name                   | Type                                                     |
| ---------------------- | -------------------------------------------------------- |
| `vx`                   | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit) |
| `vy`                   | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit) |
| `friction`             | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit) |
| `preventInterruption?` | undefined &#124; false &#124; true                       |

**Returns:** _void_

---

### moveWithDecelerationInClientSpace

▸ **moveWithDecelerationInClientSpace**(`vx`: [ClientPixelUnit](../api.md#clientpixelunit), `vy`: [ClientPixelUnit](../api.md#clientpixelunit), `friction`: [ClientPixelUnit](../api.md#clientpixelunit), `preventInterruption?`: undefined | false | true): _void_

**Parameters:**

| Name                   | Type                                         | Default |
| ---------------------- | -------------------------------------------- | ------- |
| `vx`                   | [ClientPixelUnit](../api.md#clientpixelunit) | -       |
| `vy`                   | [ClientPixelUnit](../api.md#clientpixelunit) | -       |
| `friction`             | [ClientPixelUnit](../api.md#clientpixelunit) | 0.84    |
| `preventInterruption?` | undefined &#124; false &#124; true           | -       |

**Returns:** _void_

---

### recenter

▸ **recenter**(`x`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `y`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `newZoomFactor?`: [ZoomFactor](../api.md#zoomfactor), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `x`                 | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit)                          |
| `y`                 | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit)                          |
| `newZoomFactor?`    | [ZoomFactor](../api.md#zoomfactor)                                                |
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

▸ **updateTopLeft**(`x`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `y`: [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit), `newZoomFactor?`: [ZoomFactor](../api.md#zoomfactor), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `x`                 | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit)                          |
| `y`                 | [VirtualSpacePixelUnit](../api.md#virtualspacepixelunit)                          |
| `newZoomFactor?`    | [ZoomFactor](../api.md#zoomfactor)                                                |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_
