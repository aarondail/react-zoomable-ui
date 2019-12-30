import * as React from 'react';

import { InteractableComponent } from './Interactable';
import { ViewPort } from './ViewPort';

export interface SpaceContextType {
  readonly rootDivUniqueClassName: string;
  readonly registerInteractable: (interactable: InteractableComponent) => void;
  readonly viewPort: ViewPort;
  readonly unregisterInteractable: (interactable: InteractableComponent) => void;
}

export const SpaceContext = React.createContext<SpaceContextType>(undefined as any);
