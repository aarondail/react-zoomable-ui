[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [Pressable](pressable.md)

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

## Index

### Properties

- [context](pressable.md#context)
- [divRef](pressable.md#divref)
- [id](pressable.md#id)
- [contextType](pressable.md#static-contexttype)

### Methods

- [UNSAFE_componentWillMount](pressable.md#optional-unsafe_componentwillmount)
- [UNSAFE_componentWillReceiveProps](pressable.md#optional-unsafe_componentwillreceiveprops)
- [UNSAFE_componentWillUpdate](pressable.md#optional-unsafe_componentwillupdate)
- [componentDidCatch](pressable.md#optional-componentdidcatch)
- [componentDidMount](pressable.md#componentdidmount)
- [componentDidUpdate](pressable.md#optional-componentdidupdate)
- [componentWillMount](pressable.md#optional-componentwillmount)
- [componentWillReceiveProps](pressable.md#optional-componentwillreceiveprops)
- [componentWillUnmount](pressable.md#componentwillunmount)
- [componentWillUpdate](pressable.md#optional-componentwillupdate)
- [getPressHandlingConfig](pressable.md#getpresshandlingconfig)
- [getSnapshotBeforeUpdate](pressable.md#optional-getsnapshotbeforeupdate)
- [render](pressable.md#render)
- [setHovered](pressable.md#sethovered)
- [shouldComponentUpdate](pressable.md#optional-shouldcomponentupdate)

### Object literals

- [state](pressable.md#state)

## Properties

### context

• **context**: _[SpaceContextType](../interfaces/spacecontexttype.md)_

_Defined in [src/Pressable.tsx:83](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L83)_

---

### divRef

• **divRef**: _RefObject‹HTMLDivElement›_ = React.createRef()

_Defined in [src/Pressable.tsx:84](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L84)_

---

### id

• **id**: _string_ = generateRandomId()

_Defined in [src/Pressable.tsx:85](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L85)_

---

### `Static` contextType

▪ **contextType**: _Context‹[SpaceContextType](../interfaces/spacecontexttype.md)›_ = SpaceContext

_Defined in [src/Pressable.tsx:82](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L82)_

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

▸ **UNSAFE_componentWillReceiveProps**(`nextProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `nextContext`: any): _void_

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

| Name          | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `nextProps`   | Readonly‹[PressableProps](../interfaces/pressableprops.md)› |
| `nextContext` | any                                                         |

**Returns:** _void_

---

### `Optional` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(`nextProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `nextState`: Readonly‹[PressableState](../interfaces/pressablestate.md)›, `nextContext`: any): _void_

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

### componentDidMount

▸ **componentDidMount**(): _void_

_Overrides [Space](space.md).[componentDidMount](space.md#optional-componentdidmount)_

_Defined in [src/Pressable.tsx:90](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L90)_

**Returns:** _void_

---

### `Optional` componentDidUpdate

▸ **componentDidUpdate**(`prevProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `prevState`: Readonly‹[PressableState](../interfaces/pressablestate.md)›, `snapshot?`: SS): _void_

_Inherited from [NoPanArea](nopanarea.md).[componentDidUpdate](nopanarea.md#optional-componentdidupdate)_

Defined in node_modules/@types/react/index.d.ts:629

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

▸ **componentWillReceiveProps**(`nextProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `nextContext`: any): _void_

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

| Name          | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `nextProps`   | Readonly‹[PressableProps](../interfaces/pressableprops.md)› |
| `nextContext` | any                                                         |

**Returns:** _void_

---

### componentWillUnmount

▸ **componentWillUnmount**(): _void_

_Overrides void_

_Defined in [src/Pressable.tsx:94](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L94)_

**Returns:** _void_

---

### `Optional` componentWillUpdate

▸ **componentWillUpdate**(`nextProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `nextState`: Readonly‹[PressableState](../interfaces/pressablestate.md)›, `nextContext`: any): _void_

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

| Name          | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `nextProps`   | Readonly‹[PressableProps](../interfaces/pressableprops.md)› |
| `nextState`   | Readonly‹[PressableState](../interfaces/pressablestate.md)› |
| `nextContext` | any                                                         |

**Returns:** _void_

---

### getPressHandlingConfig

▸ **getPressHandlingConfig**(): _[PressHandlingOptions](../interfaces/presshandlingoptions.md) | undefined_

_Defined in [src/Pressable.tsx:98](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L98)_

**Returns:** _[PressHandlingOptions](../interfaces/presshandlingoptions.md) | undefined_

---

### `Optional` getSnapshotBeforeUpdate

▸ **getSnapshotBeforeUpdate**(`prevProps`: Readonly‹[PressableProps](../interfaces/pressableprops.md)›, `prevState`: Readonly‹[PressableState](../interfaces/pressablestate.md)›): _SS | null_

_Inherited from [NoPanArea](nopanarea.md).[getSnapshotBeforeUpdate](nopanarea.md#optional-getsnapshotbeforeupdate)_

Defined in node_modules/@types/react/index.d.ts:623

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

_Defined in [src/Pressable.tsx:120](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L120)_

**Returns:** _Element‹›_

---

### setHovered

▸ **setHovered**(`hovered`: boolean): _void_

_Defined in [src/Pressable.tsx:138](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L138)_

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

Defined in node_modules/@types/react/index.d.ts:577

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

_Defined in [src/Pressable.tsx:86](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L86)_

### hovered

• **hovered**: _false_ = false

_Defined in [src/Pressable.tsx:86](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L86)_

### interaction

• **interaction**: _undefined_ = undefined

_Defined in [src/Pressable.tsx:86](https://github.com/aarondail/react-zoomable-ui/blob/d840303/src/Pressable.tsx#L86)_
