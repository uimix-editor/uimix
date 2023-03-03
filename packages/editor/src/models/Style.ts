import { isEqual } from "lodash-es";
import { StyleJSON } from "@uimix/node-data";
import { defaultStyle } from "@uimix/render";
import { ObservableYMap } from "../utils/ObservableYMap";
import * as Y from "yjs";

export type IStyle = StyleJSON;

export { defaultStyle };

export class PartialStyle implements Partial<IStyle> {
  constructor(data: Y.Map<any>) {
    this.data = ObservableYMap.get(data);
  }
  data: ObservableYMap<any>;

  toJSON() {
    return this.data.toJSON();
  }
  loadJSON(json: Partial<IStyle>) {
    this.data.clear();
    for (const [key, value] of Object.entries(json)) {
      this.data.set(key, value);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PartialStyle extends Partial<IStyle> {}

for (const key of Object.keys(defaultStyle)) {
  Object.defineProperty(PartialStyle.prototype, key, {
    get: function (this: PartialStyle) {
      return this.data.get(key);
    },
    set(this: PartialStyle, value) {
      if (value === undefined) {
        this.data.delete(key);
      } else {
        this.data.set(key, value);
      }
    },
  });
}

export class CascadedStyle implements IStyle {
  constructor(style: PartialStyle, parent: IStyle) {
    this.style = style;
    this.parent = parent;
  }
  style: PartialStyle;
  parent: IStyle;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CascadedStyle extends IStyle {}

for (const key of Object.keys(defaultStyle) as (keyof IStyle)[]) {
  Object.defineProperty(CascadedStyle.prototype, key, {
    get(this: CascadedStyle) {
      if (this.style[key] !== undefined) {
        return this.style[key];
      }
      return this.parent[key];
    },
    set(this: CascadedStyle, value) {
      if (isEqual(value, this.parent[key])) {
        this.style[key] = undefined;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.style[key] = value;
      }
    },
  });
}
