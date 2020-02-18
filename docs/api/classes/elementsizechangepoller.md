# Class: ElementSizeChangePoller

This class simply takes an element, records its size, and then polls it for
size changes every 500 ms. If a size change is detected the onSizeChanged
callback is called.

## Hierarchy

- **ElementSizeChangePoller**

## Constructors

### constructor

\+ **new ElementSizeChangePoller**(`onSizeChanged`: function): _[ElementSizeChangePoller](elementsizechangepoller.md)_

Constructs a new instance, but initially it won't know which element to
watch. You have to call [update](elementsizechangepoller.md#update) to pass it the element.

**Parameters:**

▪ **onSizeChanged**: _function_

Callback to call when a watched element's size changes.

▸ (): _void_

**Returns:** _[ElementSizeChangePoller](elementsizechangepoller.md)_

## Methods

### reset

▸ **reset**(): _void_

Stops polling and clears the element that was being watched.

**Returns:** _void_

---

### update

▸ **update**(`element`: HTMLDivElement | undefined, `polling`: boolean): _void_

Changes the element being watched and starts or stops polling for size
changes.

**Parameters:**

| Name      | Type                            |
| --------- | ------------------------------- |
| `element` | HTMLDivElement &#124; undefined |
| `polling` | boolean                         |

**Returns:** _void_
