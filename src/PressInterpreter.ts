import invariant from 'ts-invariant';

import { ClientPixelUnit, PressEventCoordinates, ViewPortOptions, VirtualSpacePixelUnit } from './ViewPort';

export interface PressEventCoordinatesWithDeltas extends PressEventCoordinates {
  readonly clientXDelta: ClientPixelUnit;
  readonly clientYDelta: ClientPixelUnit;
  readonly containerXDelta: ClientPixelUnit;
  readonly containerYDelta: ClientPixelUnit;
  readonly xDelta: VirtualSpacePixelUnit;
  readonly yDelta: VirtualSpacePixelUnit;
}

/**
 * This is the number of client (screen) pixels that a press can move before it
 * is not considered a tap.
 */
const POTENTIAL_TAP_BOUNDS_DEFAULT: ClientPixelUnit = 8;

/**
 * This type of callback is given to the `PressInterpreter` and takes one of
 * the underlying events that starts a "press" as far as the library is
 * concerned (either a left click mouse down event, or a single finger touch
 * start event), and returns an `PressHandlingOptions` object (or
 * `undefined`) detailing how the `PressInterpreter` should handle the
 * press.
 */
export type DecidePressHandlingCallback = (
  e: MouseEvent | TouchEvent,
  coordinates: PressEventCoordinates,
) => PressHandlingOptions | undefined;

export interface PressHandlingOptions {
  readonly ignorePressEntirely?: boolean;

  /**
   * The area around the initial event in which the pointer can move before the
   * press is interpreted as just a pan. It will not be considered a tap or
   * long tap after the pointer moves outside that area, and it can't be
   * captured.
   */
  readonly potentialTapBounds?: ClientPixelUnit;
  readonly onPotentialTap?: (coordinates: PressEventCoordinates) => void;
  readonly onTap?: (coordinates: PressEventCoordinates) => void;

  /**
   * If a press is released after this threshold, it will be considered a long
   * tap. The default is undefined.
   */
  readonly longTapThresholdMs?: number;
  readonly onPotentialLongTap?: (coordinates: PressEventCoordinates) => void;
  readonly onLongTap?: (coordinates: PressEventCoordinates) => void;

  readonly onTapAbandoned?: () => void;

  /**
   * This is more of an advanced option. If set, this will be the number of
   * milliseconds until the press is captured. Once it is captured, it
   * won't be interpreted as a tap, long tap, or pan, and the `onCapturePress*`
   * props will begin to be called.
   *
   * The default is undefined (so presses won't be captured)
   */
  readonly capturePressThresholdMs?: number;
  readonly onCapturePressStart?: (coordinates: PressEventCoordinates) => void;
  readonly onCapturePressMove?: (coordinates: PressEventCoordinatesWithDeltas) => void;
  readonly onCapturePressEnd?: (coordinates: PressEventCoordinatesWithDeltas) => void;
  readonly onCapturePressCancelled?: () => void;
}

/**
 * If you are using `Space` then you don't need to use or interact directly with this class.  It is used
 * internally by `Space` along with `Pressable` to interpret and respond to presses.
 *
 * On the other hand if you are using `ViewPort` without `Space` you may want to use this to
 * make handling interactions easier.
 *
 * It works by calling a `DecidePressHandlingCallback` callback whenever a
 * press starts, and the callback decides how the press should be handled.
 *
 * After you construct the `PressInterpreter` pass the `pressHandlers` to
 * the `ViewPort`'s constructors (as part of the `options` parameter).
 */
export class PressInterpreter {
  /**
   * Pass this to the `ViewPort` as part of its `ViewPortOptions`.
   */
  public readonly pressHandlers: Pick<ViewPortOptions, 'onPressStart' | 'onPressMove' | 'onPressEnd' | 'onPressCancel'>;

  private currentConfig?: PressHandlingOptions;
  private currentPressCapturedForHandler?: boolean;
  private currentPressStartingCoordinates?: PressEventCoordinates;
  private currentPressLastCoordinates?: PressEventCoordinates;
  private currentPressLongPressThresholdMet?: boolean;
  private capturePressTimerId?: any;
  private longPressTimerId?: any;

  /**
   * If you are using a `Space` you do not need to create one of these, but
   * if you aren't using a `Space` this should be done before the
   * `ViewPort` is created, and then the `pressHandlers` should be passed
   * to the `ViewPort`'s `ViewPortOptions`.
   *
   * @param onDecideHowToHandlePress This callback decides how to handle presses.  See `DecidePressHandlingCallback` for more info.
   */
  public constructor(private readonly onDecideHowToHandlePress: DecidePressHandlingCallback) {
    this.pressHandlers = {
      onPressStart: this.handlePressStart,
      onPressMove: this.handlePressMove,
      onPressEnd: this.handlePressEnd,
      onPressCancel: this.handlePressCancel,
    };
  }

  private handleCapturePressThresholdMet = () => {
    this.capturePressTimerId = undefined;
    this.currentPressCapturedForHandler = true;
    invariant(this.currentPressLastCoordinates !== undefined, `When the timer fires we should have press coordinates.`);
    this.currentConfig?.onCapturePressStart?.(this.currentPressLastCoordinates!);

    // Cancel long press
    this.currentPressLongPressThresholdMet = false;
    if (this.longPressTimerId) {
      clearTimeout(this.longPressTimerId);
      this.longPressTimerId = undefined;
    }
  };

