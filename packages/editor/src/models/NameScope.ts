import { observable } from "mobx";
import { getIncrementalUniqueName } from "@seanchas116/paintkit/src/util/Name";

export interface NameSpaceDelegate<T> {
  getName(value: T): string;
  setName(value: T, name: string): void;
  getChildren(value: T): readonly T[];
}

export class NameScope<T> {
  constructor(delegate: NameSpaceDelegate<T>) {
    this.delegate = delegate;
  }

  private readonly delegate: NameSpaceDelegate<T>;
  private readonly layers = observable.map<string, T>();

  add(value: T): void {
    this.addSelf(value);
    for (const child of this.delegate.getChildren(value)) {
      this.add(child);
    }
  }

  private addSelf(value: T): void {
    const oldName = this.delegate.getName(value);
    const name = getIncrementalUniqueName(new Set(this.layers.keys()), oldName);
    this.delegate.setName(value, name);
    this.layers.set(name, value);
  }

  get(name: string): T | undefined {
    return this.layers.get(name);
  }

  rename(value: T, newName: string): void {
    this.deleteSelf(value);
    this.delegate.setName(value, newName);
    this.addSelf(value);
  }

  delete(value: T): void {
    this.deleteSelf(value);
    for (const child of this.delegate.getChildren(value)) {
      this.delete(child);
    }
  }

  private deleteSelf(value: T): void {
    this.layers.delete(this.delegate.getName(value));
  }
}
