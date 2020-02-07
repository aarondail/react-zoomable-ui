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
  /**
   * Optional id to use on the outer `div` that the [[Space]] renders.
   */
  readonly id?: string;
  /**
   * Optional CSS class to use on the outer `div` that the [[Space]] renders.
   */
  readonly className?: string;
  /** @internalapi */
  readonly debugEvents?: boolean;
  /**
   * Optional styles to set on the outer `div` that the [[Space]] renders.
   */
  readonly style?: React.CSSProperties;
  /**
   * Optional CSS class to use on the inner `div` that the [[Space]] scales and
   * transforms.
   */
  readonly innerDivClassName?: string;
  /**
   * Optional styles class to use on the inner `div` that the [[Space]] scales
   * and transforms.
   */
  readonly innerDivStyle?: React.CSSProperties;
  /**
   * If set, the `Space` will poll every 500ms for changes to its parent element's size. This only has to be used if the
   * parent element can resize for reasons other than the window resizing, and if the [[updateSize]] is not used.
   */
  readonly pollForElementResizing?: boolean;

  /**
   * Called when the `Space` first creates the outer `div` and sets up the
   * [[ViewPort]], but before the inner `div` and the `Space's children have
   * been first rendered. This can be used, for example, to make the
   * [[ViewPort]] focus on a certain portion of the virtual space.
   */
  readonly onCreate?: (viewPort: ViewPort) => void;
  /**
   * Called whenever the [[ViewPort]] is updated.
   */
  readonly onUpdated?: (viewPort: ViewPort) => void;

  /**
   * Optional callback to be called when a press is initiated in the space.
   * Generally you should prefer to use [[Pressable]] to handle presses, but
   * this can be used as a lower level alternative. The result of the callback
   * is a [[PressHandlingOptions]] (or `undefined`) that describes how the
   * press should be handled.
   *
   * If the callback returns a [[PressHandlingOptions]] it will take precedence
   * over [[Pressable]] and [[NoPanArea]] components (even if the press was on
   * one of those).
   */
  readonly onDecideHowToHandlePress?: DecidePressHandlingCallback;
  /**
   * Called when a mouse hover event happens anywhere in the [[Space]].
   */
  readonly onHover?: (e: MouseEvent, coordinates: PressEventCoordinates) => void;
  /**
   * Called when a right click event happens anywhere in the [[Space]].
   *
   * @returns Whether to prevent (`true`) a [[Pressable]] from also handling
   * this event (if it was also the target).
   *
   */
  readonly onPressContextMenu?: (e: MouseEvent, coordinates: PressEventCoordinates) => void | boolean | undefined;
}

interface SpaceState {
  readonly contextValue?: SpaceContextType;
  readonly transformStyle?: React.CSSProperties;
}

/**
 * This component makes its children zoomable and pan-able.
 *
 * ## Examples
 *
 * Taking over the entire window:
 *
 * ```css
 * // ...and any other elements between the body and the Space...
 * html, body {
 *   height: 100%;
 *   width: 100%;
 * }
 * ```
 * &nbsp;
 * ```javascript
 * return (
 *   <div style={{height: '100%', position: 'relative'}}>
 *     <Space>
 *      <h1>Example</h1>
 *      <span>You can pan and zoom this text</span>
 *     </Space>
 *   </div>
 * );
 * ```
 *
 * Showing an image in a fixed size area:
 *
 * ```javascript
 * const imageWidth = 1280;
 * const imageHeight = 960;
 *
 * return (
 *   <div style={{ width: 300, height: 300, position: "relative" }}>
 *     <Space
 *       style={{ border: "solid 1px black" }}
 *       onCreate={viewPort => {
 *         viewPort.setBounds({ x: [0, imageWidth], y: [0, imageHeight] });
 *         viewPort.camera.centerFitAreaIntoView({
 *           left: 0,
 *           top: 0,
 *           width: imageWidth,
 *           height: imageHeight
 *         });
 *       }}
 *     >
 *       <img src="mountain.png" width={imageWidth} height={imageHeight} alt="A Mountain" />
 *     </Zoomable.Space>
 *   </div>
 * );
 * ```
 *
 * ## How it works
 *
 * The `Space` component renders its children wrapped in two `div`s, an outer
 * one and an inner one. The inner `div` is moved and scaled using CSS
 * transforms inside the outer `div`.
 *
 * This is done by using a [[ViewPort]] instance, which decides what portion of
 * the inner `div` (and its children) to display inside the bounds of the outer
 * `div`. The [[ViewPort]] creates a virtual coordinate space for the inner
 * `div` to be placed in, and the CSS transforms (mentioned above) translate
 * the visible portion of the virtual coordinate space into the space occupied
 * by the outer `div`.
 *
 * The [[ViewPort]] also does the lower-level work of handling zooming and
 * panning, provides access to the [[ViewPortCamera]] for changing what portion
 * of the inner `div` / the virtual coordinate space is visible, and provides
 * other functionality like setting the boundaries of the virtual coordinate
 * space.
 *
 * Components inside a `Space`, at any depth, may use the [[SpaceContext]] to
 * get access to the [[ViewPort]]. It can also be accessed via the [[viewPort]]
 * property on the `Space` itself.
 *
 * ## Sizing
 *
 * The outer `div` rendered by the `Space` component is *absolutely positioned*
 * to take up all available space from its parent element. This can be
 * overridden (with your own CSS rules or styles) but if you don't do that you
 * probably should make sure its parent element has `position: relative` in its
 * styles. One exception to that would be if you intend for the `Space` to
 * cover the entire page, in which case it doesn't matter.
 *
 * Also, note that by default the parent element will not get sized based on
 * its `Space` child. This means that if the parent's size would be based on
 * its children (e.g. its a simple `<div>` with no specific styling), it may
 * end up with a height of 0. In which case the Space will also have a height
 * of 0. You can give the parent element a fixed size or use Flexbox, `height:
 * 100%`, or any other means to make the parent take up space on its own.
 *
 * For sizing to work well, `Space` probably should be the only child of its
 * parent element.
 *
 * For more details [Sizing](../docs/Sizing.md).
 *
 * ## Resizing
 *
 * `Space` will not automatically detect when the parent element resizes in all
 * cases. Window resizes will be detected, but if there are other cases where
 * resizing happens, the `Space` must be either manually told about it via a
 * call to the [[updateSize]] method, or by setting the
 * [[pollForElementResizing]] prop to true.
 *
 * If this is not done the dimensions of the `ViewPort` may be off, and certain
 * behavior like zooming may behave oddly.
 *
 * Though, just to say it again, if the only time the parent element resizes is
 * when the window itself resizes, it will detect that automatically.
 *
 * ## Props
 *
 * See [[SpaceProps]].
 */
