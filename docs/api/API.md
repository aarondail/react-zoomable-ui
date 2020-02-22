### Classes

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
- [SpaceContextType](interfaces/spacecontexttype.md)
- [SpaceProps](interfaces/spaceprops.md)
- [ViewPortBounds](interfaces/viewportbounds.md)
- [ViewPortCameraAnimationOptions](interfaces/viewportcameraanimationoptions.md)
- [ViewPortOptions](interfaces/viewportoptions.md)
- [VirtualSpaceRect](interfaces/virtualspacerect.md)

### Type aliases

- [ClientPixelUnit](API.md#clientpixelunit)
- [DecidePressHandlingCallback](API.md#decidepresshandlingcallback)
- [VirtualSpacePixelUnit](API.md#virtualspacepixelunit)
- [ZoomFactor](API.md#zoomfactor)

### Variables

- [SpaceContext](API.md#const-spacecontext)

### Functions

- [suppressBrowserZooming](API.md#suppressbrowserzooming)

## Type aliases

### ClientPixelUnit

**ClientPixelUnit**: _number_

This is just a type alias for `number`. Variables or parameters of this type refer to client (as in the browser window)'s concept of pixels (which are not the same as screen pixels).

---

### DecidePressHandlingCallback

**DecidePressHandlingCallback**: _function_

This type of callback is given to the [PressInterpreter](classes/pressinterpreter.md) and takes one of
the underlying events that starts a "press" as far as the library is
concerned (either a left click mouse down event, or a single finger touch
start event), and returns an [PressHandlingOptions](interfaces/presshandlingoptions.md) object (or
`undefined`) detailing how the [PressInterpreter](classes/pressinterpreter.md) should handle the
press.

#### Type declaration:

(`e`: MouseEvent &#124; TouchEvent, `coordinates`: [PressEventCoordinates](interfaces/presseventcoordinates.md)): _[PressHandlingOptions](interfaces/presshandlingoptions.md) &#124; undefined_

**Parameters:**

| Name          | Type                                                         |
| ------------- | ------------------------------------------------------------ |
| `e`           | MouseEvent &#124; TouchEvent                                 |
| `coordinates` | [PressEventCoordinates](interfaces/presseventcoordinates.md) |

---

### VirtualSpacePixelUnit

**VirtualSpacePixelUnit**: _number_

This is a type alias representing the pixels inside the virtual space created by the library.

---

### ZoomFactor

**ZoomFactor**: _number_

A type alias for number. A zoom factor is the amount the virtual space is being zoomed in. `2` represents 200% zoom (in), while `0.5` represents 50% zoom (so zoomed out).

## Variables

### `Const` SpaceContext

**SpaceContext**: `React.Context‹`[SpaceContextType](interfaces/spacecontexttype.md)`›`

This React context can be used within a [Space](classes/space.md) to get access to the [ViewPort](classes/viewport.md).

## Functions

### suppressBrowserZooming

**suppressBrowserZooming**(): `() => void`

This is not used by the [ViewPort](classes/viewport.md), but if you have HTML elements around the
[ViewPort](classes/viewport.md) you may want to suppress zooming or panning on the whole page. This
function will do that.

**Returns:** `() => void`

A callback which will stop the suppression.
