// tslint:disable-next-line: no-implicit-dependencies - Disable this until we get our changes merged into pan-zoom
import panzoom, { PanZoomControl } from 'pan-zoom';
import * as React from 'react';

import { ViewPort } from './ViewPort';
import { ZoomableContext, ZoomableContextType } from './ZoomableContext';

export interface ZoomableProps {
  readonly zoomFactorMax?: number;
  readonly zoomFactorMin?: number;
}

interface ZoomableState {
  readonly innerDivStyle: React.CSSProperties;
}

export class Zoomable extends React.PureComponent<
  ZoomableProps,
  ZoomableState
> {
  private contextValue: ZoomableContextType;
  private outerDivRef?: HTMLElement;
  private panZoomControl?: PanZoomControl;
  private viewPort: ViewPort;

  public constructor(props: ZoomableProps) {
    super(props);
    this.viewPort = new ViewPort(
      this.props.zoomFactorMin,
      this.props.zoomFactorMax,
    );

    this.contextValue = {
      viewPort: this.viewPort,
    };

    this.state = {
      innerDivStyle: INNER_DIV_STYLE,
    };
  }

  public componentWillUnmount() {
    this.removeEventHandlers();
  }

  public render() {
    return (
      <div style={OUTER_DIV_STYLE} ref={this.setOuterDivRef}>
        <div style={this.state.innerDivStyle}>
          <ZoomableContext.Provider value={this.contextValue}>
            {this.props.children}
          </ZoomableContext.Provider>
        </div>
      </div>
    );
  }

  private addEventHandlers() {
    if (this.outerDivRef) {
      this.outerDivRef.addEventListener('mousedown', this.handleMouseDown);
      this.outerDivRef.addEventListener('mousemove', this.handleMouseMove);
      // Doing this on window to catch it if it goes outside the window
      window.addEventListener('mouseup', this.handleMouseUp);

      this.outerDivRef.addEventListener('touchstart', this.handleTouchStart);
      this.outerDivRef.addEventListener('touchend', this.handleTouchEnd);
      this.viewPort.addEventListener('updated', this.handleViewPortUpdated);

      window.addEventListener('resize', this.handleWindowResize);
    }
  }

  // tslint:disable-next-line: no-empty
  private handleMouseDown = (e: MouseEvent) => {};

  // tslint:disable-next-line: no-empty
  private handleMouseMove = (e: MouseEvent) => {};

  // tslint:disable-next-line: no-empty
  private handleMouseUp = (e: MouseEvent) => {};

  private handleTouchStart = (e: TouchEvent) => {
    throw new Error('not implemented');
  };

  private handleTouchEnd = (e: TouchEvent) => {
    throw new Error('not implemented');
  };

  // tslint:disable-next-line: no-empty
  private handleViewPortUpdated = () => {
    this.setState({
      innerDivStyle: {
        ...INNER_DIV_STYLE,
        transform: `scale(${this.viewPort.zoomFactor}) translate(${-1 *
          this.viewPort.viewLeft}px,${-1 * this.viewPort.viewTop}px)`,
        transformOrigin: `0% 0%`,
      },
    });
  };

  private handleWindowResize = () => {
    this.viewPort.updateScreenDimensions(
      window.screen.width,
      window.screen.height,
    );
  };

  private removeEventHandlers = () => {
    if (this.outerDivRef && this.panZoomControl) {
      this.panZoomControl.destroy();
      this.outerDivRef.removeEventListener('mousedown', this.handleMouseDown);
      // this.divRef.removeEventListener('click', this.handleClick);
      window.removeEventListener('mouseup', this.handleMouseUp);
      this.outerDivRef.removeEventListener('touchstart', this.handleTouchStart);
      this.outerDivRef.removeEventListener('touchend', this.handleTouchEnd);

      this.viewPort.removeEventListener('updated', this.handleViewPortUpdated);
      window.removeEventListener('resize', this.handleWindowResize);

      // if (this.currentInteractionHandler) {
      //   this.currentInteractionHandler.clearTimeouts();
      // }
      // this.currentInteractionHandler = undefined;
    }
  };

  private setOuterDivRef = (ref: any) => {
    this.removeEventHandlers();
    this.outerDivRef = ref;
    if (this.outerDivRef) {
      this.viewPort.update(0, 0, 1);
      this.panZoomControl = panzoom(
        this.outerDivRef,
        this.viewPort.processPanZoomEvent,
      );
      this.addEventHandlers();
      this.handleWindowResize();
    }
  };
}

const INNER_DIV_STYLE: React.CSSProperties = {
  margin: 0,
  padding: 0,
  height: '100%',
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
};

const OUTER_DIV_STYLE: React.CSSProperties = {
  overflow: 'hidden',
  height: '100%',
  width: '100%',
  margin: 0,
  padding: 0,
  position: 'relative',
};
