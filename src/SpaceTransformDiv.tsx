import * as React from 'react';

import { Context, ContextType } from './Context';
import { ViewPortInterface } from './ViewPortInterface';

interface SpaceTransformDivState {
  readonly transformStyle: React.CSSProperties;
}

export class SpaceTransformDiv extends React.PureComponent<{}, SpaceTransformDivState> {
  public static contextType = Context;
  public readonly context!: ContextType;
  private readonly constantStyles: string;

  public constructor(props: {}, context: ContextType) {
    super(props);
    this.state = { transformStyle: this.createTransformStyle(context.viewPort) };
    this.constantStyles = `
div.${context.rootDivUniqueClassName} > div.react-zoomable-ui-space {
  margin: 0; padding: 0; height: 100%; width: 100%;
  position: absolute;
  top: 0; left: 0;
  transform-origin: 0% 0%;
}
    `;
    context.viewPort.addEventListener('updated', this.handleViewPortUpdated);
  }

  public componentWillUnmount() {
    this.context.viewPort.removeEventListener('updated', this.handleViewPortUpdated);
  }

  public render() {
    return (
      <React.Fragment>
        <style>{this.constantStyles}</style>
        <div className="react-zoomable-ui-space" style={this.state.transformStyle}>
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }

  private createTransformStyle = (viewPort: ViewPortInterface) => ({
    transform: `scale(${viewPort.zoomFactor}) translate(${-1 * viewPort.left}px,${-1 * viewPort.top}px)`,
  });

  private handleViewPortUpdated = () => {
    this.setState({ transformStyle: this.createTransformStyle(this.context.viewPort) });
  };
}
