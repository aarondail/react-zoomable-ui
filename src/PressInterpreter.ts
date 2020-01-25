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

export type DecidePressHandlingCallback = (
  e: MouseEvent | TouchEvent,
  coordinates: PressEventCoordinates,
) => PressHandlingOptions | undefined;

export interface PressHandlingOptions {
  readonly ignorePressEntirely?: boolean;

  readonly potentialTapBounds?: ClientPixelUnit;
  readonly onPotentialTap?: (coordinates: PressEventCoordinates) => void;
  readonly onTap?: (coordinates: PressEventCoordinates) => void;

  readonly longTapThresholdMs?: number;
  readonly onPotentialLongTap?: (coordinates: PressEventCoordinates) => void;
  readonly onLongTap?: (coordinates: PressEventCoordinates) => void;

  readonly onTapAbandoned?: () => void;

  readonly capturePressThresholdMs?: number;
  readonly onCapturePressStart?: (coordinates: PressEventCoordinates) => void;
  readonly onCapturePressMove?: (coordinates: PressEventCoordinatesWithDeltas) => void;
  readonly onCapturePressEnd?: (coordinates: PressEventCoordinatesWithDeltas) => void;
  readonly onCapturePressCancelled?: () => void;
}

export interface PressInterpreterOptions {
  readonly debugEvents?: boolean;
}

export class PressInterpreter {
  public readonly pressHandlers: Pick<ViewPortOptions, 'onPressStart' | 'onPressMove' | 'onPressEnd' | 'onPressCancel'>;

  private currentConfig?: PressHandlingOptions;
  private currentPressCapturedForHandler?: boolean;
  private currentPressStartingCoordinates?: PressEventCoordinates;
  private currentPressLastCoordinates?: PressEventCoordinates;
  private currentPressLongPressThresholdMet?: boolean;
  private capturePressTimerId?: any;
  private longPressTimerId?: any;

  public constructor(
    private readonly onDecideHowToHandlePress: DecidePressHandlingCallback,
    private readonly options?: PressInterpreterOptions,
  ) {
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
  ): 'CAPTURE' | 'IGNORE' | undefined => {
    if (this.options?.debugEvents) {
      console.log(`PressInterpreter:handlePressStart`);
    }
    if (this.currentConfig) {
      this.reset();
    }

    this.currentConfig = this.onDecideHowToHandlePress(e, coordinates);
    if (this.currentConfig) {
      this.currentPressStartingCoordinates = coordinates;
      this.currentPressLastCoordinates = coordinates;
      this.currentPressLongPressThresholdMet = false;

      if (this.currentConfig.ignorePressEntirely) {
        return 'IGNORE';
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
      return 'CAPTURE';
    }
    return undefined;
  };

  private handlePressMove = (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates): 'RELEASE' | undefined => {
    if (this.options?.debugEvents) {
      console.log(`PressInterpreter:handlePressMove`);
    }
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
      return 'RELEASE';
    }

    return undefined;
  };

  private handlePressEnd = (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates) => {
    if (this.options?.debugEvents) {
      console.log(`PressInterpreter:handlePressEnd`);
    }
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
    if (this.options?.debugEvents) {
      console.log(`PressInterpreter:handlePressCancelled`);
    }
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
