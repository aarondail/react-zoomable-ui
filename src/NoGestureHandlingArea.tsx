import * as React from 'react';

import { Interactable, InteractableProps } from './Interactable';

export type NoGestureHandlingAreaProps = Omit<InteractableProps, 'ignoreGestures'>;

export class NoGestureHandlingArea extends React.PureComponent<NoGestureHandlingAreaProps> {
  public render() {
    return <Interactable {...this.props} ignoreGestures />;
  }
}
