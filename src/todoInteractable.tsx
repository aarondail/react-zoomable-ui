// import * as React from 'react';

// import { EndlessSpaceContext } from './EndlessSpaceContext';
// import { ViewPort } from './ViewPort';

// enum InteractionType {
//   NONE = 'NONE',
//   PRESSING = 'PRESSING',
//   DRAGGING = 'DRAGGING',
// }

// export interface InteractableProps {
//   readonly className?: string;
//   readonly canClick?: boolean;
//   readonly canDrag?: boolean;
//   readonly dragId?: string;
//   readonly draggingClassName?: string;
//   readonly pressingClassName?: string;
//   readonly style?: React.CSSProperties;

//   readonly onClick?: () => void;
// }

// interface InteractableState {
//   readonly currentInteraction: InteractionType;
//   readonly dragPosition?: {
//     readonly xOffset: number;
//     readonly yOffset: number;
//   };
// }

// export class Interactable extends React.PureComponent<
//   InteractableProps,
//   InteractableState
// > {
//   public static getInteractableId(element: HTMLElement): string | undefined {
//     if (element.classList.contains('Interactable')) {
//       return element.getAttribute('x-interactable-id')!;
//     } else if (element.parentElement) {
//       return Interactable.getInteractableId(element.parentElement);
//     }
//     return undefined;
//   }

//   private divRef?: HTMLElement;
//   private dragSpacerSize?: { width: number; height: number };
//   private dragStartClientCoords?: { x: number; y: number };
//   private id = Math.random()
//     .toString(36)
//     .slice(2);

//   public constructor(props: InteractableProps) {
//     super(props);
//     this.state = { currentInteraction: InteractionType.NONE };
//   }

//   public componentWillMount() {
//     this.context.registerInteractable(this.id, this);
//   }

//   public componentWillUnmount() {
//     this.context.unregisterInteractable(this.id);
//   }

//   public getBoundingClientRect() {
//     if (this.divRef) {
//       return this.divRef.getBoundingClientRect();
//     }
//     return undefined;
//   }

//   public render() {
//     const className = this.getClassName();

//     let style: React.CSSProperties | undefined = this.props.style;
//     if (this.state.dragPosition) {
//       style = {
//         ...this.props.style,
//         left: this.state.dragPosition.xOffset,
//         position: 'fixed',
//         top: this.state.dragPosition.yOffset,
//         zIndex: 9000,
//       };
//     }

//     // TODO consider now that we are passing in absolute coordinates (and width
//     // and height) whether we need to have a ref to get the bounding client rect
//     // (like, dont we know what it is?)

//     return (
//       <React.Fragment>
//         <div
//           className={className}
//           x-interactable-id={this.id}
//           style={style}
//           ref={this.setDivRef}
//         >
//           {this.props.children}
//         </div>
//         {this.renderSpacerIfDragging()}
//       </React.Fragment>
//     );
//   }

//   public updateDragOffset(
//     clientXDiff: number,
//     clientYDiff: number,
//     viewPort: ViewPort,
//   ) {
//     if (!this.dragStartClientCoords) {
//       return;
//     }

//     const xOffset =
//       (clientXDiff + this.dragStartClientCoords.x) / viewPort.zoomFactor +
//       viewPort.viewLeft;
//     const yOffset =
//       (clientYDiff + this.dragStartClientCoords.y) / viewPort.zoomFactor +
//       viewPort.viewTop;

//     this.setState({ dragPosition: { xOffset, yOffset } });
//   }

//   public updateToNoInteraction() {
//     this.setState({
//       currentInteraction: InteractionType.NONE,
//       dragPosition: undefined,
//     });
//   }

//   public updateToPressing() {
//     this.setState({
//       currentInteraction: InteractionType.PRESSING,
//       dragPosition: undefined,
//     });
//   }

//   public updateToDragging() {
//     if (this.divRef) {
//       const { left, top, width, height } = this.divRef.getBoundingClientRect();
//       this.dragSpacerSize = { width, height };
//       this.dragStartClientCoords = { x: left, y: top };

//       this.setState({
//         currentInteraction: InteractionType.DRAGGING,
//         dragPosition: { xOffset: 0, yOffset: 0 },
//       });
//     }
//   }

//   private getClassName = () => {
//     let className = `Interactable`;
//     if (this.props.className) {
//       className += ' ' + this.props.className;
//     }
//     if (
//       this.state.currentInteraction === InteractionType.PRESSING &&
//       this.props.pressingClassName
//     ) {
//       className += ' ' + this.props.pressingClassName;
//     }
//     if (
//       this.state.currentInteraction === InteractionType.DRAGGING &&
//       this.props.draggingClassName
//     ) {
//       className += ' ' + this.props.draggingClassName;
//     }
//     return className;
//   };

//   private renderSpacerIfDragging = () => {
//     if (
//       this.state.currentInteraction === 'DRAGGING' &&
//       this.state.dragPosition
//     ) {
//       return <div style={this.dragSpacerSize} />;
//     }
//     return null;
//   };

//   private setDivRef = (ref: any) => {
//     this.divRef = ref;
//   };
// }

// Interactable.contextType = EndlessSpaceContext;
