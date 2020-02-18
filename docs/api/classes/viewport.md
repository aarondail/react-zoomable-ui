# Class: ViewPort

The [ViewPort](viewport.md) represents a "view" into a virtual space, that is not
tied to the available screen space or HTML elements. Because of this, it is
infinite, but it also uses its own "units" (virtual space pixels).

You can think of the view port as describing what rectangular portion of the
virtual space (from top left to bottom right) should be visible inside the
bounds of containing HTML element where the virtual space is being rendered.

Please see the (Guide)[../docs/Guide.md] for more details.

## Hierarchy

- **ViewPort**

## Constructors

### constructor

\+ **new ViewPort**(`containerDiv`: HTMLDivElement, `options?`: [ViewPortOptions](../interfaces/viewportoptions.md)): _[ViewPort](viewport.md)_

**Parameters:**

| Name           | Type                                                |
| -------------- | --------------------------------------------------- |
| `containerDiv` | HTMLDivElement                                      |
| `options?`     | [ViewPortOptions](../interfaces/viewportoptions.md) |

**Returns:** _[ViewPort](viewport.md)_

## Properties

### camera

• **camera**: _[ViewPortCameraInterface](../globals.md#viewportcamerainterface)_

---

### centerX

• **centerX**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

---

### centerY

• **centerY**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

---

### containerHeight

• **containerHeight**: _[ClientPixelUnit](../globals.md#clientpixelunit)_

---

### containerWidth

• **containerWidth**: _[ClientPixelUnit](../globals.md#clientpixelunit)_

---

### height

• **height**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

---

### left

• **left**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

---

### top

• **top**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

---

### width

• **width**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

---

### zoomFactor

• **zoomFactor**: _[ZoomFactor](../globals.md#zoomfactor)_

## Methods

### destroy

▸ **destroy**(): _void_

**Returns:** _void_

---

### setBounds

▸ **setBounds**(`bounds`: [ViewPortBounds](../interfaces/viewportbounds.md)): _void_

**Parameters:**

| Name     | Type                                              |
| -------- | ------------------------------------------------- |
| `bounds` | [ViewPortBounds](../interfaces/viewportbounds.md) |

**Returns:** _void_

---

### translateClientRectToVirtualSpace

▸ **translateClientRectToVirtualSpace**(`rectOrElement`: ClientRect | HTMLElement): _[VirtualSpaceRect](../interfaces/virtualspacerect.md)_

**Parameters:**

| Name            | Type                          |
| --------------- | ----------------------------- |
| `rectOrElement` | ClientRect &#124; HTMLElement |

**Returns:** _[VirtualSpaceRect](../interfaces/virtualspacerect.md)_

---

### translateClientXYCoordinatesToVirtualSpace

▸ **translateClientXYCoordinatesToVirtualSpace**(`x`: [ClientPixelUnit](../globals.md#clientpixelunit), `y`: [ClientPixelUnit](../globals.md#clientpixelunit)): _object_

**Parameters:**

| Name | Type                                             |
| ---- | ------------------------------------------------ |
| `x`  | [ClientPixelUnit](../globals.md#clientpixelunit) |
| `y`  | [ClientPixelUnit](../globals.md#clientpixelunit) |

**Returns:** _object_

- **x**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

- **y**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

---

### updateContainerSize

▸ **updateContainerSize**(): _void_

This should be used when the div is resized. By default resizes due
to the window itself resizing will be automatically handled, but any other
resizes won't be handled (since there isn't a good way to get notified when
the div resizes.

If you are getting acess to the `ViewPort` via [Space](space.md) or [SpaceContext](../globals.md#const-spacecontext) you should not call this method directly and should
instead call the [Space.updateSize](space.md#updatesize) method.

**Returns:** _void_
