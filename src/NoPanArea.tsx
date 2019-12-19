import * as React from 'react';

import { Context, ContextType } from './Context';
import { InteractableIdAttributeName } from './Interactable';
import { generateRandomId } from './utils';

export type NoPanAreaProps = Omit<React.HTMLProps<HTMLDivElement>, 'ref'>;

export class NoPanArea extends React.PureComponent<NoPanAreaProps> {
  public static contextType = Context;
  public readonly context!: ContextType;
  public readonly id = generateRandomId();

  private readonly constantStyles: string;
  private divRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly uniqueClassName = `react-zoomable-ui-no-pan-area-${this.id}`;

  public constructor(props: NoPanAreaProps, context: ContextType) {
    super(props);
    this.constantStyles = `
div.${context.rootDivUniqueClassName} div.${this.uniqueClassName} {
  -ms-touch-action: default;
  -webkit-user-select: text;
  user-select: text;
  cursor: auto;
} 
`;
  }

  public componentDidMount() {
    this.context.registerInteractable(this);
  }

  public componentWillUnmount() {
    this.context.unregisterInteractable(this);
  }

  public render() {
    const { className, ...divProps } = this.props;
    return (
      <React.Fragment>
        <style>{this.constantStyles}</style>
        <div
          {...divProps}
          {...{ [InteractableIdAttributeName]: this.id }}
          className={this.determineClassName()}
          ref={this.divRef}
        >
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }

  private determineClassName = () => {
    const { className } = this.props;
    if (className) {
      return `${className} ${this.uniqueClassName}`;
    } else {
      return this.uniqueClassName;
    }
  };
}
