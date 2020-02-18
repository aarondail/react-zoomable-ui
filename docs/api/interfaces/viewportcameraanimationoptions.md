[react-zoomable-ui](../README.md) › [Globals](../globals.md) › [ViewPortCameraAnimationOptions](viewportcameraanimationoptions.md)

# Interface: ViewPortCameraAnimationOptions

## Hierarchy

- **ViewPortCameraAnimationOptions**

  ↳ [ViewPortCameraAnimation](viewportcameraanimation.md)

## Index

### Properties

- [durationMilliseconds](viewportcameraanimationoptions.md#durationmilliseconds)
- [preventInterruption](viewportcameraanimationoptions.md#optional-preventinterruption)

## Properties

### durationMilliseconds

• **durationMilliseconds**: _number_

_Defined in [src/ViewPortCamera.ts:26](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortCamera.ts#L26)_

---

### `Optional` preventInterruption

• **preventInterruption**? : _undefined | false | true_

_Defined in [src/ViewPortCamera.ts:32](https://github.com/aarondail/react-zoomable-ui/blob/d41a716/src/ViewPortCamera.ts#L32)_

Note that if the container size changes or `setBounds` is called, it will
still interrupt the animation. But instead of cancelling it, it will jump
to the end.
