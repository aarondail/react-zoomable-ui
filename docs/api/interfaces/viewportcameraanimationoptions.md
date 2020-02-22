# Interface: ViewPortCameraAnimationOptions

## Hierarchy

- **ViewPortCameraAnimationOptions**

## Index

### Properties

- [durationMilliseconds](viewportcameraanimationoptions.md#durationmilliseconds)
- [preventInterruption](viewportcameraanimationoptions.md#optional-preventinterruption)

## Properties

### durationMilliseconds

• **durationMilliseconds**: _number_

---

### `Optional` preventInterruption

• **preventInterruption**? : _undefined | false &#124; true_

Note that if the container size changes or `setBounds` is called, it will
still interrupt the animation. But instead of cancelling it, it will jump
to the end.
