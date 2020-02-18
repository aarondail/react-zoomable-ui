# Class: Pressable <**SS**>

Works like a button element except tapping does not prevent or conflict with
panning. It can also recognize long taps, and can even capture the gesture
entirely if you want to implementing something like dragging.

It does not provide any UI.

Must only be used inside a [Space](space.md).

## Props

See [PressableProps](../interfaces/pressableprops.md).

## Type parameters

▪ **SS**

## Hierarchy

- PureComponent‹[PressableProps](../interfaces/pressableprops.md), [PressableState](../interfaces/pressablestate.md)›

  ↳ **Pressable**

## Properties

### context

• **context**: _[SpaceContextType](../interfaces/spacecontexttype.md)_

---

### divRef

• **divRef**: _RefObject‹HTMLDivElement›_ = React.createRef()

---

### id

• **id**: _string_ = generateRandomId()

---

### `Static` contextType

▪ **contextType**: _Context‹[SpaceContextType](../interfaces/spacecontexttype.md)›_ = SpaceContext

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

▸ **UNSAFE_componentWillReceiveProps**(`nextProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `nextContext`: any): _void_

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

| Name          | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `nextProps`   | Readonly‹[PressableProps](../interfaces/pressableprops.md)› |
| `nextContext` | any                                                         |

**Returns:** _void_

---

### `Optional` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(`nextProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `nextState`: Readonly‹[PressableState](../interfaces/pressablestate.md)›, `nextContext`: any): _void_

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

| Name          | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `nextProps`   | Readonly‹[PressableProps](../interfaces/pressableprops.md)› |
| `nextState`   | Readonly‹[PressableState](../interfaces/pressablestate.md)› |
| `nextContext` | any                                                         |

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

### componentDidMount

▸ **componentDidMount**(): _void_

_Overrides [Space](space.md).[componentDidMount](space.md#optional-componentdidmount)_

**Returns:** _void_

---

### `Optional` componentDidUpdate

▸ **componentDidUpdate**(`prevProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `prevState`: Readonly‹[PressableState](../interfaces/pressablestate.md)›, `snapshot?`: SS): _void_

_Inherited from [NoPanArea](nopanarea.md).[componentDidUpdate](nopanarea.md#optional-componentdidupdate)_

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

**Parameters:**

| Name        | Type                                                        |
| ----------- | ----------------------------------------------------------- |
| `prevProps` | Readonly‹[PressableProps](../interfaces/pressableprops.md)› |
| `prevState` | Readonly‹[PressableState](../interfaces/pressablestate.md)› |
| `snapshot?` | SS                                                          |

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

▸ **componentWillReceiveProps**(`nextProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `nextContext`: any): _void_

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

| Name          | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `nextProps`   | Readonly‹[PressableProps](../interfaces/pressableprops.md)› |
| `nextContext` | any                                                         |

**Returns:** _void_

---

### componentWillUnmount

▸ **componentWillUnmount**(): _void_

_Overrides void_

**Returns:** _void_

---

### `Optional` componentWillUpdate

▸ **componentWillUpdate**(`nextProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `nextState`: Readonly‹[PressableState](../interfaces/pressablestate.md)›, `nextContext`: any): _void_

_Inherited from [NoPanArea](nopanarea.md).[componentWillUpdate](nopanarea.md#optional-componentwillupdate)_

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Parameters:**

| Name          | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `nextProps`   | Readonly‹[PressableProps](../interfaces/pressableprops.md)› |
| `nextState`   | Readonly‹[PressableState](../interfaces/pressablestate.md)› |
| `nextContext` | any                                                         |

**Returns:** _void_

---

### getPressHandlingConfig

▸ **getPressHandlingConfig**(): _[PressHandlingOptions](../interfaces/presshandlingoptions.md) | undefined_

**Returns:** _[PressHandlingOptions](../interfaces/presshandlingoptions.md) | undefined_

---

### `Optional` getSnapshotBeforeUpdate

▸ **getSnapshotBeforeUpdate**(`prevProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `prevState`: Readonly‹[PressableState](../interfaces/pressablestate.md)›): _SS | null_

_Inherited from [NoPanArea](nopanarea.md).[getSnapshotBeforeUpdate](nopanarea.md#optional-getsnapshotbeforeupdate)_

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

**Parameters:**

| Name        | Type                                                        |
| ----------- | ----------------------------------------------------------- |
| `prevProps` | Readonly‹[PressableProps](../interfaces/pressableprops.md)› |
| `prevState` | Readonly‹[PressableState](../interfaces/pressablestate.md)› |

**Returns:** _SS | null_

---

### render

▸ **render**(): _Element‹›_

**Returns:** _Element‹›_

---

### setHovered

▸ **setHovered**(`hovered`: boolean): _void_

Called by the [Space](space.md) to change the hover state.

**Parameters:**

| Name      | Type    |
| --------- | ------- |
| `hovered` | boolean |

**Returns:** _void_

---

### `Optional` shouldComponentUpdate

▸ **shouldComponentUpdate**(`nextProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `nextState`: Readonly‹[PressableState](../interfaces/pressablestate.md)›, `nextContext`: any): _boolean_

_Inherited from [NoPanArea](nopanarea.md).[shouldComponentUpdate](nopanarea.md#optional-shouldcomponentupdate)_

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate`
and `componentDidUpdate` will not be called.

**Parameters:**

| Name          | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `nextProps`   | Readonly‹[PressableProps](../interfaces/pressableprops.md)› |
| `nextState`   | Readonly‹[PressableState](../interfaces/pressablestate.md)› |
| `nextContext` | any                                                         |

**Returns:** _boolean_

## Object literals

### state

### ▪ **state**: _object_

### hovered

• **hovered**: _false_ = false

### interaction

• **interaction**: _undefined_ = undefined
