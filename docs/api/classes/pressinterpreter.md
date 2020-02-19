# Class: PressInterpreter

If you are using [Space](space.md) then you don't need to use or interact directly with this class. It is used
internally by [Space](space.md) along with [Pressable](pressable.md) to interpret and respond to press gestures.

On the other hand if you are using [ViewPort](viewport.md) without [Space](space.md) you may want to use this to
make handling gestures easier.

It works by calling a [DecidePressHandlingCallback](../globals.md#decidepresshandlingcallback) callback whenever a
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

\+ **new PressInterpreter**(`onDecideHowToHandlePress`: [DecidePressHandlingCallback](../globals.md#decidepresshandlingcallback)): _[PressInterpreter](pressinterpreter.md)_

If you are using a [Space](space.md) you do not need to create one of these, but
if you aren't using a [Space](space.md) this should be done before the
[ViewPort](viewport.md) is created, and then the [pressHandlers](pressinterpreter.md#presshandlers) should be passed
to the [ViewPort](viewport.md)'s [ViewPortOptions](../interfaces/viewportoptions.md).

**Parameters:**

| Name                       | Type                                                                     | Description                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `onDecideHowToHandlePress` | [DecidePressHandlingCallback](../globals.md#decidepresshandlingcallback) | This callback decides how to handle presses. See [DecidePressHandlingCallback](../globals.md#decidepresshandlingcallback) for more info. |

**Returns:** _[PressInterpreter](pressinterpreter.md)_

## Properties

### pressHandlers

• **pressHandlers**: _Pick‹[ViewPortOptions](../interfaces/viewportoptions.md), "onPressStart" | "onPressMove" | "onPressEnd" | "onPressCancel"›_

Pass this to the [ViewPort](viewport.md) as part of its [ViewPortOptions](../interfaces/viewportoptions.md).
