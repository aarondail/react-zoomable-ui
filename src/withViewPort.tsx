import * as React from 'react';

import { Context } from './Context';
import { ViewPortInterface } from './ViewPortInterface';

/**
 * This is a simple higher order component that fills in a `viewPort` prop of
 * another component. The resulting component has to be used inside a `Space`
 * or `Provider`.
 */
export function withViewPort<P extends { readonly viewPort: ViewPortInterface }>(
  WrappedClass: React.ComponentType<P>,
): React.ComponentType<Omit<P, 'viewPort'>> {
  return class extends React.PureComponent<Omit<P, 'viewPort'>> {
    public render(): JSX.Element {
      const p = this.props;
      return (
        <Context.Consumer>
          {context => {
            // tslint:disable-next-line: no-object-literal-type-assertion
            return React.createElement(WrappedClass, { ...p, viewPort: context.viewPort } as P);
          }}
        </Context.Consumer>
      );
    }
  };
}
