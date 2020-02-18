import * as React from 'react';

import { InteractableComponent } from './Interactable';
import { ViewPort } from './ViewPort';

export interface SpaceContextType {
  readonly rootDivUniqueClassName: string;
  readonly registerInteractable: (interactable: InteractableComponent) => void;
  readonly viewPort: ViewPort;
  readonly unregisterInteractable: (interactable: InteractableComponent) => void;
}

/**
 * This React context can be used within a [[Space]] to get access
 * to the [[ViewPort]].
 */
export const SpaceContext = React.createContext<SpaceContextType>(undefined as any);
