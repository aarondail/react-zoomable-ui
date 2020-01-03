// tslint:disable-next-line: no-implicit-dependencies - Disable this until we get our changes merged into pan-zoom
import panzoom, { PanZoomControl, PanZoomEvent } from 'pan-zoom';

import { clamp, Writeable } from './utils';

// 0,0 as top left of browser window to screenWidth, screenHeight as button right.
export type ClientPixelUnit = number;
// 0,0 as the top left pixel of the virtual space we want to render stuff in, increasing to the bottom right.
export type VirtualSpacePixelUnit = number;
// 2 means 2x zoomed in, 0.5 means 2x zoomed out.
export type ZoomFactor = number;

export interface PressEventCoordinates {
  readonly clientX: ClientPixelUnit;
  readonly clientY: ClientPixelUnit;
  readonly x: VirtualSpacePixelUnit;
  readonly y: VirtualSpacePixelUnit;
}

export interface ZoomFactorMinMaxOptions {
  readonly zoomFactorMax?: ZoomFactor;
  readonly zoomFactorMin?: ZoomFactor;
}

export interface ViewPortOptions extends ZoomFactorMinMaxOptions {
  readonly onPressStart?: (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates) => 'CAPTURE' | undefined;
  readonly onPressMove?: (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates) => 'RELEASE' | undefined;
  readonly onPressEnd?: (e: MouseEvent | TouchEvent, coordinates: PressEventCoordinates) => void;
  /**
   * After a press starts there are some cases where it can be canceled rather
   * than ended. For example when on finger starts touching the screen that
   * will trigger `onPressStart`. If a second finger starts touching the screen
   * though, that will cause the press to be "cancelled". A press is
   * effectively a single finger touch or mouse/track-pad click and drag
   * motion.
   */
  readonly onPressCancelled?: (e: MouseEvent | TouchEvent) => void;
  // readonly onHover?: (x: ClientPixelUnit, y: ClientPixelUnit) => void;
  // readonly onPressContextMenu?: (x: ClientPixelUnit, y: ClientPixelUnit) => void;
}

/**
 * The ViewPort represents a "view" into a virtual space, that is not
 * tied to the available screen space or HTML elements. Because of this, it is
 * infinite, but it also uses its own "units" (virtual space pixels).
 *
 * You can think of the view port as describing what rectangular portion of the
 * virtual space (from top left to bottom right) should be visible inside the
 * bounds of containing HTML element where the virtual space is being rendered.
 */
export class ViewPort {
  private static DivStyle = `
    overflow: hidden;
    margin: 0; padding: 0; height: 100%; width: 100%;
    position: relative;
    ${/* Prevent the user from highlighting while dragging */ ''}
    -webkit-user-select: none;
    ${/* Prevent Mobile Safari from handling long press on images itself */ ''}
    -webkit-touch-callout: none;
    user-select: none;
    ${/* Prevent the user from getting a text input box cursor when hovering over text that can be dragged */ ''}
    cursor: default;
    ${
      /* Touch gestures on edge are not currently working totally correctly.
    Turning this off means, I think, we have to support them, which we mostly
    do ... or at least want to... but don't for things like pinch. Turning it
    off for now, will wait on edge to move to Chrome and revisit. */ ''
    }
    -ms-touch-action: none;
  `;

  // While these public properties APPEAR readonly they are in fact NOT. They
  // are just readonly for consumer's of this class.
  public readonly left: VirtualSpacePixelUnit;
  public readonly top: VirtualSpacePixelUnit;
  public readonly centerX: VirtualSpacePixelUnit;
  public readonly centerY: VirtualSpacePixelUnit;
  public readonly width: VirtualSpacePixelUnit;
  public readonly height: VirtualSpacePixelUnit;
  public readonly zoomFactor: ZoomFactor; // E.g. 2 is zoomed in, 1 is exactly at pixel perfect match to images, and 0.5 is zoomed out.

  public readonly containerWidth: ClientPixelUnit;
  public readonly containerHeight: ClientPixelUnit;

  private containerDiv: HTMLElement;
  private isCurrentPressCaptured: boolean;
  private panZoomControl: PanZoomControl;
  private options?: ViewPortOptions;
  // tslint:disable-next-line:readonly-array
  private updateListeners: Array<() => void>;

