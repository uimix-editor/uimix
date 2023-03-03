import { createAtom } from "mobx";
import * as Y from "yjs";

const instances = new WeakMap<Y.Array<any>, ObservableYArray<any>>();

export class ObservableYArray<V> {
  static get<V>(target: Y.Array<V>): ObservableYArray<V> {
    let map = instances.get(target);
    if (!map) {
      map = new ObservableYArray(target);
      instances.set(target, map);
    }
    return map;
  }

  readonly y: Y.Array<V>;
  readonly _atom = createAtom("ObservableYArray");

  private constructor(y: Y.Array<V>) {
    this.y = y;
    this.y.observe(() => {
      this._atom.reportChanged();
    });
  }

  get length(): number {
    this._atom.reportObserved();
    return this.y.length;
  }

  insert(index: number, content: V[]): void {
    this.y.insert(index, content);
  }

  push(content: V[]): void {
    this.y.push(content);
  }

  unshift(content: V[]): void {
    this.y.unshift(content);
  }

  delete(index: number, length?: number): void {
    this.y.delete(index, length);
  }

  get(index: number): V | undefined {
    this._atom.reportObserved();
    return this.y.get(index);
  }

  toArray(): V[] {
    this._atom.reportObserved();
    return this.y.toArray();
  }

  slice(start?: number, end?: number): V[] {
    this._atom.reportObserved();
    return this.y.slice(start, end);
  }

  [Symbol.iterator](): IterableIterator<V> {
    this._atom.reportObserved();
    return this.y[Symbol.iterator]();
  }

  toJSON(): V[] {
    this._atom.reportObserved();
    return this.y.toJSON();
  }
}
