import * as React from 'react';

import { Context, ContextType } from './Context';
import { InteractableIdAttributeName } from './Interactable';
import { generateRandomId } from './utils';
import { VirtualSpacePixelUnit } from './ViewPortInterface';

export interface PressableEvent {
  readonly virtualSpaceX: VirtualSpacePixelUnit;
  readonly virtualSpaceY: VirtualSpacePixelUnit;
}

export interface PressableProps extends Omit<React.HTMLProps<HTMLDivElement>, 'ref'> {
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
  readonly longPressThresholdMs?: number;

  readonly onPress?: (e: PressableEvent) => void;
  readonly onLongPress?: (e: PressableEvent) => void;
  // readonly onCapturePanStart?: () => void;
  // readonly onCapturePanMove?: () => void;
  // readonly onCapturePanEnd?: () => void;
  readonly onRightClick?: (e: PressableEvent) => void;
}

export class Pressable extends React.PureComponent<PressableProps> {
  public static contextType = Context;
  public readonly context!: ContextType;
  public readonly id = generateRandomId();

  private divRef: React.RefObject<HTMLDivElement> = React.createRef();

  public componentDidMount() {
    this.context.registerInteractable(this);
  }

  public componentWillUnmount() {
    this.context.unregisterInteractable(this);
  }

  // public getBoundingClientRect() {
  //   if (this.divRef) {
  //     return this.divRef.getBoundingClientRect();
  //   }
  //   return undefined;
  // }

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
      longPressThresholdMs,
      ...divProps
    } = this.props;
    return (
      <div {...divProps} {...{ [InteractableIdAttributeName]: this.id }} ref={this.divRef}>
        {this.props.children}
      </div>
    );
  }
}
