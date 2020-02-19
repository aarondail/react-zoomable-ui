# Class: Space

This component makes its children zoomable and pan-able.

Please read the [Guide](../../Guide.md) for all the details on how to use this.

## Props

See [SpaceProps](../interfaces/spaceprops.md).

## Hierarchy

- PureComponent‹[SpaceProps](../interfaces/spaceprops.md), [SpaceState](../interfaces/spacestate.md)›

  ↳ **Space**

## Index

### Properties

- [viewPort](space.md#optional-viewport)

### Methods

- [updateSize](space.md#updatesize)

## Properties

### `Optional` viewPort

• **viewPort**? : _[ViewPort](viewport.md)_

Describes what portion of the virtual coordinate space is visible inside
the `Space`, and, among other things, provides access to the
[ViewPortCamera](viewportcamera.md) which can change that.

This is not created until after the component has been mounted, so use the
[onCreate](../interfaces/spaceprops.md#optional-oncreate) prop if you need to manipulate it before the children of the
`Space` are first rendered. The [onUpdated](../interfaces/spaceprops.md#optional-onupdated) prop can be used to listen
for changes.

## Methods

### updateSize

▸ **updateSize**(): _void_

This should be called in some cases to tell the `Space` that its parent
element has resized. See the [Guide](../../Guide.md) for more info.

**Returns:** _void_
