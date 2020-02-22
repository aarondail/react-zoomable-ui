# Class: PressInterpreter

If you are using [Space](space.md) then you don't need to use or interact directly with this class. It is used
internally by [Space](space.md) along with [Pressable](pressable.md) to interpret and respond to press interactions.

On the other hand if you are using [ViewPort](viewport.md) without [Space](space.md) you may want to use this to
make handling interactions easier.

It works by calling a [DecidePressHandlingCallback](../API.md#decidepresshandlingcallback) callback whenever a
press starts, and the callback decides how the press should be handled.

After you construct the [PressInterpreter](pressinterpreter.md) pass the [pressHandlers](pressinterpreter.md#presshandlers) to
the [ViewPort](viewport.md)'s constructors (as part of the `options` parameter).

## Hierarchy

- **PressInterpreter**

## Index

### Constructors

- [constructor](pressinterpreter.md#constructor)

### Properties

- [pressHandlers](pressinterpreter.md#presshandlers)

## Constructors

### constructor

\+ **new PressInterpreter**(`onDecideHowToHandlePress`: [DecidePressHandlingCallback](../API.md#decidepresshandlingcallback)): _[PressInterpreter](pressinterpreter.md)_

**Parameters:**

| Name                       | Type                                                                 | Description                                                                                                                          |
| -------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `onDecideHowToHandlePress` | [DecidePressHandlingCallback](../API.md#decidepresshandlingcallback) | This callback decides how to handle presses. See [DecidePressHandlingCallback](../API.md#decidepresshandlingcallback) for more info. |

**Returns:** _[PressInterpreter](pressinterpreter.md)_

## Properties

### pressHandlers

• **pressHandlers**: _Pick‹[ViewPortOptions](../interfaces/viewportoptions.md), "onPressStart" &#124; "onPressMove" &#124; "onPressEnd" &#124; "onPressCancel"›_

Pass this to the [ViewPort](viewport.md) as part of its [ViewPortOptions](../interfaces/viewportoptions.md).
