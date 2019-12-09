// import panzoom from 'pan-zoom';

// import { rectContainsPoint } from '../utils';

// import { DropTarget } from './DropTarget';
// import { Interactable } from './Interactable';
// import { ViewPort } from './ViewPort';

// export class PressInteractionHandler {
//   private actualDropTargets?: ReadonlyArray<{
//     clientRect: ClientRect;
//     dropTarget: DropTarget;
//   }>;
//   private currentDropTarget?: DropTarget;
//   private interpretation: 'POSSIBLE_CLICK' | 'PAN' | 'DRAG';
//   private longPressTimeoutHandle?: any;

//   constructor(
//     readonly target: Interactable,
//     readonly startX: number,
//     readonly startY: number,
//     readonly allPossibleDropTargets: ReadonlyMap<string, DropTarget>,
//     readonly panZoomControl: ReturnType<typeof panzoom>,
//     readonly viewPort: ViewPort,
//   ) {
//     this.interpretation = 'POSSIBLE_CLICK';

//     target.updateToPressing();
//     panZoomControl.pausePanning();

//     if (target.props.canDrag) {
//       // Getting the drop target behind the interactable would be weird.
//       this.longPressTimeoutHandle = setTimeout(
//         () => this.handleLongPress(),
//         1000,
//       );
//     }
//   }

//   public clearTimeouts = () => {
//     if (this.longPressTimeoutHandle) {
//       clearTimeout(this.longPressTimeoutHandle);
//       this.longPressTimeoutHandle = undefined;
//     }
//   };

//   public onPointerMove = (e: MouseEvent) => {
//     if (this.interpretation === 'POSSIBLE_CLICK') {
//       if (
//         Math.abs(e.clientX - this.startX) > 4 ||
//         Math.abs(e.clientY - this.startY) > 4
//       ) {
//         this.interpretation = 'PAN';
//         this.target.updateToNoInteraction();
//         this.clearTimeouts();

//         // Dont ignore current pan gesture when resuming
//         this.panZoomControl.resumePanning(false);
//       }
//     } else if (this.interpretation === 'DRAG') {
//       const xDiff = e.clientX - this.startX;
//       const yDiff = e.clientY - this.startY;
//       this.target.updateDragOffset(xDiff, yDiff, this.viewPort);

//       let newDropTarget;
//       if (this.actualDropTargets) {
//         for (const dtr of this.actualDropTargets) {
//           if (rectContainsPoint(dtr.clientRect, e.clientX, e.clientY)) {
//             newDropTarget = dtr.dropTarget;
//           }
//         }
//       }

//       if (newDropTarget !== this.currentDropTarget) {
//         if (this.currentDropTarget) {
//           this.currentDropTarget.updateToPotentialHighlight();
//         }
//         this.currentDropTarget = newDropTarget;
//         if (this.currentDropTarget) {
//           this.currentDropTarget.updateToHoverHighlight();
//         }
//       }
//     }
//   };

//   public onPointerUp = (e: MouseEvent) => {
//     if (this.interpretation === 'POSSIBLE_CLICK') {
//       if (this.target && this.target.props.onClick) {
//         this.target.props.onClick();
//       }
//       // Resume possible panning on the next gesture
//       if (this.panZoomControl) {
//         this.panZoomControl.resumePanning(true);
//       }
//     } else if (this.interpretation === 'DRAG') {
//       if (this.currentDropTarget && this.target.props.dragId) {
//         this.currentDropTarget.props.onDrop(this.target.props.dragId);
//       }

//       // Resume possible panning on the next gesture
//       if (this.panZoomControl) {
//         this.panZoomControl.resumePanning(true);
//       }

//       if (this.actualDropTargets) {
//         this.actualDropTargets.forEach(({ dropTarget }) =>
//           dropTarget.updateToNoHighlight(),
//         );
//       }
//     }

//     this.clearTimeouts();
//     this.target.updateToNoInteraction();
//   };

//   private handleLongPress = () => {
//     console.log('long press');
//     this.longPressTimeoutHandle = undefined;
//     if (this.interpretation === 'POSSIBLE_CLICK' && this.target.props.dragId) {
//       console.log('drag mode');
//       this.interpretation = 'DRAG';
//       this.target.updateToDragging();
//       this.target.updateDragOffset(0, 0, this.viewPort);

//       // tslint:disable-next-line:readonly-array
//       const actualDropTargets = [];
//       const dragId = this.target.props.dragId;
//       for (const id of Array.from(this.allPossibleDropTargets.keys())) {
//         const dropTarget = this.allPossibleDropTargets.get(id);
//         if (!dropTarget) {
//           continue;
//         }

//         const clientRect = dropTarget.getBoundingClientRect();
//         if (clientRect && dropTarget.props.onDoesAccept(dragId)) {
//           actualDropTargets.push({ clientRect, dropTarget });
//         }
//       }
//       this.actualDropTargets = actualDropTargets;

//       this.actualDropTargets.forEach(({ dropTarget }) =>
//         dropTarget.updateToPotentialHighlight(),
//       );
//       this.currentDropTarget = undefined;
//     }
//   };
// }
