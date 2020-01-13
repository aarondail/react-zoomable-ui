import * as React from 'react';

import { SpaceContext } from './SpaceContext';
import { ViewPort } from './ViewPort';

/**
 * This is a simple higher order component that fills in a `viewPort` prop of
 * another component. The resulting component has to be used inside a `Space`.
 */
export function withViewPort<P extends { readonly viewPort: ViewPort }>(
  WrappedClass: React.ComponentType<P>,
): React.ComponentType<Omit<P, 'viewPort'>> {
  return class extends React.PureComponent<Omit<P, 'viewPort'>> {
    public render(): JSX.Element {
      const p = this.props;
      return (
        <SpaceContext.Consumer>
          {context => {
            // tslint:disable-next-line: no-object-literal-type-assertion
            return React.createElement(WrappedClass, { ...p, viewPort: context.viewPort } as P);
          }}
        </SpaceContext.Consumer>
      );
    }
  };
}
