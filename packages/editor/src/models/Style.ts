import { replaceCSSVariables } from "@seanchas116/paintkit/src/util/CSS";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { stripQuotes } from "@seanchas116/paintkit/src/util/String";
import { camelCase, kebabCase } from "lodash-es";
import { computed, makeObservable, observable } from "mobx";
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

export const styleShorthands = {
  margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
  padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
  borderWidth: [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
  ],
  borderColor: [
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
  ],
  borderStyle: [
    "borderTopStyle",
    "borderRightStyle",
    "borderBottomStyle",
    "borderLeftStyle",
  ],
  borderRadius: [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomRightRadius",
    "borderBottomLeftRadius",
  ],
} as const;

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
  "cursor",
] as const;

export const positionalStyleKeys = [
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "alignSelf",
  "flexGrow",
  "flexShrink",
  "flexBasis",
] as const;

const shorthandStyleKeys = Object.keys(
  styleShorthands
) as readonly (keyof typeof styleShorthands)[];

export const allStyleKeys = [...styleKeys, ...shorthandStyleKeys] as const;

export type StyleKey = typeof styleKeys[number];
export type ShorthandStyleKey = typeof shorthandStyleKeys[number];
export type AllStyleKey = typeof allStyleKeys[number];

export type StyleProps = {
  [key in StyleKey]?: string;
};
export type ShorthandStyleProps = {
  [key in ShorthandStyleKey]?: string | typeof MIXED;
};
export type AllStyleProps = StyleProps & ShorthandStyleProps;

const StyleBase: {
  new (): AllStyleProps;
} = class {
  constructor() {
    for (const key of styleKeys) {
      // @ts-ignore
      this[key] = undefined;
    }

    for (const [shorthandKey, keys] of Object.entries(styleShorthands)) {
      Object.defineProperty(this, shorthandKey, {
        configurable: true,
        get() {
          // eslint-disable-next-line
          return sameOrMixed(keys.map((key) => this[key]));
        },
        set(value: string | typeof MIXED | undefined) {
          if (value === MIXED) {
            return;
          }
          for (const key of keys) {
            // eslint-disable-next-line
            this[key] = value;
          }
        },
      });
    }

    makeObservable(
      this,
      // @ts-ignore
      {
        ...Object.fromEntries(styleKeys.map((key) => [key, observable])),
        ...Object.fromEntries(shorthandStyleKeys.map((key) => [key, computed])),
      }
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
    return this.toPostCSS().toString();
  }

  loadString(styleString: string): void {
    const root = postcss.parse(styleString);
    this.loadPostCSS(root);
  }

  toPostCSS(
    options: {
      exclude?: ReadonlySet<StyleKey>;
    } = {}
  ): postcss.Root {
    const root = new postcss.Root();

    for (const key of styleKeys) {
      if (options.exclude && options.exclude.has(key)) {
        continue;
      }
      const value = this[key];
      if (value !== undefined) {
        root.append({
          prop: kebabCase(key),
          value: value,
        });
      }
    }
    for (const [key, value] of this.customProps) {
      root.append({
        prop: key,
        value,
      });
    }

    return root;
  }

  loadPostCSS(
    container: postcss.Container,
    options: {
      exclude?: ReadonlySet<StyleKey>;
    } = {}
  ): void {
    const props: Record<string, string> = {};
    const customProps: Record<string, string> = {};
    for (const node of container.nodes) {
      if (node.type === "decl") {
        if (node.prop.startsWith("--")) {
          customProps[node.prop] = node.value;
        } else {
          props[camelCase(node.prop)] = node.value;
        }
      }
    }

    for (const key of styleKeys) {
      if (options.exclude && options.exclude.has(key)) {
        continue;
      }
      this[key] = props[key];
    }
    this.customProps.replace(new Map(Object.entries(customProps)));
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

  renameCSSVariableUsages(oldName: string, newName: string): void {
    for (const key of styleKeys) {
      const value = this[key];
      if (!value) {
        continue;
      }

      this[key] = replaceCSSVariables(
        value,
        (name) => `var(${name === oldName ? newName : name})`
      );
    }

    const customPropKeys = Array.from(this.customProps.keys());
    for (const key of customPropKeys) {
      const value = this.customProps.get(key);
      if (!value) {
        continue;
      }

      const newKey = key === oldName ? newName : key;
      const newValue = replaceCSSVariables(
        value,
        (name) => `var(${name === oldName ? newName : name})`
      );

      this.customProps.delete(key);
      this.customProps.set(newKey, newValue);
    }
  }
}
