# Class: ViewPort

The [ViewPort](viewport.md) represents a "view" into a virtual space, that is not
tied to the available screen space or HTML elements. Because of this, it is
infinite, but it also uses its own "units" (virtual space pixels).

You can think of the view port as describing what rectangular portion of the
virtual space (from top left to bottom right) should be visible inside the
bounds of containing HTML element where the virtual space is being rendered.

This is lower-level than the [Space](space.md), so in most cases you probably won't want to create one of these directly.

Please see the [Guide](../../Guide.md) for more information.

## Hierarchy

- **ViewPort**

## Index

### Constructors

- [constructor](viewport.md#constructor)

### Properties

- [camera](viewport.md#camera)
- [centerX](viewport.md#centerx)
- [centerY](viewport.md#centery)
- [containerHeight](viewport.md#containerheight)
- [containerWidth](viewport.md#containerwidth)
- [height](viewport.md#height)
- [left](viewport.md#left)
- [top](viewport.md#top)
- [width](viewport.md#width)
- [zoomFactor](viewport.md#zoomfactor)

### Methods

- [destroy](viewport.md#destroy)
- [setBounds](viewport.md#setbounds)
- [translateClientRectToVirtualSpace](viewport.md#translateclientrecttovirtualspace)
- [translateClientXYCoordinatesToVirtualSpace](viewport.md#translateclientxycoordinatestovirtualspace)
- [updateContainerSize](viewport.md#updatecontainersize)

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

• **camera**: _[ViewPortCamera](viewportcamera.md)_

The camera provides methods to move and animate the [ViewPort](viewport.md).

---

### centerX

• **centerX**: _[VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)_

---

### centerY

• **centerY**: _[VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)_

---

### containerHeight

• **containerHeight**: _[ClientPixelUnit](../API.md#clientpixelunit)_

---

### containerWidth

• **containerWidth**: _[ClientPixelUnit](../API.md#clientpixelunit)_

---

### height

• **height**: _[VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)_

---

### left

• **left**: _[VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)_

---

### top

• **top**: _[VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)_

---

### width

• **width**: _[VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)_

---

### zoomFactor

• **zoomFactor**: _[ZoomFactor](../API.md#zoomfactor)_

## Methods

### destroy

▸ **destroy**(): _void_

Call this to detach all event listeners that the [ViewPort](viewport.md) sets up.
After this is called no further updates will happen.

**Returns:** _void_

---

### setBounds

▸ **setBounds**(`bounds`: [ViewPortBounds](../interfaces/viewportbounds.md)): _void_

Constrain the virtual space so the user can not pan beyond, and the camera
cannot show anything beyond, the provided min/max values for x, y, and the
zoom factor.

**Parameters:**

| Name     | Type                                              |
| -------- | ------------------------------------------------- |
| `bounds` | [ViewPortBounds](../interfaces/viewportbounds.md) |

**Returns:** _void_

---

### translateClientRectToVirtualSpace

▸ **translateClientRectToVirtualSpace**(`rectOrElement`: ClientRect &#124; HTMLElement): _[VirtualSpaceRect](../interfaces/virtualspacerect.md)_

**Parameters:**

| Name            | Type                          |
| --------------- | ----------------------------- |
| `rectOrElement` | ClientRect &#124; HTMLElement |

**Returns:** _[VirtualSpaceRect](../interfaces/virtualspacerect.md)_

---

### translateClientXYCoordinatesToVirtualSpace

▸ **translateClientXYCoordinatesToVirtualSpace**(`clientX`: [ClientPixelUnit](../API.md#clientpixelunit), `clientY`: [ClientPixelUnit](../API.md#clientpixelunit)): _object_

**Parameters:**

| Name | Type                                         |
| ---- | -------------------------------------------- |
| `clientX`  | [ClientPixelUnit](../API.md#clientpixelunit) |
| `clientY`  | [ClientPixelUnit](../API.md#clientpixelunit) |

**Returns:** _object_

- **x**: _[VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)_

- **y**: _[VirtualSpacePixelUnit](../API.md#virtualspacepixelunit)_

---

### updateContainerSize

▸ **updateContainerSize**(): _void_

This should be used when the div is resized. By default resizes due to the
window itself resizing will be automatically handled, but any other
resizes won't be handled (since there isn't a good way to get notified
when the div resizes.

If you are getting access to the `ViewPort` via [Space](space.md) or
[SpaceContext](../API.md#const-spacecontext) you should not call this method directly and should
instead call the [Space.updateSize](space.md#updatesize) method.

**Returns:** _void_
