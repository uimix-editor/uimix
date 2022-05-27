import { Component } from "../models/Component";
import { ElementInstance } from "../models/ElementInstance";

const positionalProperties = [
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
] as const;

export function createComponent(instance: ElementInstance): Component {
  const document = instance.element.component?.document;
  if (!document) {
    throw new Error("Instance belongs to no document");
  }

  const html = instance.outerHTML;

  const component = new Component();
  document.components.append(component);

  component.defaultVariant.rootInstance.setInnerHTML([html]);

  for (const property of positionalProperties) {
    component.defaultVariant.rootInstance.style[property] =
      instance.style[property];

    for (const child of component.defaultVariant.rootInstance.children) {
      if (child.type === "element") {
        child.style[property] = undefined;
      }
    }
  }

  return component;
}