export class Space extends React.PureComponent<SpaceProps, SpaceState> {
  /**
   * Describes what portion of the virtual coordinate space is visible inside
   * the `Space`, and, among other things, provides access to the
   * [[ViewPortCamera]] which can change that.
   *
   * This is not created until after the component has been mounted, so use the
   * [[onCreate]] prop if you need to manipulate it before the children of the
   * `Space` are first rendered. The [[onUpdate]] prop can be used to listen
   * for changes.
   */
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

.${this.rootDivUniqueClassName} > .react-zoomable-ui-inner-div {
  margin: 0; padding: 0; 
  transform-origin: 0% 0%;
  min-height: 100%;
  width: 100%;
}
`;

  private outerDivRef?: HTMLDivElement;
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
    this.elementSizeChangePoller = new ElementSizeChangePoller(this.updateSize);
  }

  /** @internalapi */
  public componentDidUpdate(prevProps: SpaceProps) {
    if (this.props.pollForElementResizing !== prevProps.pollForElementResizing) {
      this.elementSizeChangePoller.update(this.outerDivRef, !!this.props.pollForElementResizing);
    }
  }

  /** @internalapi */
  public componentWillUnmount() {
    this.destroyViewPort();
  }
  /** @internalapi */
  public render() {
    let transformedDivStyle = this.state.transformStyle;
    if (this.props.innerDivStyle) {
      transformedDivStyle = { ...transformedDivStyle, ...this.props.innerDivStyle };
    }
    return (
      <div
        ref={this.setOuterDivRefAndCreateViewPort}
        id={this.props.id}
        className={`react-zoomable-ui-outer-div ${this.rootDivUniqueClassName} ${this.props.className || ''}`}
        style={this.props.style}
      >
        <style>{this.constantStyles}</style>
        {this.state.contextValue && (
          <SpaceContext.Provider value={this.state.contextValue}>
            <div
              className={`react-zoomable-ui-inner-div ${this.props.innerDivClassName || ''}`}
              style={transformedDivStyle}
            >
              {this.props.children}
            </div>
          </SpaceContext.Provider>
        )}
      </div>
    );
  }

  /**
   * This should be called in some cases to tell the `Space` that its parent
   * element has resized. See the section on [[Sizing]] above for more info.
   */
  public updateSize = () => {
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

    if (this.outerDivRef) {
      this.outerDivRef.removeEventListener('dragstart', this.handleDragStart);
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
    if (this.props.onPressContextMenu) {
      const result = this.props.onPressContextMenu(e, coordinates);
      e.preventDefault();
      if (result) {
        return;
      }
    }

    const interactableId = getInteractableIdMostApplicableToElement(e.target as any);
    const interactable = (interactableId && this.interactableRegistry.get(interactableId)) || undefined;

    if (interactable && interactable instanceof Pressable && interactable.props.onPressContextMenu) {
      interactable.props.onPressContextMenu(coordinates);
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

  private setOuterDivRefAndCreateViewPort = (ref: any) => {
    this.destroyViewPort();
    this.outerDivRef = ref;

    if (this.outerDivRef) {
      (this as Writeable<Space>).viewPort = new ViewPort(this.outerDivRef, {
        debugEvents: this.props.debugEvents,
        onHover: this.handleHover,
        onPressContextMenu: this.handlePressContextMenu,
        onUpdated: this.handleViewPortUpdated,
        ...this.pressInterpreter.pressHandlers,
      });

      this.props.onCreate?.(this.viewPort!);

      this.outerDivRef.addEventListener('dragstart', this.handleDragStart);

      // Polling is optional because it is unnecessary if the only way the div's
      // size will change is with the window itself
      this.elementSizeChangePoller.update(this.outerDivRef, !!this.props.pollForElementResizing);

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
