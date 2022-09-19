import * as React from 'react';

import { InteractableIdAttributeName } from './Interactable';
import { SpaceContext, SpaceContextType } from './SpaceContext';
import { generateRandomId } from './utils';

export interface NoPanAreaProps extends React.PropsWithChildren {
  readonly id?: string;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

/**
 * If you have a part of your `Space` that you do not want to be pan-able for
 * some reason you can wrap it with `NoPanArea`. This has limited utility, but
 * might be useful in some cases.
 *
 * This doesn't affect zooming though.
 *
 * Must only be used inside a `Space`.
 *
 * ## Props
 *
 * See `NoPanAreaProps`.
 */
export class NoPanArea extends React.PureComponent<NoPanAreaProps> {
  public static contextType = SpaceContext;
  public readonly context!: SpaceContextType;
  public readonly id = generateRandomId();

  private readonly constantStyles: string;
  private divRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly uniqueClassName = `react-zoomable-ui-no-pan-area-${this.id}`;

  public constructor(props: NoPanAreaProps, context: SpaceContextType) {
    super(props);
    this.constantStyles = `
div.${context.rootDivUniqueClassName} div.${this.uniqueClassName} {
  -ms-touch-action: default;
  -webkit-user-select: text;
  -webkit-touch-callout: default;
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
    const { style } = this.props;
    return (
      <React.Fragment>
        <style>{this.constantStyles}</style>
        <div
          id={this.props.id}
          {...{ [InteractableIdAttributeName]: this.id }}
          className={this.determineClassName()}
          style={style}
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
