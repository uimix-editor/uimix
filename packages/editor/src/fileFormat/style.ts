import * as postcss from "postcss";
import * as CSSwhat from "css-what";
import { getOrSetDefault } from "@seanchas116/paintkit/src/util/Collection";
import { Component } from "../models/Component";

export function dumpComponentStyles(component: Component): postcss.Root {
  const root = new postcss.Root();

  for (const variant of component.allVariants) {
    const rootInstance = variant.rootInstance!;

    const rules: postcss.ChildNode[] = [];

    for (const instance of rootInstance.allDescendants ?? []) {
      if (instance.type !== "element") {
        continue;
      }
      if (instance !== rootInstance && !instance.element.id) {
        continue;
      }

      let selector: string;
      if (variant.type === "variant" && variant.selector) {
        selector =
          instance === rootInstance
            ? `:host(${variant.selector})`
            : `:host(${variant.selector}) #${instance.element.id}`;
      } else {
        selector =
          instance === rootInstance ? ":host" : `#${instance.element.id}`;
      }

      const rule = new postcss.Rule({
        selector,
        nodes: instance.style.toPostCSS().nodes,
      });
      if (rule.nodes.length) {
        rules.push(rule);
      }
    }

    if (variant.type === "variant" && variant.mediaQuery) {
      const atRule = new postcss.AtRule({
        name: "media",
        params: variant.mediaQuery,
      });
      atRule.append(...rules);
      root.append(atRule);
    } else {
      root.append(...rules);
    }
  }

  return root;
}

// :host or :host({condition})
function parseHostSelector(selector: CSSwhat.Selector[]):
  | {
      hostSelector?: string;
    }
  | undefined {
  if (selector.length === 1) {
    const host = selector[0];

    if (host.type === "pseudo" && host.name === "host") {
      const data = Array.isArray(host.data)
        ? CSSwhat.stringify(host.data)
        : host.data || undefined;

      return {
        hostSelector: data,
      };
    }
  }
}

// #{id}
function parseIDSelector(selector: CSSwhat.Selector[]): string | undefined {
  if (selector.length === 1) {
    const id = selector[0];
    if (id.type === "attribute" && id.action === "equals" && id.name === "id") {
      return id.value;
    }
  }
}

// :host #{id} or :host({condition}) #{id}
function parseIDInsideHostSelector(selector: CSSwhat.Selector[]):
  | {
      hostSelector?: string;
      id: string;
    }
  | undefined {
  if (selector.length === 3) {
    const host = selector[0];
    const desc = selector[1];
    const id = selector[2];

    if (
      host.type === "pseudo" &&
      host.name === "host" &&
      desc.type === "descendant" &&
      id.type === "attribute" &&
      id.action === "equals" &&
      id.name === "id"
    ) {
      const variantSelector = Array.isArray(host.data)
        ? CSSwhat.stringify(host.data)
        : host.data || undefined;

      return {
        hostSelector: variantSelector,
        id: id.value,
      };
    }
  }
}

export function loadComponentStyles(
  component: Component,
  root: postcss.Root
): void {
  const variantRules = new Map<string, Map<string, postcss.Rule>>();

  const getVariantRules = (condition: {
    selector?: string;
    media?: string;
  }) => {
    return getOrSetDefault(
      variantRules,
      JSON.stringify(condition),
      () => new Map<string, postcss.Rule>()
    );
  };

  const addNodes = (nodes: postcss.ChildNode[], media?: string) => {
    for (const node of nodes) {
      if (node.type === "rule") {
        for (const selector of CSSwhat.parse(node.selector)) {
          const host = parseHostSelector(selector);
          if (host) {
            getVariantRules({ selector: host.hostSelector, media }).set(
              "",
              node
            );
            continue;
          }

          const id = parseIDSelector(selector);
          if (id) {
            getVariantRules({ media }).set(id, node);
            continue;
          }

          const idInsideHost = parseIDInsideHostSelector(selector);
          if (idInsideHost) {
            getVariantRules({ selector: idInsideHost.hostSelector, media }).set(
              idInsideHost.id,
              node
            );
            continue;
          }
        }
      } else if (node.type === "atrule") {
        if (node.name === "media") {
          addNodes(node.nodes, node.params);
        }
      }
    }
  };

  addNodes(root.nodes);

  for (const variant of component.allVariants) {
    const rules =
      variant.type === "defaultVariant"
        ? getVariantRules({})
        : getVariantRules({
            selector: variant.selector || undefined,
            media: variant.mediaQuery || undefined,
          });

    for (const instance of variant.rootInstance?.allDescendants ?? []) {
      if (instance.type !== "element") {
        continue;
      }

      const rule = rules.get(instance.element.id);
      if (rule) {
        instance.style.loadPostCSS(rule);
      }
    }
  }
}
