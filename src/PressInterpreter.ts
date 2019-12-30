import { ClientPixelUnit, ViewPortOptions } from './ViewPort';

export type DecidePressConfigCallback = (
  e: MouseEvent | TouchEvent,
  x: ClientPixelUnit,
  y: ClientPixelUnit,
) => PressHandlingConfig | undefined;

export interface PressHandlingConfig {
  readonly ignorePressEntirely?: boolean;

  readonly potentialTapBounds?: ClientPixelUnit;
  readonly onTap?: () => void;

  readonly longTapThresholdMs?: number;
  readonly onLongTap?: () => void;

  readonly capturePressThresholdMs?: number;
  readonly onCapturePressStart?: () => void;
  readonly onCapturePressMove?: () => void;
  readonly onCapturePressEnd?: () => void;
}

export class PressInterpreter {
  public readonly pressHandlers: Pick<ViewPortOptions, 'onPressStart' | 'onPressMove' | 'onPressEnd'>;

  private currentConfig?: PressHandlingConfig;

  public constructor(private readonly onDecideHowToHandlePress: DecidePressConfigCallback) {
    this.pressHandlers = {
      onPressStart: this.handlePressStart,
      onPressMove: this.handlePressMove,
      onPressEnd: this.handlePressEnd,
    };
  }

  private handlePressStart = (
    e: MouseEvent | TouchEvent,
    x: ClientPixelUnit,
    y: ClientPixelUnit,
  ): 'CAPTURE' | undefined => {
    if (this.currentConfig) {
      this.reset();
    }
    this.currentConfig = this.onDecideHowToHandlePress(e, x, y);
    if (this.currentConfig) {
      return 'CAPTURE';
    }
    return undefined;
  };

  private handlePressMove = (
    e: MouseEvent | TouchEvent,
    x: ClientPixelUnit,
    y: ClientPixelUnit,
  ): 'RELEASE' | undefined => {
    if (!this.currentConfig || this.currentConfig.ignorePressEntirely) {
      return undefined;
    }
    return undefined;
  };

  private handlePressEnd = (e: MouseEvent | TouchEvent, x: ClientPixelUnit, y: ClientPixelUnit) => {
    if (!this.currentConfig || this.currentConfig.ignorePressEntirely) {
      return;
    }
  };

  private reset = () => {
    this.currentConfig = undefined;
  };
}
