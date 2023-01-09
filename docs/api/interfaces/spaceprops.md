# Interface: SpaceProps

## Hierarchy

- **SpaceProps**

## Index

### Properties

- [className](spaceprops.md#optional-classname)
- [id](spaceprops.md#optional-id)
- [innerDivClassName](spaceprops.md#optional-innerdivclassname)
- [innerDivStyle](spaceprops.md#optional-innerdivstyle)
- [onCreate](spaceprops.md#optional-oncreate)
- [onDecideHowToHandlePress](spaceprops.md#optional-ondecidehowtohandlepress)
- [onHover](spaceprops.md#optional-onhover)
- [onContextMenu](spaceprops.md#optional-oncontextmenu)
- [onUpdated](spaceprops.md#optional-onupdated)
- [pollForElementResizing](spaceprops.md#optional-pollforelementresizing)
- [style](spaceprops.md#optional-style)
- [treatTwoFingerTrackPadGesturesLikeTouch](viewportoptions.md#optional-treattwofingertrackpadgesturesliketouch)

## Properties

### `Optional` className

• **className**? : _undefined &#124; string_

Optional CSS class to use on the outer `div` that the [Space](../classes/space.md) renders.

---

### `Optional` id

• **id**? : _undefined &#124; string_

Optional id to use on the outer `div` that the [Space](../classes/space.md) renders.

---

### `Optional` innerDivClassName

• **innerDivClassName**? : _undefined &#124; string_

**DEPRECATED** Optional CSS class to use on the inner `div` that the [Space](../classes/space.md) scales and
transforms.

This is deprecated and may be removed at some point. Some styles may mess up the
CSS transforms applied to the inner div so it is safer to avoid this and style
your children a different way.

---

### `Optional` innerDivStyle

• **innerDivStyle**? : _React.CSSProperties_

**DEPRECATED** Optional styles class to use on the inner `div` that the [Space](../classes/space.md) scales
and transforms.

This is deprecated and may be removed at some point. Some styles may mess up the
CSS transforms applied to the inner div so it is safer to avoid this and style
your children a different way.

---

### `Optional` onCreate

• **onCreate**? : _undefined &#124; function_

Called when the `Space` first creates the outer `div` and sets up the
[ViewPort](../classes/viewport.md), but before the inner `div` and the `Space`'s children have
been rendered. This can be used, for example, to make the
[ViewPort](../classes/viewport.md) focus on a certain portion of the virtual space.

---

### `Optional` onDecideHowToHandlePress

• **onDecideHowToHandlePress**? : _[DecidePressHandlingCallback](../API.md#decidepresshandlingcallback)_

Optional callback to be called when a press is initiated in the space.
Generally you should prefer to use [Pressable](../classes/pressable.md) to handle presses, but
this can be used as a lower level alternative. The result of the callback
is a [PressHandlingOptions](presshandlingoptions.md) (or `undefined`) that describes how the
press should be handled.

If the callback returns a [PressHandlingOptions](presshandlingoptions.md) it will take precedence
over [Pressable](../classes/pressable.md) and [NoPanArea](../classes/nopanarea.md) components (even if the press was on
one of those).

---

### `Optional` onHover

• **onHover**? : _undefined &#124; function_

Called when a mouse hover event happens anywhere in the [Space](../classes/space.md).

---

### `Optional` onContextMenu

• **onContextMenu**? : _undefined &#124; function_

Called when a right click event happens anywhere in the [Space](../classes/space.md).

**`returns`** Whether to prevent (`true`) a [Pressable](../classes/pressable.md) from also handling
this event (if it was also the target).

---

### `Optional` onUpdated

• **onUpdated**? : _undefined &#124; function_

Called whenever the [ViewPort](../classes/viewport.md) is updated.

---

### `Optional` pollForElementResizing

• **pollForElementResizing**? : _undefined | false &#124; true_

If set, the `Space` will poll every 500ms for changes to its parent element's size. This only has to be used if the
parent element can resize for reasons other than the window resizing, and if the [updateSize](../classes/space.md#updatesize) is not used.

---

### `Optional` style

• **style**? : _React.CSSProperties_

Optional styles to set on the outer `div` that the [Space](../classes/space.md) renders.

---

### `Optional` treatTwoFingerTrackPadGesturesLikeTouch

• **treatTwoFingerTrackPadGesturesLikeTouch**? : _undefined &#124; boolean_

By default two finger trackpad gestures are always handled as a zoom
in/zoom out, like with Google Maps. If this is set to true, then
only pinch/spread gestures will be handled like that, and pan style two
finger gestures will be handled as a pan.

However, this will cause mouse wheel interactions to behave like vertical
panning rather than zoom in/zoom out. There is sadly no great way around
this, but there are some techniques you can use to guess whether the user
is using a mouse or a trackpad.

Note that this prop is only read during initial mounting. Updates will
be ignored.
