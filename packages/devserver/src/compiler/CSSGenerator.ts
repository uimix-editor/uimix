import { StackDirection, VariantCondition } from "@uimix/node-data";
import {
  Component,
  Node,
  Project,
  buildNodeCSS,
  buildPartialNodeCSS,
} from "@uimix/render";
import { cond, kebabCase } from "lodash-es";

export class CSSGenerator {
  constructor(project: Project, imageURLs: Map<string, string>) {
    this.project = project;
    this.images = imageURLs;
  }

  project: Project;
  images: Map<string, string>;

  generateCSS(): CSSRule[] {
    const rules: CSSRule[] = [];
    for (const componentRenderer of this.project.components.values()) {
      rules.push(
        ...new ComponentCSSGenerator(
          componentRenderer,
          this.images
        ).generateRootCSS()
      );
    }

    const componentRootIDs = new Set(
      [...this.project.components.values()].map((c) => c.rootNode.id)
    );
    const sortValue = (rule: CSSRule) => {
      if (rule.idPath.length === 1 && componentRootIDs.has(rule.idPath[0])) {
        return -1;
      }
      return rule.idPath.length;
    };

    rules.sort((a, b) => sortValue(a) - sortValue(b));

    return rules;
  }
}

class ComponentCSSGenerator {
  constructor(component: Component, imageURLs: Map<string, string>) {
    this.project = component.project;
    this.component = component;
    this.imageURLs = imageURLs;
  }

  project: Project;
  component: Component;
  imageURLs: Map<string, string>;

  generateRootCSS(): CSSRule[] {
    return this.generateCSS(
      this.component.variants.map((v) => v.id),
      [],
      false
    );
  }

  generateCSS(
    variants: string[],
    instancePath: string[],
    parentHasLayout?: boolean
  ): CSSRule[] {
    return this.generateNodeCSS(
      variants,
      this.component.rootNode,
      instancePath,
      parentHasLayout
    );
  }

  generateNodeCSS(
    variants: string[],
    node: Node,
    instancePath: string[],
    parentHasLayout?: boolean
  ): CSSRule[] {
    const isRoot = node === this.component.rootNode;

    const isInstanceRoot = isRoot && instancePath.length;
    const isComponentRoot = isRoot && !instancePath.length;

    const idPath = isInstanceRoot ? instancePath : [...instancePath, node.id];
    const style = this.project.getStyle(idPath);

    const hasLayout = node.type === "frame" && style.layout === "stack";

    if (node.type === "instance") {
      const mainComponentID = style.mainComponentID;
      const component =
        mainComponentID && this.project.components.get(mainComponentID);
      if (!component) {
        console.error(
          `Component ${mainComponentID} not found for instance ${node.id}`
        );
        return [];
      }
      return new ComponentCSSGenerator(component, this.imageURLs).generateCSS(
        variants,
        [...instancePath, node.id],
        parentHasLayout
      );
    }

    const children = node.children.flatMap((child) =>
      this.generateNodeCSS(variants, child, instancePath, hasLayout)
    );

    // TODO: variant styles
    const cssStyle = buildNodeCSS(node.type, style, parentHasLayout);
    if (isComponentRoot) {
      cssStyle.position = "relative";
      delete cssStyle.left;
      delete cssStyle.right;
      delete cssStyle.top;
      delete cssStyle.bottom;
    }

    const rule: CSSRule = {
      idPath,
      style: cssStyle,
    };

    const variantRules: CSSRule[] = [];
    for (const variant of variants) {
      const variantIDPath = isComponentRoot ? [variant] : [variant, ...idPath];
      const variantStyle =
        this.project.styleMap.get(variantIDPath.join(":")) ?? {};
      const variantCSSStyle = buildPartialNodeCSS(
        node.type,
        variantStyle,
        parentHasLayout
      );
      if (isComponentRoot) {
        delete variantCSSStyle.left;
        delete variantCSSStyle.right;
        delete variantCSSStyle.top;
        delete variantCSSStyle.bottom;
      }

      variantRules.push({
        idPath,
        style: variantCSSStyle,
        variant,
      });
    }

    return [rule, ...variantRules, ...children];
  }
}

interface CSSRule {
  idPath: string[];
  style: React.CSSProperties;
  variant?: string;
}

export function cssRuleToString(project: Project, rule: CSSRule): string {
  let selector = ".uimix-" + rule.idPath.join("-");

  const declarations = Object.entries(rule.style).map(
    ([key, value]) => `${kebabCase(key)}: ${value};`
  );
  const body = declarations.join("\n");

  if (rule.variant) {
    const variantNode = project.getNode(rule.variant);
    const component = project.getComponentForID(variantNode?.parent);
    const rootNodeId = component?.rootNode.id;
    if (rootNodeId) {
      const condition = variantNode?.condition;

      if (condition?.type === "maxWidth") {
        return `@media (max-width: ${condition.value}px) { ${selector} { ${body} } }`;
      }

      const pseudoClass = (() => {
        if (condition?.type === "hover") {
          return ":hover";
        }
        if (condition?.type === "active") {
          return ":active";
        }
        throw new Error("Unknown variant condition");
      })();

      // TODO: other than hover
      if (rule.idPath.length === 1 && rule.idPath[0] === rootNodeId) {
        selector = `.uimix-${rootNodeId}${pseudoClass}`;
      } else {
        selector = `.uimix-${rootNodeId}${pseudoClass} ` + selector;
      }
    }
  }

  return `${selector} { ${body} }`;
}
