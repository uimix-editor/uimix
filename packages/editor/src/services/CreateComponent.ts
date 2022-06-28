import { Vec2 } from "paintvec";
import { Component } from "../models/Component";
import { Element } from "../models/Element";
import { ElementInstance } from "../models/ElementInstance";
import { getInstance } from "../models/InstanceRegistry";
import { positionalStyleKeys, styleKeys } from "../models/Style";
import { EditorState } from "../state/EditorState";

export function createEmptyComponent(editorState: EditorState): Component {
  const component = new Component();
  component.defaultVariant.rootInstance.style.width = "100px";
  component.defaultVariant.rootInstance.style.height = "100px";
  component.defaultVariant.rootInstance.style.position = "relative";
  editorState.document.components.append(component);

  const pos = editorState.findNewComponentPosition(new Vec2(100, 100));
  component.defaultVariant.x = pos.x;
  component.defaultVariant.y = pos.y;

  return component;
}

export function createComponentFromInstance(
  editorState: EditorState,
  instance: ElementInstance
): Component {
  const parent = instance.element.parent;
  if (!parent) {
    return createEmptyComponent(editorState);
  }

  const document = instance.element.component?.document;
  if (!document) {
    return createEmptyComponent(editorState);
  }

  // build component
  // TODO: generate component name

  const component = new Component();
  document.components.append(component);

  const createsWrapper = ["img", "input", "textarea", "select"].includes(
    instance.element.tagName
  );

  if (createsWrapper) {
    component.defaultVariant.rootInstance.setInnerHTML([instance.outerHTML]);
    const child = component.defaultVariant.rootInstance
      .children[0] as ElementInstance;
    for (const property of positionalStyleKeys) {
      child.style[property] = undefined;
    }
  } else {
    for (const property of styleKeys) {
      if ((positionalStyleKeys as readonly string[]).includes(property)) {
        continue;
      }
      component.defaultVariant.rootInstance.style[property] =
        instance.style[property];
    }
    component.defaultVariant.rootInstance.setInnerHTML(instance.innerHTML);
  }
  component.defaultVariant.rootInstance.style.position = "relative";

  const pos = editorState.findNewComponentPosition(instance.boundingBox.size);
  component.defaultVariant.x = pos.x;
  component.defaultVariant.y = pos.y;

  // create instance

  const newElement = new Element({
    tagName: component.name,
  });
  newElement.setID(instance.element.id);
  parent.insertBefore(newElement, instance.element);

  const newInstance = getInstance(undefined, newElement);

  for (const property of positionalStyleKeys) {
    newInstance.style[property] = instance.style[property];
  }

  instance.element.remove();

  return component;
}
