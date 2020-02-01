import * as React from 'react';

import { ElementSizeChangePoller } from './ElementSizeChangePoller';
import { getInteractableIdMostApplicableToElement, InteractableComponent } from './Interactable';
import { NoPanArea } from './NoPanArea';
import { Pressable } from './Pressable';
import { DecidePressHandlingCallback, PressHandlingOptions, PressInterpreter } from './PressInterpreter';
import { SpaceContext, SpaceContextType } from './SpaceContext';
import { browserIsAndroid, generateRandomId, Writeable } from './utils';
import { PressEventCoordinates, ViewPort } from './ViewPort';

export interface SpaceProps {
  readonly id?: string;
  readonly className?: string;
  readonly debugEvents?: boolean;
  readonly style?: React.CSSProperties;
  readonly contentDivClassName?: string;
  readonly contentDivStyle?: React.CSSProperties;
  readonly pollForElementResizing?: boolean;

  readonly onCreate?: (viewPort: ViewPort) => void;
  readonly onUpdated?: (viewPort: ViewPort) => void;

  readonly onDecideHowToHandlePress?: DecidePressHandlingCallback;
  readonly onHover?: (e: MouseEvent, coordinates: PressEventCoordinates) => void;
  readonly onPressContextMenu?: (e: MouseEvent, coordinates: PressEventCoordinates) => void;
}

interface SpaceState {
  readonly contextValue?: SpaceContextType;
  readonly transformStyle?: React.CSSProperties;
}

/**
 * This component is (by default) absolute positioned to fill its parent, so
 * you should place it in a container with `position: relative`.
 */
export class Space extends React.PureComponent<SpaceProps, SpaceState> {
  // This is not really readonly but we want to make it appear that way for code
  // using this library
  public readonly viewPort?: ViewPort;

  private readonly rootDivUniqueClassName = `react-zoomable-ui-${generateRandomId()}`;

  private readonly constantStyles = `
.${this.rootDivUniqueClassName} {
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  cursor: default;
}

.${this.rootDivUniqueClassName} > .react-zoomable-ui-content-div {
  margin: 0; padding: 0; 
  transform-origin: 0% 0%;
  min-height: 100%;
  width: 100%;
}
`;

  private containerDivRef?: HTMLDivElement;
  private currentHoveredPressable?: Pressable;
  private elementSizeChangePoller: ElementSizeChangePoller;
  private readonly interactableRegistry: Map<string, InteractableComponent>;
  private readonly pressInterpreter: PressInterpreter;

