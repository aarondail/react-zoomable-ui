import * as React from 'react';

import { ViewPortInterface } from './ViewPortInterface';
import { withViewPort } from './withViewPort';

interface DebugHelperComponentProps extends React.HTMLProps<HTMLDivElement> {
  readonly viewPort: ViewPortInterface;
}

class DebugHelperComponent extends React.PureComponent<DebugHelperComponentProps> {
  private readonly constantStyles = `
div.react-zoomable-ui-debug-helper {
  background-color: darkgreen;
  color: white;
}
div.react-zoomable-ui-debug-helper > div.react-zoomable-ui-debug-helper-cell {
  flex: 1;
  display: flex;
  flex-direction: row;
  font-family: monospace;
}
div.react-zoomable-ui-debug-helper > div.react-zoomable-ui-debug-helper-cell > div.react-zoomable-ui-debug-helper-cell-label {
  font-size: x-small;
  width: 15em;
  text-align: right;
  padding-right: 1em;
  align-self: flex-end;
  padding-bottom: 1px;
}
div.react-zoomable-ui-debug-helper > div.react-zoomable-ui-debug-helper-cell > div.react-zoomable-ui-debug-helper-cell-value {
  font-size: medium;
  font-weight: bold;
  width: 12em;
  text-align: left;
}
`;

  public componentDidMount(): void {
    this.props.viewPort.addEventListener('updated', this.handleViewPortUpdated);
  }

  public componentWillUnmount(): void {
    this.props.viewPort.removeEventListener('updated', this.handleViewPortUpdated);
  }

  public render() {
    console.log('render-kid');
    const { viewPort, ...otherProps } = this.props;
    return (
      <div className="react-zoomable-ui-debug-helper" {...otherProps}>
        <style>{this.constantStyles} </style>
        {this.renderCell(
          'VIRT SPACE - LEFT, TOP',
          `${this.props.viewPort.left.toFixed(3)}, ${this.props.viewPort.top.toFixed(3)}`,
        )}
        {this.renderCell(
          'VIRT SPACE - CENTER',
          `${this.props.viewPort.centerX.toFixed(3)}, ${this.props.viewPort.centerY.toFixed(3)}`,
        )}
        {this.renderCell(
          'VIRT SPACE - SIZE',
          `${this.props.viewPort.width.toFixed(3)}, ${this.props.viewPort.height.toFixed(3)}`,
        )}
        {this.renderCell('ZOOM FACTOR', this.props.viewPort.zoomFactor.toFixed(3))}
        {this.renderCell(
          'CONTAINER SIZE',
          `${this.props.viewPort.containerWidth}, ${this.props.viewPort.containerHeight}`,
        )}
      </div>
    );
  }

  private handleViewPortUpdated = () => {
    this.forceUpdate();
  };

  private renderCell = (label: string, value: any) => {
    return (
      <div className="react-zoomable-ui-debug-helper-cell">
        <div className="react-zoomable-ui-debug-helper-cell-label">{label}:</div>
        <div className="react-zoomable-ui-debug-helper-cell-value">{value}</div>
      </div>
    );
  };
}

export const DebugHelper = withViewPort(DebugHelperComponent);
