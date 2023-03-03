import { createAtom, IAtom } from "mobx";
import * as Y from "yjs";
import { getOrCreate } from "../state/Collection";

const instances = new WeakMap<Y.Map<any>, ObservableYMap<any>>();

export class ObservableYMap<V> {
  static get<V>(target: Y.Map<V>): ObservableYMap<V> {
    let map = instances.get(target);
    if (!map) {
      map = new ObservableYMap(target);
      instances.set(target, map);
    }
    return map;
  }

  readonly y: Y.Map<V>;
  readonly wholeAtom = createAtom("ObservableYMap");
  readonly valueAtoms = new Map<string, IAtom>();

  private getValueAtom(key: string): IAtom {
    return getOrCreate(this.valueAtoms, key, () =>
      createAtom("ObservableYMapValue")
    );
  }

  private constructor(y: Y.Map<V>) {
    this.y = y;
    this.y.observe((event) => {
      for (const [key, detail] of event.keys) {
        // TODO: removed key atoms?
        this.getValueAtom(key).reportChanged();
      }
      this.wholeAtom.reportChanged();
    });
  }

  get size(): number {
    this.wholeAtom.reportObserved();
    return this.y.size;
  }

  set(key: string, value: V): void {
    this.y.set(key, value);
  }

  delete(key: string): void {
    this.y.delete(key);
  }

  get(key: string): V | undefined {
    this.getValueAtom(key).reportObserved();
    return this.y.get(key);
  }

  has(key: string): boolean {
    this.getValueAtom(key).reportObserved();
    return this.y.has(key);
  }

  clear() {
    this.y.clear();
    this.wholeAtom.reportChanged();
  }

  keys(): IterableIterator<string> {
    this.wholeAtom.reportObserved();
    return this.y.keys();
  }

  values(): IterableIterator<V> {
    this.wholeAtom.reportObserved();
    return this.y.values();
  }

  [Symbol.iterator](): IterableIterator<[string, V]> {
    this.wholeAtom.reportObserved();
    return this.y[Symbol.iterator]();
  }

  toJSON(): Record<string, V> {
    this.wholeAtom.reportObserved();
    return this.y.toJSON();
  }
}
