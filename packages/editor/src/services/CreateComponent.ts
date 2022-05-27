import { Vec2 } from "paintvec";
import { Component } from "../models/Component";
import { Element } from "../models/Element";
import { ElementInstance } from "../models/ElementInstance";
import { getInstance } from "../models/InstanceRegistry";
import { EditorState } from "../state/EditorState";

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

export function createEmptyComponent(editorState: EditorState): Component {
  const component = new Component();
  component.defaultVariant.rootInstance.style.width = "100px";
  component.defaultVariant.rootInstance.style.height = "100px";
  editorState.document.components.append(component);

  const pos = editorState.findInsertionPosition(new Vec2(100, 100));
  component.defaultVariant.x = pos.x;
  component.defaultVariant.y = pos.y;

  return component;
}

export function createComponentFromInstance(
  editorState: EditorState,
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

  const size = instance.boundingBox.size;

  const html = instance.outerHTML;

  const component = new Component();
  document.components.append(component);

  component.defaultVariant.rootInstance.setInnerHTML([html]);

  const pos = editorState.findInsertionPosition(size);
  component.defaultVariant.x = pos.x;
  component.defaultVariant.y = pos.y;

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
