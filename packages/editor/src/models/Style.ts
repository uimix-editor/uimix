import { isEqual } from "lodash-es";
import { StyleJSON } from "@uimix/node-data";
import { ObservableYMap } from "../utils/ObservableYMap";

export type IStyle = StyleJSON;

export const defaultStyle: StyleJSON = {
  hidden: false,
  position: {
    x: {
      type: "start",
      start: [0, "px"],
    },
    y: {
      type: "start",
      start: [0, "px"],
    },
  },
  absolute: false,
  width: {
    type: "fixed",
    value: [0, "px"],
  },
  height: {
    type: "fixed",
    value: [0, "px"],
  },

  topLeftRadius: [0, "px"],
  topRightRadius: [0, "px"],
  bottomRightRadius: [0, "px"],
  bottomLeftRadius: [0, "px"],

  fills: [],
  border: null,
  borderTopWidth: [0, "px"],
  borderRightWidth: [0, "px"],
  borderBottomWidth: [0, "px"],
  borderLeftWidth: [0, "px"],

  opacity: 1,
  overflowHidden: false,

  // stack (auto layout)

  layout: "none",
  stackDirection: "x",
  stackAlign: "start",
  stackJustify: "start",
  gap: [0, "px"],
  paddingTop: [0, "px"],
  paddingRight: [0, "px"],
  paddingBottom: [0, "px"],
  paddingLeft: [0, "px"],

  // text

  textContent: "",
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: [16, "px"],
  lineHeight: null,
  letterSpacing: [0, "px"],
  textHorizontalAlign: "start",
  textVerticalAlign: "start",

  // image
  imageHash: null,

  // svg
  svgContent: "",

  // instance
  mainComponent: null,

  // foreign instance
  foreignComponent: null,

  // element
  tagName: null,
};

export abstract class PartialStyle implements Partial<IStyle> {
  abstract get data(): ObservableYMap<unknown> | undefined;
  abstract get dataForWrite(): ObservableYMap<unknown>;

  toJSON(): Partial<IStyle> {
    return this.data?.toJSON() ?? {};
  }
  loadJSON(json: Partial<IStyle>) {
    const data = this.dataForWrite;
    data.clear();
    for (const [key, value] of Object.entries(json)) {
      data.set(key, value);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PartialStyle extends Partial<IStyle> {}

for (const key of Object.keys(defaultStyle)) {
  Object.defineProperty(PartialStyle.prototype, key, {
    get: function (this: PartialStyle) {
      return this.data?.get(key);
    },
    set(this: PartialStyle, value) {
      if (value === undefined) {
        this.data?.delete(key);
      } else {
        this.dataForWrite.set(key, value);
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