  private handleLongPressThresholdMet = () => {
    this.longPressTimerId = undefined;
    this.currentPressLongPressThresholdMet = true;
    invariant(this.currentPressLastCoordinates !== undefined, `When the timer fires we should have press coordinates.`);
    this.currentConfig?.onPotentialLongTap?.(this.currentPressLastCoordinates!);
  };

  private handlePressStart = (
    e: MouseEvent | TouchEvent,
    coordinates: PressEventCoordinates,
  ): 'capture' | 'ignore' | undefined => {
    if (this.currentConfig) {
      this.reset();
    }

    this.currentConfig = this.onDecideHowToHandlePress(e, coordinates);
    if (this.currentConfig) {
      this.currentPressStartingCoordinates = coordinates;
      this.currentPressLastCoordinates = coordinates;
      this.currentPressLongPressThresholdMet = false;

      if (this.currentConfig.ignorePressEntirely) {
        return 'ignore';
      }

      if (this.currentConfig.capturePressThresholdMs === 0) {
        this.currentConfig.onCapturePressStart?.(coordinates);
        this.currentPressCapturedForHandler = true;
      } else {
        if (this.currentConfig.onTap && this.currentConfig.onPotentialTap) {
          this.currentConfig.onPotentialTap(coordinates);
        }
        if (this.currentConfig.capturePressThresholdMs !== undefined) {
          this.capturePressTimerId = setTimeout(
            this.handleCapturePressThresholdMet,
            this.currentConfig.capturePressThresholdMs,
          );
        }
        if (this.currentConfig.longTapThresholdMs !== undefined) {
          this.longPressTimerId = setTimeout(this.handleLongPressThresholdMet, this.currentConfig.longTapThresholdMs);
        }
      }
      return 'capture';
    }
    return undefined;
  };

  private handlePressMove = (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates): 'release' | undefined => {
    if (
      !this.currentConfig ||
      this.currentConfig.ignorePressEntirely ||
      !this.currentPressStartingCoordinates ||
      !this.currentPressLastCoordinates
    ) {
      return undefined;
    }

    const oldCoordinates = this.currentPressLastCoordinates;
    this.currentPressLastCoordinates = coordinates;

    if (this.currentPressCapturedForHandler) {
      this.currentConfig.onCapturePressMove?.({
        ...coordinates,
        clientXDelta: coordinates.clientX - oldCoordinates.clientX,
        clientYDelta: coordinates.clientY - oldCoordinates.clientY,
        containerXDelta: coordinates.containerX - oldCoordinates.containerX,
        containerYDelta: coordinates.containerY - oldCoordinates.containerY,
        xDelta: coordinates.x - oldCoordinates.x,
        yDelta: coordinates.y - oldCoordinates.y,
      });
      return;
    }

    const xDelta = Math.abs(coordinates.containerX - this.currentPressStartingCoordinates.containerX);
    const yDelta = Math.abs(coordinates.containerY - this.currentPressStartingCoordinates.containerY);

    const maxDeltaAllowed = this.currentConfig.potentialTapBounds ?? POTENTIAL_TAP_BOUNDS_DEFAULT;
    if (xDelta > maxDeltaAllowed || yDelta > maxDeltaAllowed) {
      this.currentConfig.onTapAbandoned?.();
      this.reset();
      return 'release';
    }

    return undefined;
  };

  private handlePressEnd = (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates) => {
    if (!this.currentConfig || this.currentConfig.ignorePressEntirely) {
      this.reset();
      return;
    }

    if (this.currentPressCapturedForHandler) {
      // It should be impossible for this event to fire without another event
      // which sets this
      const oldCoordinates = this.currentPressLastCoordinates!;
      this.currentConfig.onCapturePressEnd?.({
        ...coordinates,
        clientXDelta: coordinates.clientX - oldCoordinates.clientX,
        clientYDelta: coordinates.clientY - oldCoordinates.clientY,
        containerXDelta: coordinates.containerX - oldCoordinates.containerX,
        containerYDelta: coordinates.containerY - oldCoordinates.containerY,
        xDelta: coordinates.x - oldCoordinates.x,
        yDelta: coordinates.y - oldCoordinates.y,
      });
    } else if (this.currentPressLongPressThresholdMet) {
      this.currentConfig.onLongTap?.(coordinates);
    } else {
      this.currentConfig.onTap?.(coordinates);
    }

    this.reset();
  };

  private handlePressCancel = (e: MouseEvent | TouchEvent) => {
    if (this.currentPressCapturedForHandler) {
      this.currentConfig?.onCapturePressCancelled?.();
    } else {
      this.currentConfig?.onTapAbandoned?.();
    }
    this.reset();
  };

  private reset = () => {
    this.currentConfig = undefined;
    this.currentPressStartingCoordinates = undefined;
    this.currentPressLastCoordinates = undefined;
    this.currentPressLongPressThresholdMet = undefined;
    this.currentPressCapturedForHandler = undefined;
    if (this.capturePressTimerId) {
      clearTimeout(this.capturePressTimerId);
      this.capturePressTimerId = undefined;
    }
    if (this.longPressTimerId) {
      clearTimeout(this.longPressTimerId);
      this.longPressTimerId = undefined;
    }
  };
}
