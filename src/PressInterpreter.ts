import { ClientPixelUnit, PressEventCoordinates, ViewPortOptions } from './ViewPort';

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

  // readonly capturePressThresholdMs?: number;
  // readonly onCapturePressStart?: (coordinates: PressEventCoordinates) => void;
  // readonly onCapturePressMove?: (coordinates: PressEventCoordinates) => void;
  // readonly onCapturePressEnd?: (coordinates: PressEventCoordinates) => void;
  // readonly onCapturePressCancelled?: () => void;
}

export interface PressInterpreterOptions {
  readonly debugEvents?: boolean;
}

export class PressInterpreter {
  public readonly pressHandlers: Pick<ViewPortOptions, 'onPressStart' | 'onPressMove' | 'onPressEnd' | 'onPressCancel'>;

  private currentConfig?: PressHandlingOptions;
  private currentPressStartingCoordinates?: PressEventCoordinates;
  private currentPressLastCoordinates?: PressEventCoordinates;
  private currentPressLongPressThresholdMet?: boolean;
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

  private handleLongPressThresholdMet = () => {
    this.longPressTimerId = undefined;
    this.currentPressLongPressThresholdMet = true;
    if (this.currentPressLastCoordinates) {
      this.currentConfig?.onPotentialLongTap?.(this.currentPressLastCoordinates);
    }
  };

  private handlePressStart = (
    e: MouseEvent | TouchEvent,
    coordinates: PressEventCoordinates,
  ): 'CAPTURE' | undefined => {
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
      if (this.currentConfig.onTap && this.currentConfig.onPotentialTap) {
        this.currentConfig.onPotentialTap(coordinates);
      }
      if (this.currentConfig.longTapThresholdMs !== undefined) {
        this.longPressTimerId = setTimeout(this.handleLongPressThresholdMet, this.currentConfig.longTapThresholdMs);
      }
      return 'CAPTURE';
    }
    return undefined;
  };

  private handlePressMove = (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates): 'RELEASE' | undefined => {
    if (this.options?.debugEvents) {
      console.log(`PressInterpreter:handlePressMove`);
    }
    if (!this.currentConfig || this.currentConfig.ignorePressEntirely || !this.currentPressStartingCoordinates) {
      return undefined;
    }

    this.currentPressLastCoordinates = coordinates;

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

    if (this.currentPressLongPressThresholdMet) {
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
    this.currentConfig?.onTapAbandoned?.();
    this.reset();
  };

  private reset = () => {
    this.currentConfig = undefined;
    this.currentPressStartingCoordinates = undefined;
    this.currentPressLastCoordinates = undefined;
    this.currentPressLongPressThresholdMet = undefined;
    if (this.longPressTimerId) {
      clearTimeout(this.longPressTimerId);
      this.longPressTimerId = undefined;
    }
  };
}
