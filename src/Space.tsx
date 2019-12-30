import * as React from 'react';

import { ElementSizeChangePoller } from './ElementSizeChangePoller';
import { getInteractableIdMostApplicableToElement, InteractableComponent } from './Interactable';
import { NoPanArea } from './NoPanArea';
import { Pressable } from './Pressable';
import { PressHandlingConfig, PressInterpreter } from './PressInterpreter';
import { SpaceContext, SpaceContextType } from './SpaceContext';
import { generateRandomId } from './utils';
import { ClientPixelUnit, ViewPort, ZoomFactor } from './ViewPort';

// tslint:disable-next-line: no-empty-interface
export interface SpaceProps {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly pollForElementResizing?: boolean;
  readonly zoomFactorMax?: ZoomFactor;
  readonly zoomFactorMin?: ZoomFactor;
}

interface SpaceState {
  readonly contextValue?: SpaceContextType;
  readonly transformStyle?: React.CSSProperties;
}

export class Space extends React.PureComponent<SpaceProps, SpaceState> {
  private readonly rootDivUniqueClassName = `react-zoomable-ui-${generateRandomId()}`;

  private readonly constantStyles = `
div.${this.rootDivUniqueClassName} > div.react-zoomable-ui-space-transform-div {
  margin: 0; padding: 0; height: 100%; width: 100%;
  position: absolute;
  top: 0; left: 0;
  transform-origin: 0% 0%;
}`;

  private containerDivRef?: HTMLDivElement;
  private elementSizeChangePoller: ElementSizeChangePoller;
  private readonly interactableRegistry: Map<string, InteractableComponent>;
  private readonly pressInterpreter: PressInterpreter;
  private viewPort?: ViewPort;

  public constructor(props: SpaceProps) {
    super(props);
    this.interactableRegistry = new Map();
    this.state = {};

    this.pressInterpreter = new PressInterpreter(this.handleDecideHowToHandlePress);
    // This won't actually start polling until we give it an element, and tell
    // it to start polling...
    this.elementSizeChangePoller = new ElementSizeChangePoller(this.updateContainerSize);
  }

  public componentDidUpdate(prevProps: SpaceProps) {
    if (this.props.pollForElementResizing !== prevProps.pollForElementResizing) {
      this.elementSizeChangePoller.update(this.containerDivRef, !!this.props.pollForElementResizing);
    }
  }

  public componentWillUnmount() {
    this.destroyViewPort();
  }

  public render() {
    return (
      <div
        ref={this.setContainerDivRef}
        className={`react-zoomable-ui ${this.rootDivUniqueClassName} react-zoomable-ui-space ${this.props.className ||
          ''}`}
        style={this.props.style}
      >
        <style>{this.constantStyles}</style>
        {this.state.contextValue && (
          <SpaceContext.Provider value={this.state.contextValue}>
            <div className="react-zoomable-ui-space-transform-div" style={this.state.transformStyle}>
              {this.props.children}
            </div>
          </SpaceContext.Provider>
        )}
      </div>
    );
  }

  public updateContainerSize = () => {
    if (this.viewPort) {
      this.viewPort.updateContainerSize();
    }
  };

  private createTransformStyle = () => {
    const viewPort = this.state.contextValue?.viewPort;
    if (viewPort) {
      return {
        transform: `scale(${viewPort.zoomFactor}) translate(${-1 * viewPort.left}px,${-1 * viewPort.top}px)`,
      };
    }
    return undefined;
  };

  private destroyViewPort = () => {
    if (this.viewPort) {
      this.viewPort.destroy();
      this.viewPort = undefined;
    }

    if (this.containerDivRef) {
      this.containerDivRef.removeEventListener('dragstart', this.handleDragStart);
    }

    this.elementSizeChangePoller?.reset();
  };

  private handleDragStart = (e: DragEvent) => {
    // This is the only way I have found that actually suppresses the default
    // handling of dragging on images, which interferes with our panning by
    // having a "ghost image" follow the pointer, across all browsers.
    // See this link for more info:
    // https://stackoverflow.com/questions/3873595/how-to-disable-firefoxs-default-drag-and-drop-on-all-images-behavior-with-jquer
    if (e.target) {
      const tagName = (e.target as any).tagName;
      if (tagName === 'img' || tagName === 'IMG') {
        const interactableId = getInteractableIdMostApplicableToElement(e.target as any);
        const interactable = (interactableId && this.interactableRegistry.get(interactableId)) || undefined;

        // Suppress the drag _unless_ it is within a no pan handling area, then
        // let it happen.
        if (interactable && interactable instanceof NoPanArea) {
          // Intentionally do nothing
        } else {
          e.preventDefault();
        }
      }
    }
  };

  private handleDecideHowToHandlePress = (
    e: MouseEvent | TouchEvent,
    x: ClientPixelUnit,
    y: ClientPixelUnit,
  ): PressHandlingConfig | undefined => {
    const interactableId = getInteractableIdMostApplicableToElement(e.target as any);
    const interactable = (interactableId && this.interactableRegistry.get(interactableId)) || undefined;

    if (e.type === 'mousedown') {
      const elementTagName = e.target && (e.target as any).tagName;
      if (elementTagName === 'a' || elementTagName === 'A') {
        // Prevent dragging on <a> tags since A. the browsers may interpret the
        // drag end as a click on it and B. desktop Safari (possibly others) has
        // its own drag handling for links which conflicts with what we are doing.
        //
        // For my own future reference: the mouse down event gets fired before the
        // impetus library used by pan-zoom fires any events for the pan.
        return { ignorePressEntirely: true };
      }
    }

    if (interactable && interactable instanceof NoPanArea) {
      return { ignorePressEntirely: true };
    } else if (interactable && interactable instanceof Pressable) {
      return interactable.getPressHandlingConfig();
    }
    return undefined;
  };

  private setContainerDivRef = (ref: any) => {
    this.destroyViewPort();
    this.containerDivRef = ref;

    if (this.containerDivRef) {
      this.viewPort = new ViewPort(this.containerDivRef, {
        zoomFactorMax: this.props.zoomFactorMax,
        zoomFactorMin: this.props.zoomFactorMin,
        ...this.pressInterpreter.pressHandlers,
      });

      this.containerDivRef.addEventListener('dragstart', this.handleDragStart);
      this.viewPort.addEventListener('updated', this.handleViewPortUpdated);

      // Polling is optional because it is unnecessary if the only way the div's
      // size will change is with the window itself
      this.elementSizeChangePoller.update(this.containerDivRef, !!this.props.pollForElementResizing);

      const contextValue: SpaceContextType = {
        rootDivUniqueClassName: this.rootDivUniqueClassName,
        registerInteractable: i => this.interactableRegistry.set(i.id, i),
        unregisterInteractable: i => this.interactableRegistry.delete(i.id),
        viewPort: this.viewPort,
      };
      this.setState({
        contextValue,
        transformStyle: this.createTransformStyle(),
      });
    }
  };

  private handleViewPortUpdated = () => {
    this.setState({ transformStyle: this.createTransformStyle() });
  };
}
