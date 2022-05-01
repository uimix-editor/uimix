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
}
