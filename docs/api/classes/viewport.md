[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [ViewPort](viewport.md)

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

_Defined in [src/ViewPort.ts:101](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L101)_

**Parameters:**

| Name           | Type                                                |
| -------------- | --------------------------------------------------- |
| `containerDiv` | HTMLDivElement                                      |
| `options?`     | [ViewPortOptions](../interfaces/viewportoptions.md) |

**Returns:** _[ViewPort](viewport.md)_

## Properties

### camera

• **camera**: _[ViewPortCameraInterface](../globals.md#viewportcamerainterface)_

_Defined in [src/ViewPort.ts:86](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L86)_

---

### centerX

• **centerX**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:78](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L78)_

---

### centerY

• **centerY**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:79](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L79)_

---

### containerHeight

• **containerHeight**: _[ClientPixelUnit](../globals.md#clientpixelunit)_

_Defined in [src/ViewPort.ts:77](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L77)_

---

### containerWidth

• **containerWidth**: _[ClientPixelUnit](../globals.md#clientpixelunit)_

_Defined in [src/ViewPort.ts:76](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L76)_

---

### height

• **height**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:83](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L83)_

---

### left

• **left**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:80](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L80)_

---

### top

• **top**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:81](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L81)_

---

### width

• **width**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:82](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L82)_

---

### zoomFactor

• **zoomFactor**: _[ZoomFactor](../globals.md#zoomfactor)_

_Defined in [src/ViewPort.ts:84](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L84)_

## Methods

### destroy

▸ **destroy**(): _void_

_Defined in [src/ViewPort.ts:185](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L185)_

**Returns:** _void_

---

### setBounds

▸ **setBounds**(`bounds`: [ViewPortBounds](../interfaces/viewportbounds.md)): _void_

_Defined in [src/ViewPort.ts:208](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L208)_

**Parameters:**

| Name     | Type                                              |
| -------- | ------------------------------------------------- |
| `bounds` | [ViewPortBounds](../interfaces/viewportbounds.md) |

**Returns:** _void_

---

### translateClientRectToVirtualSpace

▸ **translateClientRectToVirtualSpace**(`rectOrElement`: ClientRect | HTMLElement): _[VirtualSpaceRect](../interfaces/virtualspacerect.md)_

_Defined in [src/ViewPort.ts:224](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L224)_

**Parameters:**

| Name            | Type                          |
| --------------- | ----------------------------- |
| `rectOrElement` | ClientRect &#124; HTMLElement |

**Returns:** _[VirtualSpaceRect](../interfaces/virtualspacerect.md)_

---

### translateClientXYCoordinatesToVirtualSpace

▸ **translateClientXYCoordinatesToVirtualSpace**(`x`: [ClientPixelUnit](../globals.md#clientpixelunit), `y`: [ClientPixelUnit](../globals.md#clientpixelunit)): _object_

_Defined in [src/ViewPort.ts:214](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L214)_

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

_Defined in [src/ViewPort.ts:250](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/ViewPort.ts#L250)_

This should be used when the div is resized. By default resizes due
to the window itself resizing will be automatically handled, but any other
resizes won't be handled (since there isn't a good way to get notified when
the div resizes.

If you are getting acess to the `ViewPort` via [Space](space.md) or [SpaceContext](../globals.md#const-spacecontext) you should not call this method directly and should
instead call the [Space.updateSize](space.md#updatesize) method.

**Returns:** _void_
