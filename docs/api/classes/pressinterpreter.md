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

**Parameters:**

| Name                       | Type                                                                     |
| -------------------------- | ------------------------------------------------------------------------ |
| `onDecideHowToHandlePress` | [DecidePressHandlingCallback](../globals.md#decidepresshandlingcallback) |

**Returns:** _[PressInterpreter](pressinterpreter.md)_

## Properties

### pressHandlers

• **pressHandlers**: _Pick‹[ViewPortOptions](../interfaces/viewportoptions.md), "onPressStart" | "onPressMove" | "onPressEnd" | "onPressCancel"›_
