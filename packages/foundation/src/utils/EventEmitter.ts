export type Event<T = void> = (listener: (value: T) => void) => () => void;

export class EventEmitter<T = void> {
  private listeners = new Set<(value: T) => void>();

  constructor() {}

  get event(): Event<T> {
    return (listener: (value: T) => void) => {
      this.listeners.add(listener);

      return () => {
        this.listeners.delete(listener);
      };
    };
  }

  emit(value: T): void {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}
