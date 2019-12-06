// tslint:disable-next-line: no-implicit-dependencies - Disable this until we get our changes merged into pan-zoom
import panzoom, { PanZoomControl } from 'pan-zoom';
import * as React from 'react';

import { generateRandomId } from './utils';
import { ViewPort } from './ViewPort';
import { ZoomableContext, ZoomableContextType } from './ZoomableContext';

export interface ZoomableProps {
  readonly zoomFactorMax?: number;
  readonly zoomFactorMin?: number;
}

interface ZoomableState {
  readonly innerDivTransformStyle: React.CSSProperties;
}

export class Zoomable extends React.PureComponent<ZoomableProps, ZoomableState> {
  private contextValue: ZoomableContextType;
  private containerDivRef?: HTMLElement;
  private panZoomControl?: PanZoomControl;
  private viewPort: ViewPort;

  private readonly specificClassName = `react-zoomable-ui-${generateRandomId()}`;
  private readonly constantStyles = `
div.${this.specificClassName} {
  overflow: hidden;
  margin: 0; padding: 0; height: 100%; width: 100%;
  position: relative;
  ${/* Prevent the user from highlighting while dragging */ ''}
  -webkit-user-select: none;
  ${/* Prevent the user from getting a text input box cursor when hovering over text that can be dragged */ ''}
  cursor: default;
}

div.${this.specificClassName} > div.react-zoomable-ui-transformed-div {
  margin: 0; padding: 0; height: 100%; width: 100%;
  position: absolute;
  top: 0; left: 0;
  transform-origin: 0% 0%;
}

${
  /*
  This is the only way AFAIK to suppress image dragging events on stuff
  inside the zoomable area without forcing users of the library to do it
  themselves (or add something like `draggable=false` to their `<img>`s)*/ ''
}
div.${this.specificClassName} img {
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
  user-drag: none;
}`;

  public constructor(props: ZoomableProps) {
    super(props);
    this.viewPort = new ViewPort(this.props.zoomFactorMin, this.props.zoomFactorMax);

    this.contextValue = {
      viewPort: this.viewPort,
    };

    this.state = { innerDivTransformStyle: {} };
  }

  public componentWillUnmount() {
    this.removeEventHandlers();
  }

  public render() {
    return (
      <div
        ref={this.setContainerDivRef}
        className={`react-zoomable-ui ${this.specificClassName} react-zoomable-ui-container-div`}
      >
        <style>{this.constantStyles}</style>
        <div className="react-zoomable-ui-transformed-div" style={this.state.innerDivTransformStyle}>
          <ZoomableContext.Provider value={this.contextValue}>{this.props.children}</ZoomableContext.Provider>
        </div>
      </div>
    );
  }

  private addEventHandlers() {
    if (this.containerDivRef) {
      this.containerDivRef.addEventListener('mousedown', this.handleMouseDown);
      // this.containerDivRef.addEventListener('mousemove', this.handleMouseMove);
      // // Doing this on window to catch it if it goes outside the window
      // window.addEventListener('mouseup', this.handleMouseUp);

      this.viewPort.addEventListener('updated', this.handleViewPortUpdated);

      window.addEventListener('resize', this.handleWindowResize);
    }
  }

  private handleMouseDown = (e: MouseEvent) => {
    const elementTagName = e.target && (e.target as any).tagName;
    if (elementTagName === 'a' || elementTagName === 'A') {
      // Prevent dragging on <a> tags since A. the browsers may interpret the
      // drag end as a click on it and B. desktop Safari (possibly others) has
      // its own drag handling for links which conflicts with what we are doing.
      //
      // For my own future reference: the mouse down event gets fired before the
      // impetus library used by pan-zoom fires any events for the pan.
      this.panZoomControl!.blockPan();
    }
  };

  private handleViewPortUpdated = () => {
    this.setState({
      innerDivTransformStyle: {
        transform: `scale(${this.viewPort.zoomFactor}) translate(${-1 * this.viewPort.viewLeft}px,${-1 *
          this.viewPort.viewTop}px)`,
      },
    });
  };

  private handleWindowResize = () => {
    this.viewPort.updateScreenDimensions(window.screen.width, window.screen.height);
  };

  private removeEventHandlers = () => {
    if (this.containerDivRef && this.panZoomControl) {
      this.panZoomControl.destroy();

      this.containerDivRef.removeEventListener('mousedown', this.handleMouseDown);

      this.viewPort.removeEventListener('updated', this.handleViewPortUpdated);
      window.removeEventListener('resize', this.handleWindowResize);
    }
  };

  private setContainerDivRef = (ref: any) => {
    this.removeEventHandlers();
    this.containerDivRef = ref;
    if (this.containerDivRef) {
      this.viewPort.update(0, 0, 1);
      this.panZoomControl = panzoom(this.containerDivRef, this.viewPort.processPanZoomEvent);
      this.addEventHandlers();
      this.handleWindowResize();
    }
  };
}
