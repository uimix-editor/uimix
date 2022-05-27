import { Component } from "../models/Component";
import { Element } from "../models/Element";
import { Document } from "../models/Document";
import { ElementInstance } from "../models/ElementInstance";
import { getInstance } from "../models/InstanceRegistry";

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
  "alignSelf",
  "flexGrow",
  "flexShrink",
  "flexBasis",
] as const;

export function createEmptyComponent(document: Document): Component {
  const component = new Component();
  document.components.append(component);
  return component;
}

export function createComponentFromInstance(
  instance: ElementInstance
): Component {
  const parent = instance.element.parent!;
  if (!parent) {
    throw new Error("Cannot create component without a parent");
  }

  const document = instance.element.component?.document;
  if (!document) {
    throw new Error("Instance belongs to no document");
  }

  const html = instance.outerHTML;

  const component = new Component();
  document.components.append(component);

  component.defaultVariant.rootInstance.setInnerHTML([html]);

  const newElement = new Element({
    tagName: component.name,
  });
  newElement.setID(instance.element.id);
  parent.insertBefore(newElement, instance.element);

  const newInstance = getInstance(undefined, newElement);

  for (const property of positionalProperties) {
    newInstance.style[property] = instance.style[property];

    for (const child of component.defaultVariant.rootInstance.children) {
      if (child.type === "element") {
        child.style[property] = undefined;
      }
    }
  }

  instance.element.remove();

  return component;
}