  public constructor(props: SpaceProps) {
    super(props);
    this.interactableRegistry = new Map();
    this.state = {};

    this.pressInterpreter = new PressInterpreter(this.handleDecideHowToHandlePress, { debugEvents: props.debugEvents });
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
    let transformedDivStyle = this.state.transformStyle;
    if (this.props.contentDivStyle) {
      transformedDivStyle = { ...transformedDivStyle, ...this.props.contentDivStyle };
    }
    return (
      <div
        ref={this.setContainerDivRefAndCreateViewPort}
        id={this.props.id}
        className={`react-zoomable-ui-container-div ${this.rootDivUniqueClassName} ${this.props.className || ''}`}
        style={this.props.style}
      >
        <style>{this.constantStyles}</style>
        {this.state.contextValue && (
          <SpaceContext.Provider value={this.state.contextValue}>
            <div
              className={`react-zoomable-ui-content-div ${this.props.contentDivClassName || ''}`}
              style={transformedDivStyle}
            >
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
    if (this.viewPort) {
      return {
        transform: `scale(${this.viewPort.zoomFactor}) translate(${-1 * this.viewPort.left}px,${-1 *
          this.viewPort.top}px)`,
      };
    }
    return undefined;
  };

  private destroyViewPort = () => {
    if (this.viewPort) {
      this.viewPort.destroy();
      (this as Writeable<Space>).viewPort = undefined;
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
    //
    // This additionally prevents another weird-o case of double clicking to
    // select text in Desktop Safari and then long clicking and dragging. This
    // will enter some sorta drag state where all the text is being dragged.
    // This is bad and it also conflicts with our <Pressable> components.
    if (e.target) {
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
  };

  private handleDecideHowToHandlePress = (
    e: MouseEvent | TouchEvent,
    coordinates: PressEventCoordinates,
  ): PressHandlingOptions | undefined => {
    if (this.props.onDecideHowToHandlePress) {
      const result = this.props.onDecideHowToHandlePress(e, coordinates);
      if (result) {
        return result;
      }
    }

    const interactableId = getInteractableIdMostApplicableToElement(e.target as any);
    const interactable = (interactableId && this.interactableRegistry.get(interactableId)) || undefined;

    if (e.type === 'mousedown') {
      const elementTagName = ((e.target && (e.target as any).tagName) || '').toLowerCase();
      if (elementTagName === 'a' || elementTagName === 'button') {
        // Prevent dragging on these elements A. the browsers may interpret the
        // drag end as a click on it and B. desktop Safari (possibly others) has
        // its own drag handling for links which conflicts with what we are
        // doing.
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

  private handleHover = (e: MouseEvent, coordinates: PressEventCoordinates) => {
    const interactableId = getInteractableIdMostApplicableToElement(e.target as any);
    const interactable = (interactableId && this.interactableRegistry.get(interactableId)) || undefined;
    if (interactable && interactable instanceof Pressable) {
      if (interactable !== this.currentHoveredPressable) {
        this.currentHoveredPressable = interactable;
        this.currentHoveredPressable.setHovered(true);
      }
    } else if (this.currentHoveredPressable) {
      this.currentHoveredPressable.setHovered(false);
      this.currentHoveredPressable = undefined;
    }

    if (this.props.onHover) {
      this.props.onHover(e, coordinates);
    }
  };

  private handlePressContextMenu = (e: MouseEvent, coordinates: PressEventCoordinates) => {
    const interactableId = getInteractableIdMostApplicableToElement(e.target as any);
    const interactable = (interactableId && this.interactableRegistry.get(interactableId)) || undefined;

    if (interactable && interactable instanceof Pressable && interactable.props.onPressContextMenu) {
      interactable.props.onPressContextMenu(coordinates);
      e.preventDefault();
      return;
    }

    if (this.props.onPressContextMenu) {
      this.props.onPressContextMenu(e, coordinates);
      e.preventDefault();
      return;
    }

    // We have to prevent default this in a few cases on Android because it can
    // interfere w/ panning
    if (browserIsAndroid) {
      if (interactable && interactable instanceof NoPanArea) {
        // Don't do anything
      } else {
        e.preventDefault();
      }
      return;
    }
  };

  private handleViewPortUpdated = () => {
    this.setState({ transformStyle: this.createTransformStyle() });
    if (this.viewPort) {
      this.props.onUpdated?.(this.viewPort);
    }
  };

  private setContainerDivRefAndCreateViewPort = (ref: any) => {
    this.destroyViewPort();
    this.containerDivRef = ref;

    if (this.containerDivRef) {
      (this as Writeable<Space>).viewPort = new ViewPort(this.containerDivRef, {
        debugEvents: this.props.debugEvents,
        onHover: this.handleHover,
        onPressContextMenu: this.handlePressContextMenu,
        onUpdated: this.handleViewPortUpdated,
        ...this.pressInterpreter.pressHandlers,
      });

      this.props.onCreate?.(this.viewPort!);

      this.containerDivRef.addEventListener('dragstart', this.handleDragStart);

      // Polling is optional because it is unnecessary if the only way the div's
      // size will change is with the window itself
      this.elementSizeChangePoller.update(this.containerDivRef, !!this.props.pollForElementResizing);

      const contextValue: SpaceContextType = {
        rootDivUniqueClassName: this.rootDivUniqueClassName,
        registerInteractable: i => this.interactableRegistry.set(i.id, i),
        unregisterInteractable: i => this.interactableRegistry.delete(i.id),
        viewPort: this.viewPort!,
      };

      this.setState({
        contextValue,
        transformStyle: this.createTransformStyle(),
      });
    }
  };
}
