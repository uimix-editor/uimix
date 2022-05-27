import { Component } from "../models/Component";
import { ElementInstance } from "../models/ElementInstance";

export function createComponent(instance: ElementInstance): Component {
  const document = instance.element.component?.document;
  if (!document) {
    throw new Error("Instance belongs to no document");
  }

  const html = instance.outerHTML;

  const component = new Component();
  document.components.append(component);

  component.defaultVariant.rootInstance.setInnerHTML([html]);

  return component;
}
