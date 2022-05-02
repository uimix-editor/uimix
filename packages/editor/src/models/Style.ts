import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { kebabCase } from "lodash-es";
import { makeObservable, observable } from "mobx";
import * as postcss from "postcss";

export const styleKeys = [
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",

  "width",
  "minWidth",
  "maxWidth",
  "height",
  "minHeight",
  "maxHeight",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius",

  "color",
  "fontFamily",
  "fontWeight",
  "fontStyle",
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "textDecorationLine",
  "textAlign",

  "backgroundColor",

  "borderTopWidth",
  "borderTopStyle",
  "borderTopColor",
  "borderRightWidth",
  "borderRightStyle",
  "borderRightColor",
  "borderBottomWidth",
  "borderBottomStyle",
  "borderBottomColor",
  "borderLeftWidth",
  "borderLeftStyle",
  "borderLeftColor",
] as const;

export const extraStyleKeys = [
  ...styleKeys,
  "borderRadius",
  "borderWidth",
  "borderStyle",
  "borderColor",
] as const;

export type StyleKey = typeof styleKeys[number];

export type ExtraStyleKey = typeof extraStyleKeys[number];

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

  toPostCSS(defaults?: postcss.RuleProps): postcss.Rule {
    const rule = new postcss.Rule(defaults);

    for (const key of styleKeys) {
      const value = this[key];
      if (value !== undefined) {
        rule.append({
          prop: kebabCase(key),
          value: value,
        });
      }
    }

    return rule;
  }

  loadPostCSS(rule: postcss.Rule): void {
    const props: Record<string, string> = {};
    for (const node of rule.nodes) {
      if (node.type === "decl") {
        props[node.prop] = node.value;
      }
    }

    for (const key of styleKeys) {
      this[key] = props[kebabCase(key)];
    }
  }

  get borderRadius(): string | typeof MIXED | undefined {
    return sameOrMixed(
      (
        [
          "borderTopLeftRadius",
          "borderTopRightRadius",
          "borderBottomRightRadius",
          "borderBottomLeftRadius",
        ] as const
      )
        .map((key) => this[key])
        .filter((value) => value !== undefined)
    );
  }

  set borderRadius(value: string | typeof MIXED | undefined) {
    if (value === MIXED) {
      return;
    }
    this.borderTopLeftRadius = value;
    this.borderTopRightRadius = value;
    this.borderBottomRightRadius = value;
    this.borderBottomLeftRadius = value;
  }

  get borderWidth(): string | typeof MIXED | undefined {
    return sameOrMixed(
      (
        [
          "borderTopWidth",
          "borderRightWidth",
          "borderBottomWidth",
          "borderLeftWidth",
        ] as const
      )
        .map((key) => this[key])
        .filter((value) => value !== undefined)
    );
  }

  set borderWidth(value: string | typeof MIXED | undefined) {
    if (value === MIXED) {
      return;
    }
    this.borderTopWidth = value;
    this.borderRightWidth = value;
    this.borderBottomWidth = value;
    this.borderLeftWidth = value;
  }

  get borderStyle(): string | typeof MIXED | undefined {
    return sameOrMixed(
      (
        [
          "borderTopStyle",
          "borderRightStyle",
          "borderBottomStyle",
          "borderLeftStyle",
        ] as const
      )
        .map((key) => this[key])
        .filter((value) => value !== undefined)
    );
  }

  set borderStyle(value: string | typeof MIXED | undefined) {
    if (value === MIXED) {
      return;
    }
    this.borderTopStyle = value;
    this.borderRightStyle = value;
    this.borderBottomStyle = value;
    this.borderLeftStyle = value;
  }

  get borderColor(): string | typeof MIXED | undefined {
    return sameOrMixed(
      (
        [
          "borderTopColor",
          "borderRightColor",
          "borderBottomColor",
          "borderLeftColor",
        ] as const
      )
        .map((key) => this[key])
        .filter((value) => value !== undefined)
    );
  }

  set borderColor(value: string | typeof MIXED | undefined) {
    if (value === MIXED) {
      return;
    }
    this.borderTopColor = value;
    this.borderRightColor = value;
    this.borderBottomColor = value;
    this.borderLeftColor = value;
  }
}
