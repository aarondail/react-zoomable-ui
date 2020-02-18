[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [ElementSizeChangePoller](elementsizechangepoller.md)

# Class: ElementSizeChangePoller

This class simply takes an element, records its size, and then polls it for
size changes every 500 ms. If a size change is detected the onSizeChanged
callback is called.

## Hierarchy

- **ElementSizeChangePoller**

## Index

### Constructors

- [constructor](elementsizechangepoller.md#constructor)

### Properties

- [element](elementsizechangepoller.md#private-optional-element)
- [oldSize](elementsizechangepoller.md#private-optional-oldsize)
- [onSizeChanged](elementsizechangepoller.md#private-onsizechanged)
- [polling](elementsizechangepoller.md#private-polling)
- [timerId](elementsizechangepoller.md#private-optional-timerid)

### Methods

- [reset](elementsizechangepoller.md#reset)
- [start](elementsizechangepoller.md#private-start)
- [stop](elementsizechangepoller.md#private-stop)
- [update](elementsizechangepoller.md#update)

## Constructors

### constructor

\+ **new ElementSizeChangePoller**(`onSizeChanged`: function): _[ElementSizeChangePoller](elementsizechangepoller.md)_

_Defined in [src/ElementSizeChangePoller.ts:12](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ElementSizeChangePoller.ts#L12)_

Constructs a new instance, but initially it won't know which element to
watch. You have to call [update](elementsizechangepoller.md#update) to pass it the element.

**Parameters:**

▪ **onSizeChanged**: _function_

Callback to call when a watched element's size changes.

▸ (): _void_

**Returns:** _[ElementSizeChangePoller](elementsizechangepoller.md)_

## Properties

### `Private` `Optional` element

• **element**? : _HTMLDivElement_

_Defined in [src/ElementSizeChangePoller.ts:9](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ElementSizeChangePoller.ts#L9)_

---

### `Private` `Optional` oldSize

• **oldSize**? : _ClientRect_

_Defined in [src/ElementSizeChangePoller.ts:12](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ElementSizeChangePoller.ts#L12)_

---

### `Private` onSizeChanged

• **onSizeChanged**: _function_

_Defined in [src/ElementSizeChangePoller.ts:20](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ElementSizeChangePoller.ts#L20)_

Callback to call when a watched element's size changes.

#### Type declaration:

▸ (): _void_

---

### `Private` polling

• **polling**: _boolean_

_Defined in [src/ElementSizeChangePoller.ts:11](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ElementSizeChangePoller.ts#L11)_

---

### `Private` `Optional` timerId

• **timerId**? : _any_

_Defined in [src/ElementSizeChangePoller.ts:10](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ElementSizeChangePoller.ts#L10)_

## Methods

### reset

▸ **reset**(): _void_

_Defined in [src/ElementSizeChangePoller.ts:27](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ElementSizeChangePoller.ts#L27)_

Stops polling and clears the element that was being watched.

**Returns:** _void_

---

### `Private` start

▸ **start**(): _void_

_Defined in [src/ElementSizeChangePoller.ts:45](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ElementSizeChangePoller.ts#L45)_

**Returns:** _void_

---

### `Private` stop

▸ **stop**(): _void_

_Defined in [src/ElementSizeChangePoller.ts:62](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ElementSizeChangePoller.ts#L62)_

**Returns:** _void_

---

### update

▸ **update**(`element`: HTMLDivElement | undefined, `polling`: boolean): _void_

_Defined in [src/ElementSizeChangePoller.ts:35](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ElementSizeChangePoller.ts#L35)_

Changes the element being watched and starts or stops polling for size
changes.

**Parameters:**

| Name      | Type                            |
| --------- | ------------------------------- |
| `element` | HTMLDivElement &#124; undefined |
| `polling` | boolean                         |

**Returns:** _void_