  constructor(containerDiv: HTMLDivElement, options?: ViewPortOptions) {
    this.containerDiv = containerDiv;
    this.options = options;
    this.updateListeners = [];

    // Default values
    this.left = 0;
    this.top = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.width = 0;
    this.height = 0;
    this.zoomFactor = 1;
    this.containerWidth = 0;
    this.containerHeight = 0;
    this.isCurrentPressCaptured = false;

    // Set the div's styles
    this.containerDiv.style.cssText = ViewPort.DivStyle;

    // Add event listeners
    this.containerDiv.addEventListener('mousedown', this.handleMouseDown);
    this.containerDiv.addEventListener('mousemove', this.handleMouseMove);
    // Doing this on window to catch it if it goes outside the window
    window.addEventListener('mouseup', this.handleMouseUp);
    this.containerDiv.addEventListener('touchstart', this.handleTouchStart);
    this.containerDiv.addEventListener('touchmove', this.handleTouchMove);
    this.containerDiv.addEventListener('touchend', this.handleTouchEnd);
    // There is no good way to detect whether an individual element is
    // resized. We can only do that at the window level. There are some
    // techniques for tracking element sizes, and we provide an OPTIONAL
    // polling based technique. But since watching for window resizes WILL
    // work for many use cases we do that here, and it shouldn't interfere
    // with any more specific techniques.
    window.addEventListener('resize', this.updateContainerSize);

    // Set up the pan-zoom library
    this.panZoomControl = panzoom(this.containerDiv, this.handlePanZoomEvent);
    this.updateContainerSize();
  }

  public addEventListener(event: 'updated', listener: () => void): void {
    this.updateListeners.push(listener);
  }

  public removeEventListener(event: 'updated', listener: () => void): void {
    const index = this.updateListeners.indexOf(listener);
    if (index >= 0) {
      this.updateListeners.splice(index, 1);
    }
  }

  public destroy(): void {
    this.panZoomControl.destroy();

    this.containerDiv.removeEventListener('mousedown', this.handleMouseDown);
    this.containerDiv.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.containerDiv.removeEventListener('touchstart', this.handleTouchStart);
    this.containerDiv.removeEventListener('touchmove', this.handleTouchMove);
    this.containerDiv.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('resize', this.updateContainerSize);
  }

