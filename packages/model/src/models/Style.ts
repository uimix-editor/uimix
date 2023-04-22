import { isEqual } from "lodash-es";
import * as Data from "../data/v1";
import { ObjectData } from "./ObjectData";

export type IStyle = Data.StyleJSON;

export const defaultStyle: Data.StyleJSON = {
  hidden: false,
  locked: false,
  position: {
    x: {
      type: "start",
      start: 0,
    },
    y: {
      type: "start",
      start: 0,
    },
  },
  absolute: false,
  width: {
    type: "fixed",
    value: 0,
  },
  height: {
    type: "fixed",
    value: 0,
  },

  topLeftRadius: 0,
  topRightRadius: 0,
  bottomRightRadius: 0,
  bottomLeftRadius: 0,

  fills: [],
  border: null,
  borderTopWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 0,

  opacity: 1,
  overflowHidden: false,

  shadows: [],

  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,

  // stack (auto layout)

  layout: "none",
  flexDirection: "x",
  flexAlign: "start",
  flexJustify: "start",
  gridColumnCount: null,
  gridRowCount: null,
  rowGap: 0,
  columnGap: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,

  // text

  textContent: "",
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: null,
  letterSpacing: 0,
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

export const styleKeys = Object.keys(defaultStyle) as (keyof Data.StyleJSON)[];

export abstract class PartialStyle implements Partial<IStyle> {
  abstract data: ObjectData<Data.StyleJSON>;

  toJSON(): Partial<Data.StyleJSON> {
    return this.data.toJSON();
  }
  loadJSON(json: Partial<Data.StyleJSON>) {
    this.data.loadJSON(json);
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PartialStyle extends Partial<IStyle> {}

for (const key of styleKeys) {
  Object.defineProperty(PartialStyle.prototype, key, {
    get: function (this: PartialStyle) {
      return this.data.get(key);
    },
    set(this: PartialStyle, value: Data.StyleJSON[keyof Data.StyleJSON]) {
      this.data.set({ [key]: value });
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

  loadJSON(json: Partial<Data.StyleJSON>) {
    for (const [key, value] of Object.entries(json)) {
      if (key in this && value !== undefined) {
        // @ts-ignore
        this[key] = value;
      }
    }
  }

  toJSON(): Partial<Data.StyleJSON> {
    const ret: Partial<Data.StyleJSON> = {};

    for (const key of styleKeys) {
      if (!isEqual(this[key], defaultStyle[key])) {
        // @ts-ignore
        ret[key] = this[key];
      }
    }
    return ret;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CascadedStyle extends IStyle {}

for (const key of styleKeys) {
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
