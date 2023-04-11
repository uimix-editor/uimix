import * as Y from "yjs";
import { ObservableYMap } from "@uimix/foundation/src/utils/ObservableYMap";
import { getOrCreate } from "@uimix/foundation/src/utils/Collection";
import { isEqual } from "lodash-es";

export class ObjectData<T extends Record<string, unknown>> {
  readonly id: string;
  readonly dataMap: ObservableYMap<Y.Map<T[keyof T]>>;

  constructor(id: string, dataMap: ObservableYMap<Y.Map<T[keyof T]>>) {
    this.id = id;
    this.dataMap = dataMap;
  }

  get data(): ObservableYMap<T[keyof T]> | undefined {
    return ObservableYMap.get(this.dataMap.get(this.id));
  }

  get dataForWrite(): ObservableYMap<T[keyof T]> {
    return ObservableYMap.get(
      getOrCreate(this.dataMap, this.id, () => new Y.Map())
    );
  }

  get<K extends keyof T & string>(name: K): T[K] | undefined {
    return this.data?.get(name) as T[K] | undefined;
  }

  set(values: Partial<T>) {
    const { data, dataForWrite } = this;

    for (const [key, value] of Object.entries(values)) {
      if (isEqual(data?.get(key), value)) {
        continue;
      }

      if (value === undefined) {
        data?.delete(key);
      } else {
        dataForWrite.set(key, value as T[keyof T]);
      }
    }
  }

  // set<K extends keyof T & string>(name: K, value: T[K] | undefined) {
  //   if (isEqual(this.get(name), value)) {
  //     return;
  //   }

  //   if (value === undefined) {
  //     this.data?.delete(name);
  //   } else {
  //     this.dataForWrite.set(name, value);
  //   }
  // }

  toJSON(): Partial<T> {
    return (this.data?.toJSON() as Partial<T>) ?? {};
  }

  loadJSON(json: Partial<T>) {
    const data = this.dataForWrite;
    data.clear();
    for (const [key, value] of Object.entries(json)) {
      data.set(key, value as T[keyof T]);
    }
  }
}
