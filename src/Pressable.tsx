import * as React from 'react';

import { InteractableIdAttributeName } from './Interactable';
import { PressHandlingConfig } from './PressInterpreter';
import { SpaceContext, SpaceContextType } from './SpaceContext';
import { generateRandomId } from './utils';
import { ClientPixelUnit } from './ViewPort';

const DEFAULT_POTENTIAL_TAP_BOUNDS: ClientPixelUnit = 4;
const DEFAULT_LONG_TAP_THRESHOLD_MS: number = 500;

export interface PressableProps {
  readonly className?: string;
  readonly pressClassName?: string;
  readonly longPressClassName?: string;
  // readonly capturePanClassName?: string;
  // readonly disabledClassName?: string;
  readonly style?: React.CSSProperties;
  readonly pressStyle?: React.CSSProperties;
  readonly longPressStyle?: React.CSSProperties;
  // readonly capturePanStyle?: React.CSSProperties;
  // readonly disabledStyle?: React.CSSProperties;

  // readonly disabled?: boolean;
  // readonly capturePanOn?: undefined | 'press' | 'longPress';
  readonly longTapThresholdMs?: number;

  readonly onTap?: () => void;
  readonly onLongTap?: () => void;
  // readonly onCapturePanStart?: () => void;
  // readonly onCapturePanMove?: () => void;
  // readonly onCapturePanEnd?: () => void;
  // readonly onPressContextMenu?: () => void;
}

interface PressableState {
  readonly interactionState: undefined | 'PRESS' | 'LONG_PRESS'; // | 'CAPTURED';
}

export class Pressable extends React.PureComponent<PressableProps, PressableState> {
  public static contextType = SpaceContext;
  public readonly context!: SpaceContextType;
  public readonly id = generateRandomId();
  public readonly state: PressableState = { interactionState: undefined };

  private divRef: React.RefObject<HTMLDivElement> = React.createRef();

  public componentDidMount() {
    this.context.registerInteractable(this);
  }

  public componentWillUnmount() {
    this.context.unregisterInteractable(this);
  }

  public getPressHandlingConfig(): PressHandlingConfig {
    return {
      potentialTapBounds: DEFAULT_POTENTIAL_TAP_BOUNDS,
      onTap: this.props.onTap,
      longTapThresholdMs: this.props.longTapThresholdMs ?? DEFAULT_LONG_TAP_THRESHOLD_MS,
      onLongTap: this.props.onLongTap,
    };
  }

  public render() {
    const {
      className,
      pressClassName,
      longPressClassName,
      // capturePanClassName,
      // disabledClassName,
      style,
      pressStyle,
      longPressStyle,
      // capturePanStyle,
      // disabledStyle,

      // disabled,
      // capturePanOn,
      longTapThresholdMs,
      onTap,
      onLongTap,
      ...divProps
    } = this.props;
    return (
      <div {...divProps} {...{ [InteractableIdAttributeName]: this.id }} ref={this.divRef}>
        {this.props.children}
      </div>
    );
  }
}
