import { kebabCase } from "lodash-es";
import * as CSS from "csstype";
import { Page } from "@uimix/model/src/models/Page";
import * as CodeAsset from "@uimix/adapter-types";
import {
  buildNodeCSS,
  Selectable,
  SelfAndChildrenCSS,
  Variant,
} from "@uimix/model/src/models";
import { ClassNameGenerator } from "./ClassNameGenerator";

function isDesignToken(
  value: CodeAsset.DesignToken | CodeAsset.DesignTokens
): value is CodeAsset.DesignToken {
  return value.$type !== undefined;
}

function getColorToken(
  designTokens: CodeAsset.DesignTokens,
  path: string[]
): CodeAsset.ColorToken | undefined {
  if (path.length === 0) {
    return undefined;
  }

  const child = designTokens[path[0]];
  if (!child) {
    return;
  }

  if (path.length > 1 && !isDesignToken(child)) {
    return getColorToken(child, path.slice(1));
  }

  if (isDesignToken(child) && child.$type === "color") {
    return child;
  }
}

const baseCSS = [
  `box-sizing: border-box;`,
  `-webkit-font-smoothing: antialiased;`,
];

export class CSSGenerator {
  page: Page;
  designTokens: CodeAsset.DesignTokens;
  classNameGenerator: ClassNameGenerator;

  constructor(
    page: Page,
    designTokens: CodeAsset.DesignTokens,
    classNameGenerator: ClassNameGenerator
  ) {
    this.page = page;
    this.designTokens = designTokens;
    this.classNameGenerator = classNameGenerator;
  }

  generate(): string {
    const { classNameGenerator } = this;

    const results: string[] = [];

    const cssForSelectable = new Map<Selectable, SelfAndChildrenCSS>();
    const generateCSS = (selectable: Selectable) => {
      let css = cssForSelectable.get(selectable);
      if (css) {
        return css;
      }

      css = buildNodeCSS(
        selectable.node.type,
        selectable.style,
        (tokenID) =>
          getColorToken(this.designTokens, tokenID.split("/"))?.$value ??
          selectable.project.colorTokens.resolve(tokenID)
      );

      cssForSelectable.set(selectable, css);
      return css;
    };

    const generateCSSText = (selectable: Selectable) => {
      const superSelectable = selectable.superSelectable;
      const css = generateCSS(selectable);
      const superCSS = superSelectable
        ? generateCSS(superSelectable)
        : {
            self: {},
            children: {},
          };

      let diffCSS: SelfAndChildrenCSS;
      if (superSelectable) {
        diffCSS = {
          self: {},
          children: {},
        };
        for (const target of ["self", "children"] as const) {
          const keys = new Set([
            ...Object.keys(css[target]),
            ...Object.keys(superCSS[target]),
          ]) as Set<keyof CSS.Properties>;

          for (const key of keys) {
            if (css[target][key] !== superCSS[target][key]) {
              // @ts-ignore
              diffCSS[target][key] = css[target][key] ?? "unset";
            }
          }
        }
      } else {
        diffCSS = css;
      }

      const body: { self: string[]; children: string[] } = {
        self: [],
        children: [],
      };
      if (!superSelectable) {
        body.self.push(...baseCSS);
      }

      for (const target of ["self", "children"] as const) {
        for (const [key, value] of Object.entries(diffCSS[target])) {
          if (key.startsWith("--")) {
            // eslint-disable-next-line
            body[target].push(`  ${key}: ${value};`);
          } else {
            // eslint-disable-next-line
            body[target].push(`  ${kebabCase(key)}: ${value};`);
          }
        }
      }

      const outermostInstance = selectable.nodePath[0];
      const variant = Variant.from(outermostInstance);

      if (variant) {
        const mainComponent = variant.component;
        if (!mainComponent) {
          console.error(
            "mainComponent not found for variant",
            selectable.idPath.join(":")
          );
          return "";
        }

        const condition = variant.condition;
        if (condition?.type === "maxWidth") {
          const selector =
            "." +
            (selectable.nodePath.length === 1
              ? classNameGenerator.get([mainComponent.rootNode.id])
              : classNameGenerator.get(selectable.idPath.slice(1)));

          results.push(
            `@media (max-width: ${condition.value}px) {`,
            `${selector} {`,
            ...body.self,
            "}",
            `${selector} > * {`,
            ...body.children,
            "}",
            "}"
          );
          return;
        }

        if (selectable.nodePath.length === 1) {
          const selector = `.${classNameGenerator.get([
            mainComponent.rootNode.id,
          ])}:hover`;
          results.push(
            `${selector} {`,
            ...body.self,
            "}",
            `${selector} > * {`,
            ...body.children,
            "}"
          );
          return;
        } else {
          const innerIDPath = selectable.idPath.slice(1);
          const selector = `.${classNameGenerator.get([
            mainComponent.rootNode.id,
          ])}:hover .${classNameGenerator.get(innerIDPath)}`;
          results.push(
            `${selector} {`,
            ...body.self,
            "}",
            `${selector} > * {`,
            ...body.children,
            "}"
          );
          return;
        }
      }

      const selector = "." + classNameGenerator.get(selectable.idPath);
      results.push(
        `${selector} {`,
        ...body.self,
        "}",
        `${selector} > * {`,
        ...body.children,
        "}"
      );
    };

    const generateCSSTextRecursive = (selectable: Selectable) => {
      generateCSSText(selectable);
      for (const child of selectable.children) {
        generateCSSTextRecursive(child);
      }
    };

    const components = this.page.components;

    // component root styles must come before instances
    for (const component of components) {
      generateCSSText(component.rootNode.selectable);
      for (const variant of component.variants) {
        generateCSSText(variant.selectable);
      }
    }

    for (const component of components) {
      component.rootNode.selectable.children.forEach(generateCSSTextRecursive);
      for (const variant of component.variants) {
        variant.selectable.children.forEach(generateCSSTextRecursive);
      }
    }

    return results.join("\n");
  }
}
