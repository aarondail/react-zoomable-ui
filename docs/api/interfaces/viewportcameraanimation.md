# Interface: ViewPortCameraAnimation

## Hierarchy

- [ViewPortCameraAnimationOptions](viewportcameraanimationoptions.md)

  ↳ **ViewPortCameraAnimation**

## Properties

### durationMilliseconds

• **durationMilliseconds**: _number_

_Inherited from [ViewPortCameraAnimationOptions](viewportcameraanimationoptions.md).[durationMilliseconds](viewportcameraanimationoptions.md#durationmilliseconds)_

---

### `Optional` preventInterruption

• **preventInterruption**? : _undefined | false | true_

_Inherited from [ViewPortCameraAnimationOptions](viewportcameraanimationoptions.md).[preventInterruption](viewportcameraanimationoptions.md#optional-preventinterruption)_

Note that if the container size changes or `setBounds` is called, it will
still interrupt the animation. But instead of cancelling it, it will jump
to the end.

---

### `Optional` startingTimeMilliseconds

• **startingTimeMilliseconds**? : _undefined | number_

---

### startingValues

• **startingValues**: _[ViewPortCameraValues](viewportcameravalues.md)_

---

### targetValues

• **targetValues**: _[ViewPortCameraValues](viewportcameravalues.md)_
