/**
 * This class simply takes an element, records its size, and then polls it for
 * size changes every 500 ms. If a size change is detected the onSizeChanged
 * callback is called.
 */
export class ElementSizeChangePoller {
  private element?: HTMLDivElement;
  private timerId?: any;
  private polling: boolean;
  private oldSize?: ClientRect;

  /**
   * Constructs a new instance, but initially it won't know which element to
   * watch. You have to call `update` to pass it the element.
   *
   * @param onSizeChanged Callback to call when a watched element's size changes.
   */
  public constructor(private readonly onSizeChanged: () => void) {
    this.polling = false;
  }

  /**
   * Stops polling and clears the element that was being watched.
   */
  public reset() {
    this.update(undefined, false);
  }

  /**
   * Changes the element being watched and starts or stops polling for size
   * changes.
   */
  public update(element: HTMLDivElement | undefined, polling: boolean) {
    this.element = element;
    this.polling = polling;
    this.stop();

    if (this.element && this.polling) {
      this.start();
    }
  }

  private start = () => {
    // Just in case...
    if (this.timerId) {
      this.stop();
    }
    this.oldSize = this.element?.getBoundingClientRect();
    this.timerId = setInterval(() => {
      if (!this.element || !this.oldSize) {
        return;
      }
      const { width, height } = this.element.getBoundingClientRect();
      if (width !== this.oldSize.width || height !== this.oldSize.height) {
        this.onSizeChanged();
      }
    }, 500);
  };

  private stop = () => {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.timerId = undefined;
  };
}
