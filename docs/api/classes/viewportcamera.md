# Class: ViewPortCamera

## Hierarchy

- **ViewPortCamera**

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

**Returns:** _void_

---

### handleContainerSizeChanged

▸ **handleContainerSizeChanged**(`width`: [ClientPixelUnit](../globals.md#clientpixelunit), `height`: [ClientPixelUnit](../globals.md#clientpixelunit)): _void_

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

▸ **updateTopLeft**(`x`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `y`: [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit), `newZoomFactor?`: [ZoomFactor](../globals.md#zoomfactor), `animationOptions?`: [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md)): _void_

**Parameters:**

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `x`                 | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)                      |
| `y`                 | [VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)                      |
| `newZoomFactor?`    | [ZoomFactor](../globals.md#zoomfactor)                                            |
| `animationOptions?` | [ViewPortCameraAnimationOptions](../interfaces/viewportcameraanimationoptions.md) |

**Returns:** _void_
