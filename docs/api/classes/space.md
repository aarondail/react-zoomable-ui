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

## Constructors

### constructor

\+ **new Space**(`props`: [SpaceProps](../interfaces/spaceprops.md)): _[Space](space.md)_

**Parameters:**

| Name    | Type                                      |
| ------- | ----------------------------------------- |
| `props` | [SpaceProps](../interfaces/spaceprops.md) |

**Returns:** _[Space](space.md)_

## Properties

### `Optional` viewPort

• **viewPort**? : _[ViewPort](viewport.md)_

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

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

**Returns:** _void_

---

### componentDidUpdate

▸ **componentDidUpdate**(`prevProps`: [SpaceProps](../interfaces/spaceprops.md)): _void_

_Overrides [NoPanArea](nopanarea.md).[componentDidUpdate](nopanarea.md#optional-componentdidupdate)_

**Parameters:**

| Name        | Type                                      |
| ----------- | ----------------------------------------- |
| `prevProps` | [SpaceProps](../interfaces/spaceprops.md) |

**Returns:** _void_

---

### `Optional` componentWillMount

▸ **componentWillMount**(): _void_

_Inherited from [NoPanArea](nopanarea.md).[componentWillMount](nopanarea.md#optional-componentwillmount)_

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

**Returns:** _void_

---

### `Optional` componentWillUpdate

▸ **componentWillUpdate**(`nextProps`: Readonly‹[SpaceProps](../interfaces/spaceprops.md)›, `nextState`: Readonly‹[SpaceState](../interfaces/spacestate.md)›, `nextContext`: any): _void_

_Inherited from [NoPanArea](nopanarea.md).[componentWillUpdate](nopanarea.md#optional-componentwillupdate)_

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

### `Optional` getSnapshotBeforeUpdate

▸ **getSnapshotBeforeUpdate**(`prevProps`: Readonly‹[SpaceProps](../interfaces/spaceprops.md)›, `prevState`: Readonly‹[SpaceState](../interfaces/spacestate.md)›): _SS | null_

_Inherited from [NoPanArea](nopanarea.md).[getSnapshotBeforeUpdate](nopanarea.md#optional-getsnapshotbeforeupdate)_

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

### render

▸ **render**(): _Element‹›_

**Returns:** _Element‹›_

---

### `Optional` shouldComponentUpdate

▸ **shouldComponentUpdate**(`nextProps`: Readonly‹[SpaceProps](../interfaces/spaceprops.md)›, `nextState`: Readonly‹[SpaceState](../interfaces/spacestate.md)›, `nextContext`: any): _boolean_

_Inherited from [NoPanArea](nopanarea.md).[shouldComponentUpdate](nopanarea.md#optional-shouldcomponentupdate)_

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

This should be called in some cases to tell the `Space` that its parent
element has resized. See the section on [[Sizing]] above for more info.

**Returns:** _void_
