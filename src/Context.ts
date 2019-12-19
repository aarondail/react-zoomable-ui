import * as React from 'react';

import { InteractableComponent } from './Interactable';
import { ViewPort } from './ViewPort';
import { ViewPortInterface } from './ViewPortInterface';

export interface ContextType {
  readonly registerInteractable: (interactable: InteractableComponent) => void;
  readonly rootDivUniqueClassName: string;
  readonly unregisterInteractable: (interactable: InteractableComponent) => void;
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
