export class ElementSizeChangePoller {
  private element?: HTMLDivElement;
  private timerId?: any;
  private polling: boolean;
  private oldSize?: ClientRect;

  public constructor(private readonly onSizeChanged: () => void) {
    this.polling = false;
  }

  public reset() {
    this.update(undefined, false);
  }

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
