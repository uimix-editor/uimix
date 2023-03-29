import { Project } from "@uimix/editor/src/models/Project";
import { Selectable } from "@uimix/editor/src/models/Selectable";
import { Variant } from "@uimix/editor/src/models/Component";
import { buildNodeCSS } from "@uimix/editor/src/models/buildNodeCSS";
import { kebabCase } from "lodash-es";
import * as CSS from "csstype";

const baseCSS = [
  `box-sizing: border-box;`,
  `-webkit-font-smoothing: antialiased;`,
];

export class CSSGenerator {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  generate(): string {
    const results: string[] = [];

    const cssForSelectable = new Map<Selectable, CSS.Properties>();
    const generateCSS = (selectable: Selectable) => {
      let css = cssForSelectable.get(selectable);
      if (css) {
        return css;
      }

      let parent = selectable.parent;
      if (parent?.originalNode.isAbstract) {
        parent = undefined;
      }
      const parentStackDirection =
        parent?.node.type === "frame" && parent.style.layout === "stack"
          ? parent.style.stackDirection
          : undefined;

      css = buildNodeCSS(
        selectable.node.type,
        selectable.style,
        parentStackDirection
      ) as CSS.Properties;

      if (!parent) {
        css.position = "relative";
        delete css.left;
        delete css.right;
        delete css.top;
        delete css.bottom;
      }

      cssForSelectable.set(selectable, css);
      return css;
    };

    const generateCSSText = (selectable: Selectable) => {
      const superSelectable = selectable.superSelectable;
      const css = generateCSS(selectable);
      const superCSS = superSelectable ? generateCSS(superSelectable) : {};

      let diffCSS: CSS.Properties;
      if (superSelectable) {
        const keys = new Set([...Object.keys(css), ...Object.keys(superCSS)]);

        diffCSS = {};
        for (const key of keys) {
          // @ts-ignore
          if (css[key] !== superCSS[key]) {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            diffCSS[key] = css[key] ?? "unset";
          }
        }
      } else {
        diffCSS = css;
      }
      const body: string[] = [];
      if (!superSelectable) {
        body.push(...baseCSS);
      }

      for (const [key, value] of Object.entries(diffCSS)) {
        // eslint-disable-next-line
        body.push(`  ${kebabCase(key)}: ${value};`);
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
          const selector = ".uimix-" + selectable.idPath.join("-");

          results.push(
            `@media (max-width: ${condition.value}px) {`,
            `${selector} {`,
            ...body,
            "}",
            "}"
          );
          return;
        }

        if (selectable.nodePath.length === 1) {
          const selector = `.uimix-${mainComponent.rootNode.id}:hover`;
          results.push(`${selector} {`, ...body, "}");
          return;
        } else {
          const innerIDPath = selectable.idPath.slice(1);
          const selector = `.uimix-${
            mainComponent.rootNode.id
          }:hover .uimix-${innerIDPath.join("-")}`;
          results.push(`${selector} {`, ...body, "}");
          return;
        }
      }

      const selector = ".uimix-" + selectable.idPath.join("-");
      results.push(`${selector} {`, ...body, "}");
    };

    const generateCSSTextRecursive = (selectable: Selectable) => {
      generateCSSText(selectable);
      for (const child of selectable.children) {
        generateCSSTextRecursive(child);
      }
    };

    const components = this.project.components;

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
