[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [Space](space.md)

# Class: Space <**SS**>

This component makes its children zoomable and pan-able.

Please read the (Guide)[../docs/Guide.md] for all the details on how to use
this.

## Props

See [SpaceProps](../interfaces/spaceprops.md).

## Type parameters

▪ **SS**

## Hierarchy

- PureComponent‹[SpaceProps](../interfaces/spaceprops.md), [SpaceState](../interfaces/spacestate.md)›

  ↳ **Space**

## Index

### Constructors

- [constructor](space.md#constructor)

### Properties

- [constantStyles](space.md#private-constantstyles)
- [currentHoveredPressable](space.md#private-optional-currenthoveredpressable)
- [elementSizeChangePoller](space.md#private-elementsizechangepoller)
- [interactableRegistry](space.md#private-interactableregistry)
- [outerDivRef](space.md#private-optional-outerdivref)
- [pressInterpreter](space.md#private-pressinterpreter)
- [rootDivUniqueClassName](space.md#private-rootdivuniqueclassname)
- [viewPort](space.md#optional-viewport)

### Methods

- [UNSAFE_componentWillMount](space.md#optional-unsafe_componentwillmount)
- [UNSAFE_componentWillReceiveProps](space.md#optional-unsafe_componentwillreceiveprops)
- [UNSAFE_componentWillUpdate](space.md#optional-unsafe_componentwillupdate)
- [componentDidCatch](space.md#optional-componentdidcatch)
- [componentDidMount](space.md#optional-componentdidmount)
- [componentDidUpdate](space.md#componentdidupdate)
- [componentWillMount](space.md#optional-componentwillmount)
- [componentWillReceiveProps](space.md#optional-componentwillreceiveprops)
- [componentWillUnmount](space.md#componentwillunmount)
- [componentWillUpdate](space.md#optional-componentwillupdate)
- [createTransformStyle](space.md#private-createtransformstyle)
- [destroyViewPort](space.md#private-destroyviewport)
- [getSnapshotBeforeUpdate](space.md#optional-getsnapshotbeforeupdate)
- [handleDecideHowToHandlePress](space.md#private-handledecidehowtohandlepress)
- [handleDragStart](space.md#private-handledragstart)
- [handleHover](space.md#private-handlehover)
- [handlePressContextMenu](space.md#private-handlepresscontextmenu)
- [handleViewPortUpdated](space.md#private-handleviewportupdated)
- [render](space.md#render)
- [setOuterDivRefAndCreateViewPort](space.md#private-setouterdivrefandcreateviewport)
- [shouldComponentUpdate](space.md#optional-shouldcomponentupdate)
- [updateSize](space.md#updatesize)

## Constructors

### constructor

\+ **new Space**(`props`: [SpaceProps](../interfaces/spaceprops.md)): _[Space](space.md)_

_Defined in [src/Space.tsx:130](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L130)_

**Parameters:**

| Name    | Type                                      |
| ------- | ----------------------------------------- |
| `props` | [SpaceProps](../interfaces/spaceprops.md) |

**Returns:** _[Space](space.md)_

## Properties

### `Private` constantStyles

• **constantStyles**: _string_ = `
.\${this.rootDivUniqueClassName} {
position: absolute;
top: 0; bottom: 0; left: 0; right: 0;
cursor: default;
}

.\${this.rootDivUniqueClassName} > .react-zoomable-ui-inner-div {
margin: 0; padding: 0;
transform-origin: 0% 0%;
min-height: 100%;
width: 100%;
}
`

_Defined in [src/Space.tsx:111](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L111)_

---

### `Private` `Optional` currentHoveredPressable

• **currentHoveredPressable**? : _[Pressable](pressable.md)_

_Defined in [src/Space.tsx:127](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L127)_

---

### `Private` elementSizeChangePoller

• **elementSizeChangePoller**: _[ElementSizeChangePoller](elementsizechangepoller.md)_

_Defined in [src/Space.tsx:128](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L128)_

---

### `Private` interactableRegistry

• **interactableRegistry**: _Map‹string, [InteractableComponent](../globals.md#interactablecomponent)›_

_Defined in [src/Space.tsx:129](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L129)_

---

### `Private` `Optional` outerDivRef

• **outerDivRef**? : _HTMLDivElement_

_Defined in [src/Space.tsx:126](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L126)_

---

### `Private` pressInterpreter

• **pressInterpreter**: _[PressInterpreter](pressinterpreter.md)_

_Defined in [src/Space.tsx:130](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L130)_

---

### `Private` rootDivUniqueClassName

• **rootDivUniqueClassName**: _string_ = `react-zoomable-ui-${generateRandomId()}`

_Defined in [src/Space.tsx:109](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L109)_

---

### `Optional` viewPort

• **viewPort**? : _[ViewPort](viewport.md)_

_Defined in [src/Space.tsx:107](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L107)_

Describes what portion of the virtual coordinate space is visible inside
the `Space`, and, among other things, provides access to the
[ViewPortCamera](viewportcamera.md) which can change that.

This is not created until after the component has been mounted, so use the
[onCreate](../interfaces/spaceprops.md#optional-oncreate) prop if you need to manipulate it before the children of the
`Space` are first rendered. The [[onUpdate]] prop can be used to listen
for changes.

## Methods

### `Optional` UNSAFE_componentWillMount

▸ **UNSAFE_componentWillMount**(): _void_

_Inherited from [NoPanArea](nopanarea.md).[UNSAFE_componentWillMount](nopanarea.md#optional-unsafe_componentwillmount)_

Defined in node_modules/@types/react/index.d.ts:658

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Returns:** _void_

---

### `Optional` UNSAFE_componentWillReceiveProps

▸ **UNSAFE_componentWillReceiveProps**(`nextProps`: Readonly‹[SpaceProps](../interfaces/spaceprops.md)›, `nextContext`: any): _void_

_Inherited from [NoPanArea](nopanarea.md).[UNSAFE_componentWillReceiveProps](nopanarea.md#optional-unsafe_componentwillreceiveprops)_

Defined in node_modules/@types/react/index.d.ts:690

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Parameters:**

| Name          | Type                                                |
| ------------- | --------------------------------------------------- |
| `nextProps`   | Readonly‹[SpaceProps](../interfaces/spaceprops.md)› |
| `nextContext` | any                                                 |

**Returns:** _void_

---

### `Optional` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(`nextProps`: Readonly‹[SpaceProps](../interfaces/spaceprops.md)›, `nextState`: Readonly‹[SpaceState](../interfaces/spacestate.md)›, `nextContext`: any): _void_

_Inherited from [NoPanArea](nopanarea.md).[UNSAFE_componentWillUpdate](nopanarea.md#optional-unsafe_componentwillupdate)_

Defined in node_modules/@types/react/index.d.ts:718

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Parameters:**

| Name          | Type                                                |
| ------------- | --------------------------------------------------- |
| `nextProps`   | Readonly‹[SpaceProps](../interfaces/spaceprops.md)› |
| `nextState`   | Readonly‹[SpaceState](../interfaces/spacestate.md)› |
| `nextContext` | any                                                 |

**Returns:** _void_

---

### `Optional` componentDidCatch

▸ **componentDidCatch**(`error`: Error, `errorInfo`: ErrorInfo): _void_

_Inherited from [NoPanArea](nopanarea.md).[componentDidCatch](nopanarea.md#optional-componentdidcatch)_

Defined in node_modules/@types/react/index.d.ts:587

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

**Parameters:**

| Name        | Type      |
| ----------- | --------- |
| `error`     | Error     |
| `errorInfo` | ErrorInfo |

**Returns:** _void_

---

### `Optional` componentDidMount

▸ **componentDidMount**(): _void_

_Inherited from [Space](space.md).[componentDidMount](space.md#optional-componentdidmount)_

Defined in node_modules/@types/react/index.d.ts:566

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

**Returns:** _void_

---

### componentDidUpdate

▸ **componentDidUpdate**(`prevProps`: [SpaceProps](../interfaces/spaceprops.md)): _void_

_Overrides [NoPanArea](nopanarea.md).[componentDidUpdate](nopanarea.md#optional-componentdidupdate)_

_Defined in [src/Space.tsx:144](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L144)_

**Parameters:**

| Name        | Type                                      |
| ----------- | ----------------------------------------- |
| `prevProps` | [SpaceProps](../interfaces/spaceprops.md) |

**Returns:** _void_

---

### `Optional` componentWillMount

▸ **componentWillMount**(): _void_

_Inherited from [NoPanArea](nopanarea.md).[componentWillMount](nopanarea.md#optional-componentwillmount)_

Defined in node_modules/@types/react/index.d.ts:644

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Returns:** _void_

---

### `Optional` componentWillReceiveProps

▸ **componentWillReceiveProps**(`nextProps`: Readonly‹[SpaceProps](../interfaces/spaceprops.md)›, `nextContext`: any): _void_

_Inherited from [NoPanArea](nopanarea.md).[componentWillReceiveProps](nopanarea.md#optional-componentwillreceiveprops)_

Defined in node_modules/@types/react/index.d.ts:673

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Parameters:**

| Name          | Type                                                |
| ------------- | --------------------------------------------------- |
| `nextProps`   | Readonly‹[SpaceProps](../interfaces/spaceprops.md)› |
| `nextContext` | any                                                 |

**Returns:** _void_

---

### componentWillUnmount

▸ **componentWillUnmount**(): _void_

_Overrides void_

_Defined in [src/Space.tsx:151](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L151)_

**Returns:** _void_

---

### `Optional` componentWillUpdate

▸ **componentWillUpdate**(`nextProps`: Readonly‹[SpaceProps](../interfaces/spaceprops.md)›, `nextState`: Readonly‹[SpaceState](../interfaces/spacestate.md)›, `nextContext`: any): _void_

_Inherited from [NoPanArea](nopanarea.md).[componentWillUpdate](nopanarea.md#optional-componentwillupdate)_

Defined in node_modules/@types/react/index.d.ts:703

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Parameters:**

| Name          | Type                                                |
| ------------- | --------------------------------------------------- |
| `nextProps`   | Readonly‹[SpaceProps](../interfaces/spaceprops.md)› |
| `nextState`   | Readonly‹[SpaceState](../interfaces/spacestate.md)› |
| `nextContext` | any                                                 |

**Returns:** _void_

---

### `Private` createTransformStyle

▸ **createTransformStyle**(): _undefined | object_

_Defined in [src/Space.tsx:192](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L192)_

**Returns:** _undefined | object_

---

### `Private` destroyViewPort

▸ **destroyViewPort**(): _void_

_Defined in [src/Space.tsx:202](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L202)_

**Returns:** _void_

---

### `Optional` getSnapshotBeforeUpdate

▸ **getSnapshotBeforeUpdate**(`prevProps`: Readonly‹[SpaceProps](../interfaces/spaceprops.md)›, `prevState`: Readonly‹[SpaceState](../interfaces/spacestate.md)›): _SS | null_

_Inherited from [NoPanArea](nopanarea.md).[getSnapshotBeforeUpdate](nopanarea.md#optional-getsnapshotbeforeupdate)_

Defined in node_modules/@types/react/index.d.ts:623

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

**Parameters:**

| Name        | Type                                                |
| ----------- | --------------------------------------------------- |
| `prevProps` | Readonly‹[SpaceProps](../interfaces/spaceprops.md)› |
| `prevState` | Readonly‹[SpaceState](../interfaces/spacestate.md)› |

**Returns:** _SS | null_

---

### `Private` handleDecideHowToHandlePress

▸ **handleDecideHowToHandlePress**(`e`: MouseEvent | TouchEvent, `coordinates`: [PressEventCoordinates](../interfaces/presseventcoordinates.md)): _[PressHandlingOptions](../interfaces/presshandlingoptions.md) | undefined_

_Defined in [src/Space.tsx:240](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L240)_

**Parameters:**

| Name          | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| `e`           | MouseEvent &#124; TouchEvent                                    |
| `coordinates` | [PressEventCoordinates](../interfaces/presseventcoordinates.md) |

**Returns:** _[PressHandlingOptions](../interfaces/presshandlingoptions.md) | undefined_

---

### `Private` handleDragStart

▸ **handleDragStart**(`e`: DragEvent): _void_

_Defined in [src/Space.tsx:215](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L215)_

**Parameters:**

| Name | Type      |
| ---- | --------- |
| `e`  | DragEvent |

**Returns:** _void_

---

### `Private` handleHover

▸ **handleHover**(`e`: MouseEvent, `coordinates`: [PressEventCoordinates](../interfaces/presseventcoordinates.md)): _void_

_Defined in [src/Space.tsx:273](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L273)_

**Parameters:**

| Name          | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| `e`           | MouseEvent                                                      |
| `coordinates` | [PressEventCoordinates](../interfaces/presseventcoordinates.md) |

**Returns:** _void_

---

### `Private` handlePressContextMenu

▸ **handlePressContextMenu**(`e`: MouseEvent, `coordinates`: [PressEventCoordinates](../interfaces/presseventcoordinates.md)): _void_

_Defined in [src/Space.tsx:291](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L291)_

**Parameters:**

| Name          | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| `e`           | MouseEvent                                                      |
| `coordinates` | [PressEventCoordinates](../interfaces/presseventcoordinates.md) |

**Returns:** _void_

---

### `Private` handleViewPortUpdated

▸ **handleViewPortUpdated**(): _void_

_Defined in [src/Space.tsx:321](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L321)_

**Returns:** _void_

---

### render

▸ **render**(): _Element‹›_

_Defined in [src/Space.tsx:155](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L155)_

**Returns:** _Element‹›_

---

### `Private` setOuterDivRefAndCreateViewPort

▸ **setOuterDivRefAndCreateViewPort**(`ref`: any): _void_

_Defined in [src/Space.tsx:328](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L328)_

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `ref` | any  |

**Returns:** _void_

---

### `Optional` shouldComponentUpdate

▸ **shouldComponentUpdate**(`nextProps`: Readonly‹[SpaceProps](../interfaces/spaceprops.md)›, `nextState`: Readonly‹[SpaceState](../interfaces/spacestate.md)›, `nextContext`: any): _boolean_

_Inherited from [NoPanArea](nopanarea.md).[shouldComponentUpdate](nopanarea.md#optional-shouldcomponentupdate)_

Defined in node_modules/@types/react/index.d.ts:577

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate`
and `componentDidUpdate` will not be called.

**Parameters:**

| Name          | Type                                                |
| ------------- | --------------------------------------------------- |
| `nextProps`   | Readonly‹[SpaceProps](../interfaces/spaceprops.md)› |
| `nextState`   | Readonly‹[SpaceState](../interfaces/spacestate.md)› |
| `nextContext` | any                                                 |

**Returns:** _boolean_

---

### updateSize

▸ **updateSize**(): _void_

_Defined in [src/Space.tsx:186](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/Space.tsx#L186)_

This should be called in some cases to tell the `Space` that its parent
element has resized. See the section on [[Sizing]] above for more info.

**Returns:** _void_
