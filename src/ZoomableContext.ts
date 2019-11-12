import * as React from 'react';

import { ViewPort } from './ViewPort';
import { ViewPortInterface } from './ViewPortInterface';

export interface ZoomableContextType {
  readonly viewPort: ViewPortInterface;
}

export const ZoomableContext = React.createContext<ZoomableContextType>({
  viewPort: new ViewPort(undefined, undefined),
});
