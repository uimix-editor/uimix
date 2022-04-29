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
    return {
      color: this.color,
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
      fontSize: this.fontSize,
      lineHeight: this.lineHeight,
      letterSpacing: this.letterSpacing,
      textDecoration: this.textDecoration,
      textStyle: this.textStyle,
      textAlign: this.textAlign,
    };
  }

  loadJSON(json: StyleJSON): void {
    this.color = json.color;
  }

  toCSSString(): string {
    const props = omitEmpties({
      color: this.color,
    });

    return Object.entries(props)
      .map(([key, value]) => `${key}: ${value};`)
      .join("");
  }
}