  public centerFitAreaIntoView(
    left: VirtualSpacePixelUnit,
    top: VirtualSpacePixelUnit,
    width: VirtualSpacePixelUnit,
    height: VirtualSpacePixelUnit,
    options?: ZoomFactorMinMaxOptions,
  ): void {
    const cx = left + width / 2;
    const cy = top + height / 2;
    const zoomFactorBasedOnWidth = this.containerWidth / width;
    const zoomFactorBasedOnHeight = this.containerHeight / height;
    let newZoomFactor = Math.min(zoomFactorBasedOnWidth, zoomFactorBasedOnHeight);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, options);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
    this.recenterView(cx, cy, newZoomFactor);
  }

  public centerFitHorizontalAreaIntoView(
    left: VirtualSpacePixelUnit,
    width: VirtualSpacePixelUnit,
    options?: ZoomFactorMinMaxOptions,
  ): void {
    const cx = left + width / 2;
    let newZoomFactor = this.containerWidth / width;
    newZoomFactor = this.clampZoomFactor(newZoomFactor, options);
    newZoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
    this.updateViewTopLeft(cx - this.width / newZoomFactor / 2, this.top, newZoomFactor);
  }

  public recenterView(
    centerX: VirtualSpacePixelUnit,
    centerY: VirtualSpacePixelUnit,
    newZoomFactor?: ZoomFactor,
  ): void {
    const writableThis = this as Writeable<ViewPort>;
    if (newZoomFactor !== undefined) {
      writableThis.zoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
    }
    writableThis.width = this.containerWidth / this.zoomFactor;
    writableThis.height = this.containerHeight / this.zoomFactor;
    writableThis.centerX = centerX;
    writableThis.centerY = centerY;
    writableThis.left = centerX - this.width / 2;
    writableThis.top = centerY - this.height / 2;

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
  }
  public updateViewTopLeft(left: VirtualSpacePixelUnit, top: VirtualSpacePixelUnit, newZoomFactor?: ZoomFactor): void {
    const writableThis = this as Writeable<ViewPort>;
    if (newZoomFactor !== undefined) {
      writableThis.zoomFactor = this.clampZoomFactor(newZoomFactor, this.options);
    }
    writableThis.width = this.containerWidth / this.zoomFactor;
    writableThis.height = this.containerHeight / this.zoomFactor;
    writableThis.centerX = left + this.width / 2;
    writableThis.centerY = top + this.height / 2;
    writableThis.left = left;
    writableThis.top = top;

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
  }

  /**
   * This should be used when the container div is resized.  By default resizes due
   * to the window itself resizing will be automatically handled, but any other
   * resizes won't be handled (since there isn't a good way to get notified when
   * the div resizes.
   */
  public updateContainerSize = () => {
    const { width, height } = this.containerDiv.getBoundingClientRect();
    if (width === this.containerWidth && height === this.containerHeight) {
      return;
    }

    const writableThis = this as Writeable<ViewPort>;
    writableThis.containerWidth = width;
    writableThis.containerHeight = height;
    writableThis.width = this.containerWidth / this.zoomFactor;
    writableThis.height = this.containerHeight / this.zoomFactor;
    // Keep focus on the top left
    writableThis.centerX = this.left + this.width / 2;
    writableThis.centerY = this.top + this.width / 2;

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
  };

  private clampZoomFactor = (value: ZoomFactor, minMax?: ZoomFactorMinMaxOptions) => {
    if (!minMax) {
      return value;
    }
    let v = value;
    if (minMax && minMax.zoomFactorMin && v < minMax.zoomFactorMin) {
      v = minMax.zoomFactorMin;
    }
    if (minMax && minMax.zoomFactorMax && v > minMax.zoomFactorMax) {
      v = minMax.zoomFactorMax;
    }
    return v;
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (!e.target) {
      return;
    }

    let captured = false;
    if (this.options?.onPressStart) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const x = clientX * this.zoomFactor + this.left;
      const y = clientY * this.zoomFactor + this.top;
      if (this.options?.onPressStart(e, { x, y, clientX, clientY }) === 'CAPTURE') {
        this.panZoomControl.pausePanning();
        this.isCurrentPressCaptured = true;
        captured = true;
      }
    }

    // Just in case we have a lingering capture
    if (!captured && this.isCurrentPressCaptured) {
      this.panZoomControl.resumePanning();
      this.isCurrentPressCaptured = false;
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isCurrentPressCaptured && this.options?.onPressMove) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const x = clientX * this.zoomFactor + this.left;
      const y = clientY * this.zoomFactor + this.top;
      if (this.options?.onPressMove(e, { x, y, clientX, clientY }) === 'RELEASE') {
        this.panZoomControl.resumePanning();
        this.isCurrentPressCaptured = false;
      }
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.isCurrentPressCaptured && this.options?.onPressEnd) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const x = clientX * this.zoomFactor + this.left;
      const y = clientY * this.zoomFactor + this.top;
      this.options?.onPressEnd(e, { x, y, clientX, clientY });
    }

    if (this.isCurrentPressCaptured) {
      this.panZoomControl.resumePanning(true);
      this.isCurrentPressCaptured = false;
    }
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      let captured = false;
      if (this.options?.onPressStart) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const x = clientX * this.zoomFactor + this.left;
        const y = clientY * this.zoomFactor + this.top;
        if (this.options?.onPressStart(e, { x, y, clientX, clientY }) === 'CAPTURE') {
          e.preventDefault();
          this.panZoomControl.pausePanning();
          this.isCurrentPressCaptured = true;
          captured = true;
        }
      }

      // Just in case we have a lingering capture
      if (!captured && this.isCurrentPressCaptured) {
        this.panZoomControl.resumePanning();
        this.isCurrentPressCaptured = false;
      }
    } else if (e.touches.length >= 1 && this.isCurrentPressCaptured) {
      this.panZoomControl.resumePanning();
      this.isCurrentPressCaptured = false;
      this.options?.onPressCancelled?.(e);
    }
  };

  // tslint:disable-next-line: no-empty
  private handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      if (this.isCurrentPressCaptured && this.options?.onPressMove) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const x = clientX * this.zoomFactor + this.left;
        const y = clientY * this.zoomFactor + this.top;
        if (this.options?.onPressMove(e, { x, y, clientX, clientY }) === 'RELEASE') {
          this.panZoomControl.resumePanning();
          this.isCurrentPressCaptured = false;
        }
      }
    }
  };

  // tslint:disable-next-line: no-empty
  private handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      if (this.isCurrentPressCaptured && this.options?.onPressEnd) {
        const clientX = e.changedTouches[0].clientX;
        const clientY = e.changedTouches[0].clientY;
        const x = clientX * this.zoomFactor + this.left;
        const y = clientY * this.zoomFactor + this.top;
        this.options?.onPressEnd(e, { x, y, clientX, clientY });
      }

      if (this.isCurrentPressCaptured) {
        this.panZoomControl.resumePanning();
        this.isCurrentPressCaptured = false;
      }
    }
  };

  private handlePanZoomEvent = (e: PanZoomEvent) => {
    const writableThis = this as Writeable<ViewPort>;

    let zoomFactor = this.zoomFactor;
    if (e.dz !== 0) {
      if (e.type === 'mouse') {
        zoomFactor = (this.containerHeight * this.zoomFactor) / (this.containerHeight + e.dz * 2);
      } else if (e.type === 'touch') {
        // This logic is the same as the touch one above (which handles mouse
        // wheels) but I wanted to keep it separate in case we want to tweak it.
        //
        // The thing is, this logic seems fine for the mouse wheel but for touch
        // and pinch gestures I know the logic is not perfect here. It does a
        // decent job of keeping the areas that the user touched underneath
        // their fingers as they pinch or spread. 2 is just a magic number,
        // don't think much about it. A better way to do this might be to get
        // the finger positions (and track the old ones) and use that to make
        // sure the coordinates under both fingers (in the virtual space) stayed
        // the same... but at the same time that would have to factor in stuff
        // like using 2 fingers to drag so I am not sure that is easy... or
        // possible.
        zoomFactor = (this.containerHeight * this.zoomFactor) / (this.containerHeight + e.dz * 2);
      }
      zoomFactor = clamp(zoomFactor, this.options?.zoomFactorMin || 0.01, this.options?.zoomFactorMax || 10);
    }

    let virtualSpaceCenterX: VirtualSpacePixelUnit;
    let virtualSpaceCenterY: VirtualSpacePixelUnit;

    // Basic pan handling
    virtualSpaceCenterX = this.left + (-1 * e.dx) / zoomFactor;
    virtualSpaceCenterY = this.top + (-1 * e.dy) / zoomFactor;

    // Zoom BUT keep the view coordinate under the mouse pointer CONSTANT
    const oldVirtualSpaceVisibleSpaceWidth = this.containerWidth / this.zoomFactor;
    const oldVirtualSpaceVisibleSpaceHeight = this.containerHeight / this.zoomFactor;
    writableThis.width = this.containerWidth / zoomFactor;
    writableThis.height = this.containerHeight / zoomFactor;
    writableThis.zoomFactor = zoomFactor;

    const virtualSpaceVisibleWidthDelta = this.width - oldVirtualSpaceVisibleSpaceWidth;
    const virtualSpaceVisibleHeightDelta = this.height - oldVirtualSpaceVisibleSpaceHeight;

    // The reason we use x and y here is to zoom in or out towards where the
    // pointer is positioned
    const xFocusPercent = e.x / this.containerWidth;
    const yFocusPercent = e.y / this.containerHeight;

    writableThis.left = virtualSpaceCenterX - virtualSpaceVisibleWidthDelta * xFocusPercent;
    writableThis.top = virtualSpaceCenterY - virtualSpaceVisibleHeightDelta * yFocusPercent;
    writableThis.centerX = virtualSpaceCenterX + this.width / 2;
    writableThis.centerY = virtualSpaceCenterY + this.height / 2;

    if (this.updateListeners) {
      for (const listener of this.updateListeners) {
        listener();
      }
    }
  };
}
