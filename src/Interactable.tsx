import * as React from 'react';

import { Context, ContextType } from './Context';
import { generateRandomId } from './utils';

export interface InteractableProps extends Omit<React.HTMLProps<HTMLDivElement>, 'ref'> {
  readonly ignoreGestures?: boolean;
  // readonly canPressClick?: boolean;
  // readonly canLongPressClick?: boolean;
  // readonly canDrag?: boolean;

  // readonly dragId?: string;

  // readonly draggingClassName?: string;
  // readonly pressingClassName?: string;

  // readonly onPressClick?: () => void;
  // readonly onLongPressClick?: () => void;
  // readonly onDragStart?: () => void;
}

// tslint:disable-next-line: no-empty-interface
interface InteractableState {}

export class Interactable extends React.PureComponent<InteractableProps, InteractableState> {
  public static contextType = Context;
  public static readonly IdAttributeName = 'x-react-zoomable-ui-interactable-id';
  public static readonly IgnoreGesturesClassName = 'react-zoomable-ui-interactable-ignore-gestures';
  public readonly context!: ContextType;
  public readonly id = generateRandomId();

  private divRef: React.RefObject<HTMLDivElement> = React.createRef();

  public componentWillMount() {
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
    const { ignoreGestures, className, ...divProps } = this.props;
    return (
      <div
        {...divProps}
        x-react-zoomable-ui-interactable-id={this.id}
        className={this.determineClassName()}
        ref={this.divRef}
      >
        {this.props.children}
      </div>
    );
  }

  private determineClassName = () => {
    const { className, ignoreGestures } = this.props;
    if (ignoreGestures) {
      if (className) {
        return `${className} ${Interactable.IgnoreGesturesClassName}`;
      } else {
        return Interactable.IgnoreGesturesClassName;
      }
    }
    return className;
  };
}
