// import * as React from 'react';

// import { EndlessSpaceContext } from './EndlessSpaceContext';

// export enum DropTargetHighlightType {
//   NONE = 'NONE',
//   POTENTIAL = 'POTENTIAL',
//   HOVER = 'HOVER',
// }

// export interface DropTargetProps {
//   readonly className?: string;
//   readonly hoverClassName?: string;
//   readonly potentialClassName?: string;
//   readonly style?: React.CSSProperties;

//   readonly onDoesAccept: (dragId: string) => boolean;
//   readonly onDrop: (dragId: string) => void;

//   readonly children: (interaction: DropTargetHighlightType) => React.ReactNode;
// }

// interface DropTargetState {
//   readonly highlight: DropTargetHighlightType;
// }

// export class DropTarget extends React.PureComponent<
//   DropTargetProps,
//   DropTargetState
// > {
//   private divRef?: HTMLElement;
//   private id = Math.random()
//     .toString(36)
//     .slice(2);

//   public constructor(props: DropTargetProps) {
//     super(props);
//     this.state = { highlight: DropTargetHighlightType.NONE };
//   }

//   public componentWillMount() {
//     this.context.registerDropTarget(this.id, this);
//   }

//   public componentWillUnmount() {
//     this.context.unregisterDropTarget(this.id);
//   }

//   public getBoundingClientRect() {
//     return this.divRef && this.divRef.getBoundingClientRect();
//   }

//   public render() {
//     let className = `DropTarget`;
//     if (this.props.className) {
//       className += ' ' + this.props.className;
//     }
//     if (
//       this.state.highlight === DropTargetHighlightType.POTENTIAL &&
//       this.props.potentialClassName
//     ) {
//       className += ' ' + this.props.potentialClassName;
//     }
//     if (
//       this.state.highlight === DropTargetHighlightType.HOVER &&
//       this.props.hoverClassName
//     ) {
//       className += ' ' + this.props.hoverClassName;
//     }

//     return (
//       <div className={className} ref={this.setDivRef} style={this.props.style}>
//         {this.props.children(this.state.highlight)}
//       </div>
//     );
//   }

//   public updateToNoHighlight() {
//     this.setState({ highlight: DropTargetHighlightType.NONE });
//   }

//   public updateToPotentialHighlight() {
//     this.setState({ highlight: DropTargetHighlightType.POTENTIAL });
//   }

//   public updateToHoverHighlight() {
//     this.setState({ highlight: DropTargetHighlightType.HOVER });
//   }

//   private setDivRef = (ref: any) => {
//     this.divRef = ref;
//   };
// }

// DropTarget.contextType = EndlessSpaceContext;
