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
- [containerDiv](viewport.md#private-containerdiv)
- [containerHeight](viewport.md#containerheight)
- [containerWidth](viewport.md#containerwidth)
- [currentDesktopSafariGestureState](viewport.md#private-optional-currentdesktopsafarigesturestate)
- [currentHammerGestureState](viewport.md#private-optional-currenthammergesturestate)
- [hammer](viewport.md#private-hammer)
- [height](viewport.md#height)
- [inNonPanPressHandlingMode](viewport.md#private-innonpanpresshandlingmode)
- [left](viewport.md#left)
- [options](viewport.md#private-optional-options)
- [top](viewport.md#top)
- [width](viewport.md#width)
- [zoomFactor](viewport.md#zoomfactor)

### Methods

- [destroy](viewport.md#destroy)
- [getPressCoordinatesFromEvent](viewport.md#private-getpresscoordinatesfromevent)
- [handleContextMenu](viewport.md#private-handlecontextmenu)
- [handleGestureChangeForDesktopSafari](viewport.md#private-handlegesturechangefordesktopsafari)
- [handleGestureEndForDesktopSafari](viewport.md#private-handlegestureendfordesktopsafari)
- [handleGestureStartForDesktopSafari](viewport.md#private-handlegesturestartfordesktopsafari)
- [handleHammerPanCancel](viewport.md#private-handlehammerpancancel)
- [handleHammerPanEnd](viewport.md#private-handlehammerpanend)
- [handleHammerPanMove](viewport.md#private-handlehammerpanmove)
- [handleHammerPanStart](viewport.md#private-handlehammerpanstart)
- [handleHammerPinchCancel](viewport.md#private-handlehammerpinchcancel)
- [handleHammerPinchEnd](viewport.md#private-handlehammerpinchend)
- [handleHammerPinchMove](viewport.md#private-handlehammerpinchmove)
- [handleHammerPinchStart](viewport.md#private-handlehammerpinchstart)
- [handleMouseDown](viewport.md#private-handlemousedown)
- [handleMouseMove](viewport.md#private-handlemousemove)
- [handleMouseUp](viewport.md#private-handlemouseup)
- [handleTouchEnd](viewport.md#private-handletouchend)
- [handleTouchMove](viewport.md#private-handletouchmove)
- [handleTouchStart](viewport.md#private-handletouchstart)
- [handleWheel](viewport.md#private-handlewheel)
- [setBounds](viewport.md#setbounds)
- [translateClientRectToVirtualSpace](viewport.md#translateclientrecttovirtualspace)
- [translateClientXYCoordinatesToVirtualSpace](viewport.md#translateclientxycoordinatestovirtualspace)
- [updateContainerSize](viewport.md#updatecontainersize)

## Constructors

### constructor

\+ **new ViewPort**(`containerDiv`: HTMLDivElement, `options?`: [ViewPortOptions](../interfaces/viewportoptions.md)): _[ViewPort](viewport.md)_

_Defined in [src/ViewPort.ts:101](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L101)_

**Parameters:**

| Name           | Type                                                |
| -------------- | --------------------------------------------------- |
| `containerDiv` | HTMLDivElement                                      |
| `options?`     | [ViewPortOptions](../interfaces/viewportoptions.md) |

**Returns:** _[ViewPort](viewport.md)_

## Properties

### camera

• **camera**: _[ViewPortCameraInterface](../globals.md#viewportcamerainterface)_

_Defined in [src/ViewPort.ts:86](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L86)_

---

### centerX

• **centerX**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:78](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L78)_

---

### centerY

• **centerY**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:79](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L79)_

---

### `Private` containerDiv

• **containerDiv**: _HTMLElement_

_Defined in [src/ViewPort.ts:88](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L88)_

---

### containerHeight

• **containerHeight**: _[ClientPixelUnit](../globals.md#clientpixelunit)_

_Defined in [src/ViewPort.ts:77](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L77)_

---

### containerWidth

• **containerWidth**: _[ClientPixelUnit](../globals.md#clientpixelunit)_

_Defined in [src/ViewPort.ts:76](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L76)_

---

### `Private` `Optional` currentDesktopSafariGestureState

• **currentDesktopSafariGestureState**? : _undefined | object_

_Defined in [src/ViewPort.ts:94](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L94)_

---

### `Private` `Optional` currentHammerGestureState

• **currentHammerGestureState**? : _undefined | object_

_Defined in [src/ViewPort.ts:89](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L89)_

---

### `Private` hammer

• **hammer**: _HammerManager_

_Defined in [src/ViewPort.ts:99](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L99)_

---

### height

• **height**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:83](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L83)_

---

### `Private` inNonPanPressHandlingMode

• **inNonPanPressHandlingMode**: _undefined | "capture" | "ignore"_

_Defined in [src/ViewPort.ts:101](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L101)_

---

### left

• **left**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:80](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L80)_

---

### `Private` `Optional` options

• **options**? : _[ViewPortOptions](../interfaces/viewportoptions.md)_

_Defined in [src/ViewPort.ts:100](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L100)_

---

### top

• **top**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:81](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L81)_

---

### width

• **width**: _[VirtualSpacePixelUnit](../globals.md#virtualspacepixelunit)_

_Defined in [src/ViewPort.ts:82](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L82)_

---

### zoomFactor

• **zoomFactor**: _[ZoomFactor](../globals.md#zoomfactor)_

_Defined in [src/ViewPort.ts:84](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L84)_

## Methods

### destroy

▸ **destroy**(): _void_

_Defined in [src/ViewPort.ts:185](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L185)_

**Returns:** _void_

---

### `Private` getPressCoordinatesFromEvent

▸ **getPressCoordinatesFromEvent**(`e`: MouseEvent | TouchEvent): _[PressEventCoordinates](../interfaces/presseventcoordinates.md)_

_Defined in [src/ViewPort.ts:256](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L256)_

**Parameters:**

| Name | Type                         |
| ---- | ---------------------------- |
| `e`  | MouseEvent &#124; TouchEvent |

**Returns:** _[PressEventCoordinates](../interfaces/presseventcoordinates.md)_

---

### `Private` handleContextMenu

▸ **handleContextMenu**(`e`: MouseEvent): _void_

_Defined in [src/ViewPort.ts:274](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L274)_

**Parameters:**

| Name | Type       |
| ---- | ---------- |
| `e`  | MouseEvent |

**Returns:** _void_

---

### `Private` handleGestureChangeForDesktopSafari

▸ **handleGestureChangeForDesktopSafari**(`e`: any): _void_

_Defined in [src/ViewPort.ts:294](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L294)_

**Parameters:**

| Name | Type |
| ---- | ---- |
| `e`  | any  |

**Returns:** _void_

---

### `Private` handleGestureEndForDesktopSafari

▸ **handleGestureEndForDesktopSafari**(`e`: any): _void_

_Defined in [src/ViewPort.ts:311](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L311)_

**Parameters:**

| Name | Type |
| ---- | ---- |
| `e`  | any  |

**Returns:** _void_

---

### `Private` handleGestureStartForDesktopSafari

▸ **handleGestureStartForDesktopSafari**(`e`: any): _void_

_Defined in [src/ViewPort.ts:281](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L281)_

**Parameters:**

| Name | Type |
| ---- | ---- |
| `e`  | any  |

**Returns:** _void_

---

### `Private` handleHammerPanCancel

▸ **handleHammerPanCancel**(`e`: HammerInput): _void_

_Defined in [src/ViewPort.ts:366](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L366)_

**Parameters:**

| Name | Type        |
| ---- | ----------- |
| `e`  | HammerInput |

**Returns:** _void_

---

### `Private` handleHammerPanEnd

▸ **handleHammerPanEnd**(`e`: HammerInput): _void_

_Defined in [src/ViewPort.ts:353](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L353)_

**Parameters:**

| Name | Type        |
| ---- | ----------- |
| `e`  | HammerInput |

**Returns:** _void_

---

### `Private` handleHammerPanMove

▸ **handleHammerPanMove**(`e`: HammerInput): _void_

_Defined in [src/ViewPort.ts:326](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L326)_

**Parameters:**

| Name | Type        |
| ---- | ----------- |
| `e`  | HammerInput |

**Returns:** _void_

---

### `Private` handleHammerPanStart

▸ **handleHammerPanStart**(`e`: HammerInput): _void_

_Defined in [src/ViewPort.ts:319](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L319)_

**Parameters:**

| Name | Type        |
| ---- | ----------- |
| `e`  | HammerInput |

**Returns:** _void_

---

### `Private` handleHammerPinchCancel

▸ **handleHammerPinchCancel**(`e`: HammerInput): _void_

_Defined in [src/ViewPort.ts:421](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L421)_

**Parameters:**

| Name | Type        |
| ---- | ----------- |
| `e`  | HammerInput |

**Returns:** _void_

---

### `Private` handleHammerPinchEnd

▸ **handleHammerPinchEnd**(`e`: HammerInput): _void_

_Defined in [src/ViewPort.ts:408](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L408)_

**Parameters:**

| Name | Type        |
| ---- | ----------- |
| `e`  | HammerInput |

**Returns:** _void_

---

### `Private` handleHammerPinchMove

▸ **handleHammerPinchMove**(`e`: HammerInput): _void_

_Defined in [src/ViewPort.ts:380](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L380)_

**Parameters:**

| Name | Type        |
| ---- | ----------- |
| `e`  | HammerInput |

**Returns:** _void_

---

### `Private` handleHammerPinchStart

▸ **handleHammerPinchStart**(`e`: HammerInput): _void_

_Defined in [src/ViewPort.ts:373](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L373)_

**Parameters:**

| Name | Type        |
| ---- | ----------- |
| `e`  | HammerInput |

**Returns:** _void_

---

### `Private` handleMouseDown

▸ **handleMouseDown**(`e`: MouseEvent): _void_

_Defined in [src/ViewPort.ts:428](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L428)_

**Parameters:**

| Name | Type       |
| ---- | ---------- |
| `e`  | MouseEvent |

**Returns:** _void_

---

### `Private` handleMouseMove

▸ **handleMouseMove**(`e`: MouseEvent): _void_

_Defined in [src/ViewPort.ts:444](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L444)_

**Parameters:**

| Name | Type       |
| ---- | ---------- |
| `e`  | MouseEvent |

**Returns:** _void_

---

### `Private` handleMouseUp

▸ **handleMouseUp**(`e`: MouseEvent): _void_

_Defined in [src/ViewPort.ts:459](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L459)_

**Parameters:**

| Name | Type       |
| ---- | ---------- |
| `e`  | MouseEvent |

**Returns:** _void_

---

### `Private` handleTouchEnd

▸ **handleTouchEnd**(`e`: TouchEvent): _void_

_Defined in [src/ViewPort.ts:498](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L498)_

**Parameters:**

| Name | Type       |
| ---- | ---------- |
| `e`  | TouchEvent |

**Returns:** _void_

---

### `Private` handleTouchMove

▸ **handleTouchMove**(`e`: TouchEvent): _void_

_Defined in [src/ViewPort.ts:485](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L485)_

**Parameters:**

| Name | Type       |
| ---- | ---------- |
| `e`  | TouchEvent |

**Returns:** _void_

---

### `Private` handleTouchStart

▸ **handleTouchStart**(`e`: TouchEvent): _void_

_Defined in [src/ViewPort.ts:469](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L469)_

**Parameters:**

| Name | Type       |
| ---- | ---------- |
| `e`  | TouchEvent |

**Returns:** _void_

---

### `Private` handleWheel

▸ **handleWheel**(`e`: WheelEvent): _void_

_Defined in [src/ViewPort.ts:509](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L509)_

**Parameters:**

| Name | Type       |
| ---- | ---------- |
| `e`  | WheelEvent |

**Returns:** _void_

---

### setBounds

▸ **setBounds**(`bounds`: [ViewPortBounds](../interfaces/viewportbounds.md)): _void_

_Defined in [src/ViewPort.ts:208](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L208)_

**Parameters:**

| Name     | Type                                              |
| -------- | ------------------------------------------------- |
| `bounds` | [ViewPortBounds](../interfaces/viewportbounds.md) |

**Returns:** _void_

---

### translateClientRectToVirtualSpace

▸ **translateClientRectToVirtualSpace**(`rectOrElement`: ClientRect | HTMLElement): _[VirtualSpaceRect](../interfaces/virtualspacerect.md)_

_Defined in [src/ViewPort.ts:224](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L224)_

**Parameters:**

| Name            | Type                          |
| --------------- | ----------------------------- |
| `rectOrElement` | ClientRect &#124; HTMLElement |

**Returns:** _[VirtualSpaceRect](../interfaces/virtualspacerect.md)_

---

### translateClientXYCoordinatesToVirtualSpace

▸ **translateClientXYCoordinatesToVirtualSpace**(`x`: [ClientPixelUnit](../globals.md#clientpixelunit), `y`: [ClientPixelUnit](../globals.md#clientpixelunit)): _object_

_Defined in [src/ViewPort.ts:214](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L214)_

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

_Defined in [src/ViewPort.ts:250](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPort.ts#L250)_

This should be used when the div is resized. By default resizes due
to the window itself resizing will be automatically handled, but any other
resizes won't be handled (since there isn't a good way to get notified when
the div resizes.

If you are getting acess to the `ViewPort` via [Space](space.md) or [SpaceContext](../globals.md#const-spacecontext) you should not call this method directly and should
instead call the [Space.updateSize](space.md#updatesize) method.

**Returns:** _void_
