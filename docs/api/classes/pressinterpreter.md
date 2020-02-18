[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [PressInterpreter](pressinterpreter.md)

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

- [capturePressTimerId](pressinterpreter.md#private-optional-capturepresstimerid)
- [currentConfig](pressinterpreter.md#private-optional-currentconfig)
- [currentPressCapturedForHandler](pressinterpreter.md#private-optional-currentpresscapturedforhandler)
- [currentPressLastCoordinates](pressinterpreter.md#private-optional-currentpresslastcoordinates)
- [currentPressLongPressThresholdMet](pressinterpreter.md#private-optional-currentpresslongpressthresholdmet)
- [currentPressStartingCoordinates](pressinterpreter.md#private-optional-currentpressstartingcoordinates)
- [longPressTimerId](pressinterpreter.md#private-optional-longpresstimerid)
- [onDecideHowToHandlePress](pressinterpreter.md#private-ondecidehowtohandlepress)
- [pressHandlers](pressinterpreter.md#presshandlers)

### Methods

- [handleCapturePressThresholdMet](pressinterpreter.md#private-handlecapturepressthresholdmet)
- [handleLongPressThresholdMet](pressinterpreter.md#private-handlelongpressthresholdmet)
- [handlePressCancel](pressinterpreter.md#private-handlepresscancel)
- [handlePressEnd](pressinterpreter.md#private-handlepressend)
- [handlePressMove](pressinterpreter.md#private-handlepressmove)
- [handlePressStart](pressinterpreter.md#private-handlepressstart)
- [reset](pressinterpreter.md#private-reset)

## Constructors

### constructor

\+ **new PressInterpreter**(`onDecideHowToHandlePress`: [DecidePressHandlingCallback](../globals.md#decidepresshandlingcallback)): _[PressInterpreter](pressinterpreter.md)_

_Defined in [src/PressInterpreter.ts:93](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L93)_

**Parameters:**

| Name                       | Type                                                                     |
| -------------------------- | ------------------------------------------------------------------------ |
| `onDecideHowToHandlePress` | [DecidePressHandlingCallback](../globals.md#decidepresshandlingcallback) |

**Returns:** _[PressInterpreter](pressinterpreter.md)_

## Properties

### `Private` `Optional` capturePressTimerId

• **capturePressTimerId**? : _any_

_Defined in [src/PressInterpreter.ts:92](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L92)_

---

### `Private` `Optional` currentConfig

• **currentConfig**? : _[PressHandlingOptions](../interfaces/presshandlingoptions.md)_

_Defined in [src/PressInterpreter.ts:87](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L87)_

---

### `Private` `Optional` currentPressCapturedForHandler

• **currentPressCapturedForHandler**? : _undefined | false | true_

_Defined in [src/PressInterpreter.ts:88](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L88)_

---

### `Private` `Optional` currentPressLastCoordinates

• **currentPressLastCoordinates**? : _[PressEventCoordinates](../interfaces/presseventcoordinates.md)_

_Defined in [src/PressInterpreter.ts:90](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L90)_

---

### `Private` `Optional` currentPressLongPressThresholdMet

• **currentPressLongPressThresholdMet**? : _undefined | false | true_

_Defined in [src/PressInterpreter.ts:91](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L91)_

---

### `Private` `Optional` currentPressStartingCoordinates

• **currentPressStartingCoordinates**? : _[PressEventCoordinates](../interfaces/presseventcoordinates.md)_

_Defined in [src/PressInterpreter.ts:89](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L89)_

---

### `Private` `Optional` longPressTimerId

• **longPressTimerId**? : _any_

_Defined in [src/PressInterpreter.ts:93](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L93)_

---

### `Private` onDecideHowToHandlePress

• **onDecideHowToHandlePress**: _[DecidePressHandlingCallback](../globals.md#decidepresshandlingcallback)_

_Defined in [src/PressInterpreter.ts:95](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L95)_

---

### pressHandlers

• **pressHandlers**: _Pick‹[ViewPortOptions](../interfaces/viewportoptions.md), "onPressStart" | "onPressMove" | "onPressEnd" | "onPressCancel"›_

_Defined in [src/PressInterpreter.ts:85](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L85)_

## Methods

### `Private` handleCapturePressThresholdMet

▸ **handleCapturePressThresholdMet**(): _void_

_Defined in [src/PressInterpreter.ts:104](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L104)_

**Returns:** _void_

---

### `Private` handleLongPressThresholdMet

▸ **handleLongPressThresholdMet**(): _void_

_Defined in [src/PressInterpreter.ts:118](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L118)_

**Returns:** _void_

---

### `Private` handlePressCancel

▸ **handlePressCancel**(`e`: MouseEvent | TouchEvent): _void_

_Defined in [src/PressInterpreter.ts:232](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L232)_

**Parameters:**

| Name | Type                         |
| ---- | ---------------------------- |
| `e`  | MouseEvent &#124; TouchEvent |

**Returns:** _void_

---

### `Private` handlePressEnd

▸ **handlePressEnd**(`e`: MouseEvent | TouchEvent, `coordinates`: [PressEventCoordinates](../interfaces/presseventcoordinates.md)): _void_

_Defined in [src/PressInterpreter.ts:204](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L204)_

**Parameters:**

| Name          | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| `e`           | MouseEvent &#124; TouchEvent                                    |
| `coordinates` | [PressEventCoordinates](../interfaces/presseventcoordinates.md) |

**Returns:** _void_

---

### `Private` handlePressMove

▸ **handlePressMove**(`e`: MouseEvent | TouchEvent, `coordinates`: [PressEventCoordinates](../interfaces/presseventcoordinates.md)): _"release" | undefined_

_Defined in [src/PressInterpreter.ts:165](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L165)_

**Parameters:**

| Name          | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| `e`           | MouseEvent &#124; TouchEvent                                    |
| `coordinates` | [PressEventCoordinates](../interfaces/presseventcoordinates.md) |

**Returns:** _"release" | undefined_

---

### `Private` handlePressStart

▸ **handlePressStart**(`e`: MouseEvent | TouchEvent, `coordinates`: [PressEventCoordinates](../interfaces/presseventcoordinates.md)): _"capture" | "ignore" | undefined_

_Defined in [src/PressInterpreter.ts:125](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L125)_

**Parameters:**

| Name          | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| `e`           | MouseEvent &#124; TouchEvent                                    |
| `coordinates` | [PressEventCoordinates](../interfaces/presseventcoordinates.md) |

**Returns:** _"capture" | "ignore" | undefined_

---

### `Private` reset

▸ **reset**(): _void_

_Defined in [src/PressInterpreter.ts:241](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/PressInterpreter.ts#L241)_

**Returns:** _void_
