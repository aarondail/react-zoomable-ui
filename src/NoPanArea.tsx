import * as React from 'react';

import { Interactable, InteractableProps } from './Interactable';

export type NoPanAreaProps = Omit<InteractableProps, 'ignorePan'>;

export class NoPanArea extends React.PureComponent<NoPanAreaProps> {
  public render() {
    return <Interactable {...this.props} ignorePan />;
  }
}
