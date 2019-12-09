import * as React from 'react';

import { Provider, ProviderProps } from './Provider';
import { SpaceTransformDiv } from './SpaceTransformDiv';

// tslint:disable-next-line: no-empty-interface
export interface SpaceProps extends ProviderProps {}

export class Space extends React.PureComponent<SpaceProps> {
  private readonly providerRef: React.RefObject<Provider> = React.createRef();

  public render() {
    return (
      <Provider {...this.props} ref={this.providerRef}>
        <SpaceTransformDiv>{this.props.children}</SpaceTransformDiv>
      </Provider>
    );
  }

  public updateContainerSize = () => {
    if (this.providerRef.current) {
      this.providerRef.current.updateContainerSize();
    }
  };
}
