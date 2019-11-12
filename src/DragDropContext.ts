// import * as React from 'react';

// // These are circular dependencies, which isn't great
// import { DropTarget } from './DropTarget';
// import { Interactable } from './Interactable';

// /**
//  * This is used to facilitate Interactable and
//  * DropTargets hooking up w/ the containing DragDrop. Its not
//  * intended for use by any other components.
//  */
// export interface DragDropContextType {
//   readonly registerDropTarget: (id: string, dropTarget: DropTarget) => void;
//   readonly registerInteractable: (
//     id: string,
//     interactable: Interactable,
//   ) => void;
//   readonly unregisterDropTarget: (id: string) => void;
//   readonly unregisterInteractable: (id: string) => void;
// }

// export const DragDropContext = React.createContext<DragDropContextType>(
//   undefined as any,
// );
