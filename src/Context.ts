import * as React from 'react';

import { ViewPort } from './ViewPort';
import { ViewPortInterface } from './ViewPortInterface';

export interface ContextType {
  readonly rootDivUniqueClassName: string;
  readonly viewPort: ViewPortInterface;
}

export const Context = React.createContext<ContextType>({
  rootDivUniqueClassName: '',
  viewPort: new ViewPort(undefined, undefined),
});
