import * as React from 'react';

import { Context } from './Context';
import { ViewPortInterface } from './ViewPortInterface';

export function withViewPort<P extends { readonly viewPort: ViewPortInterface }, T extends React.ComponentType<P>>(
  WrappedClass: T,
): React.ComponentType<Omit<P, 'viewPort'>> {
  return class extends React.PureComponent<Omit<P, 'viewPort'>> {
    public render(): JSX.Element {
      const p = this.props;
      return (
        <Context.Consumer>
          {context => {
            console.log(context);
            // tslint:disable-next-line: no-object-literal-type-assertion
            return React.createElement(WrappedClass, { ...p, viewPort: context.viewPort } as P);
          }}
        </Context.Consumer>
      );
    }
  };
}
