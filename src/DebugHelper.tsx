import * as React from 'react';

import { ViewPortInterface } from './ViewPortInterface';
import { withViewPort } from './withViewPort';

interface DebugHelperComponentProps extends React.HTMLProps<HTMLDivElement> {
  readonly viewPort: ViewPortInterface;
}

class DebugHelperComponent extends React.PureComponent<DebugHelperComponentProps> {
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
        {this.renderCell('VIRT LEFT', this.props.viewPort.virtualSpaceLeft.toFixed(3))}
        {this.renderCell('VIRT TOP', this.props.viewPort.virtualSpaceTop.toFixed(3))}
        {this.renderCell('ZOOM FACTOR', this.props.viewPort.zoomFactor.toFixed(3))}
        {this.renderCell('CONT WIDTH', this.props.viewPort.containerWidth)}
        {this.renderCell('CONT HEIGHT', this.props.viewPort.containerHeight)}
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

export const DebugHelper: React.ComponentType<Omit<DebugHelperComponentProps, 'viewPort'>> = withViewPort(
  DebugHelperComponent,
);
