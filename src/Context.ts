import * as React from 'react';

import { Interactable } from './Interactable';
import { ViewPort } from './ViewPort';
import { ViewPortInterface } from './ViewPortInterface';

export interface ContextType {
  readonly registerInteractable: (interactable: Interactable) => void;
  readonly rootDivUniqueClassName: string;
  readonly unregisterInteractable: (interactable: Interactable) => void;
  readonly viewPort: ViewPortInterface;
}

export const Context = React.createContext<ContextType>({
  // tslint:disable-next-line: no-empty
  registerInteractable: () => {},
  rootDivUniqueClassName: '',
  viewPort: new ViewPort(undefined, undefined),
  // tslint:disable-next-line: no-empty
  unregisterInteractable: () => {},
});
