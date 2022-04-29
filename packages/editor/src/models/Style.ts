import { omitEmpties } from "@seanchas116/paintkit/src/util/Collection";
import { kebabCase } from "lodash-es";
import { makeObservable, observable } from "mobx";

export const styleKeys = [
  "color",
  "fontFamily",
  "fontWeight",
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "textDecoration",
  "textStyle",
  "textAlign",
] as const;

export type StyleKey = typeof styleKeys[number];

export type StyleJSON = {
  [key in StyleKey]?: string;
};

const StyleBase: {
  new (): StyleJSON;
} = class {
  constructor() {
    for (const key of styleKeys) {
      // @ts-ignore
      this[key] = undefined;
    }
    makeObservable(
      this,
      // @ts-ignore
      Object.fromEntries(styleKeys.map((key) => [key, observable]))
    );
  }
};

export class Style extends StyleBase {
  // Text

  toJSON(): StyleJSON {
    return Object.fromEntries(styleKeys.map((key) => [key, this[key]]));
  }

  loadJSON(json: StyleJSON): void {
    for (const key of styleKeys) {
      this[key] = json[key];
    }
  }

  toCSSString(): string {
    const props = omitEmpties(this.toJSON());
    return Object.entries(props)
      .map(([key, value]) => `${kebabCase(key)}: ${value};`)
      .join("");
  }
}
