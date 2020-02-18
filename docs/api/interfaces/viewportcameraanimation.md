[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [ViewPortCameraAnimation](viewportcameraanimation.md)

# Interface: ViewPortCameraAnimation

## Hierarchy

- [ViewPortCameraAnimationOptions](viewportcameraanimationoptions.md)

  ↳ **ViewPortCameraAnimation**

## Index

### Properties

- [durationMilliseconds](viewportcameraanimation.md#durationmilliseconds)
- [preventInterruption](viewportcameraanimation.md#optional-preventinterruption)
- [startingTimeMilliseconds](viewportcameraanimation.md#optional-startingtimemilliseconds)
- [startingValues](viewportcameraanimation.md#startingvalues)
- [targetValues](viewportcameraanimation.md#targetvalues)

## Properties

### durationMilliseconds

• **durationMilliseconds**: _number_

_Inherited from [ViewPortCameraAnimationOptions](viewportcameraanimationoptions.md).[durationMilliseconds](viewportcameraanimationoptions.md#durationmilliseconds)_

_Defined in [src/ViewPortCamera.ts:26](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortCamera.ts#L26)_

---

### `Optional` preventInterruption

• **preventInterruption**? : _undefined | false | true_

_Inherited from [ViewPortCameraAnimationOptions](viewportcameraanimationoptions.md).[preventInterruption](viewportcameraanimationoptions.md#optional-preventinterruption)_

_Defined in [src/ViewPortCamera.ts:32](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortCamera.ts#L32)_

Note that if the container size changes or `setBounds` is called, it will
still interrupt the animation. But instead of cancelling it, it will jump
to the end.

---

### `Optional` startingTimeMilliseconds

• **startingTimeMilliseconds**? : _undefined | number_

_Defined in [src/ViewPortCamera.ts:39](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortCamera.ts#L39)_

---

### startingValues

• **startingValues**: _[ViewPortCameraValues](viewportcameravalues.md)_

_Defined in [src/ViewPortCamera.ts:40](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortCamera.ts#L40)_

---

### targetValues

• **targetValues**: _[ViewPortCameraValues](viewportcameravalues.md)_

_Defined in [src/ViewPortCamera.ts:41](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortCamera.ts#L41)_
