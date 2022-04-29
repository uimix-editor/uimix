import { omitEmpties } from "@seanchas116/paintkit/src/util/Collection";
import { makeObservable, observable } from "mobx";

const styleKeys = [
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

export type StyleJSON = {
  [key in typeof styleKeys[number]]?: string;
};

const StyleBase: {
  new (): StyleJSON;
} = class {
  constructor() {
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
      .map(([key, value]) => `${key}: ${value};`)
      .join("");
  }
}
