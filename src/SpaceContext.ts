import * as React from 'react';

import { InteractableComponent } from './Interactable';
import { ViewPort } from './ViewPort';

/**
 * The type of the `SpaceContext` data.
 */
export interface SpaceContextType {
  readonly rootDivUniqueClassName: string;
  readonly registerInteractable: (interactable: InteractableComponent) => void;
  readonly viewPort: ViewPort;
  readonly unregisterInteractable: (interactable: InteractableComponent) => void;
}

/**
 * This React context can be used within a `Space` to get access
 * to the `ViewPort`.
 *
 * See `SpaceContextType` for the type of the data.
 */
export const SpaceContext = React.createContext<SpaceContextType>(undefined as any);
