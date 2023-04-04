export type IDisposable = { dispose(): void } | (() => void);

export class DisposeBag {
  private disposables: IDisposable[] = [];

  add(...disposable: IDisposable[]): void {
    this.disposables.push(...disposable);
  }

  dispose(): void {
    this.disposables.forEach((disposable) => {
      if (typeof disposable === "function") {
        disposable();
      } else {
        disposable.dispose();
      }
    });
    this.disposables = [];
  }
}
