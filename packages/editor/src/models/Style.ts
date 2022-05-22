import { replaceCSSVariables } from "@seanchas116/paintkit/src/util/CSS";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { stripQuotes } from "@seanchas116/paintkit/src/util/String";
import { camelCase, kebabCase } from "lodash-es";
import { makeObservable, observable } from "mobx";
import * as postcss from "postcss";

export const textStyleKeys = [
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

export const imageStyleKeys = ["objectFit"] as const;

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

  "alignSelf",
  "flexGrow",
  "flexShrink",
  "flexBasis",

  "display",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "flexDirection",
  "flexWrap",
  "alignItems",
  "justifyContent",
  "rowGap",
  "columnGap",

  ...textStyleKeys,
  ...imageStyleKeys,

  "background",

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

  "opacity",
] as const;

export const extraStyleKeys = [
  ...styleKeys,
  "borderRadius",
  "borderWidth",
  "borderStyle",
  "borderColor",
] as const;

const extraStyleKeySet = new Set(extraStyleKeys);

export type StyleKey = typeof styleKeys[number];

export type ExtraStyleKey = typeof extraStyleKeys[number];

export type StyleProps = {
  [key in StyleKey]?: string;
};

const StyleBase: {
  new (): StyleProps;
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

export interface StyleJSON {
  props: StyleProps;
  customProps: Record<string, string>;
}

export class Style extends StyleBase {
  readonly customProps = observable.map<string, string>();

  toJSON(): StyleJSON {
    return {
      props: Object.fromEntries(styleKeys.map((key) => [key, this[key]])),
      customProps: Object.fromEntries(this.customProps),
    };
  }

  loadJSON(json: StyleJSON): void {
    for (const key of styleKeys) {
      this[key] = json.props[key];
    }
    this.customProps.replace(new Map(Object.entries(json.customProps)));
  }

  toString(): string {
    const rules: string[] = [];

    for (const key of styleKeys) {
      const value = this[key];
      if (value !== undefined) {
        rules.push(`${kebabCase(key)}:${value};`);
      }
    }
    for (const [key, value] of this.customProps) {
      rules.push(`${key}:${value};`);
    }
    return rules.join("");
  }

  loadString(styleString: string): void {
    const root = postcss.parse(styleString);
    this.loadPostCSS(root);
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
    for (const [key, value] of this.customProps) {
      rule.append({
        prop: key,
        value,
      });
    }

    return rule;
  }

  loadPostCSS(rule: postcss.Rule | postcss.Root): void {
    for (const child of rule.nodes) {
      if (child.type === "decl") {
        if (child.prop.startsWith("--")) {
          this.customProps.set(child.prop, child.value);
        } else {
          const key = camelCase(child.prop) as ExtraStyleKey;
          if (extraStyleKeySet.has(key)) {
            this[key] = child.value;
          }
        }
      }
    }
  }

  get borderRadius(): string | typeof MIXED | undefined {
    return sameOrMixed([
      this.borderTopLeftRadius,
      this.borderTopRightRadius,
      this.borderBottomRightRadius,
      this.borderBottomLeftRadius,
    ]);
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
    return sameOrMixed([
      this.borderTopWidth,
      this.borderRightWidth,
      this.borderBottomWidth,
      this.borderLeftWidth,
    ]);
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
    return sameOrMixed([
      this.borderTopStyle,
      this.borderRightStyle,
      this.borderBottomStyle,
      this.borderLeftStyle,
    ]);
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
    return sameOrMixed([
      this.borderTopColor,
      this.borderRightColor,
      this.borderBottomColor,
      this.borderLeftColor,
    ]);
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

  get usedFontFamilies(): Set<string> {
    const result = new Set<string>();

    const fontFamily = this.fontFamily;
    if (fontFamily) {
      const families = fontFamily.split(",");
      for (const family of families) {
        result.add(stripQuotes(family.trim()));
      }
    }

    return result;
  }

  get usedCSSVariables(): Set<string> {
    const result = new Set<string>();

    for (const key of styleKeys) {
      const value = this[key];
      if (value) {
        replaceCSSVariables(value, (name) => {
          result.add(name);
          return ""; // return value not used
        });
      }
    }

    return result;
  }
}
