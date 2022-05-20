import { Element } from "../models/Element";
import { getInstance } from "../models/InstanceRegistry";

export function changeTagName(element: Element, newTagName: string): void {
  if (!element.parent) {
    return;
  }
  const next = element.nextSibling;
  const parent = element.parent;

  const newElement = new Element({ tagName: newTagName });
  newElement.setID(element.id);
  newElement.attrs.replace(element.attrs);

  if (newElement.canHaveChildren.value) {
    for (const child of element.children) {
      newElement.append(child);
    }
  } else {
    for (const child of element.children) {
      parent.insertBefore(child, next);
    }
  }

  for (const variant of element.component?.allVariants ?? []) {
    const instance = getInstance(variant, element);
    const newInstance = getInstance(variant, newElement);
    if (instance.selected) {
      newInstance.select();
    }
    newInstance.collapsed = instance.collapsed;
    newInstance.style.loadJSON(instance.style.toJSON());
  }

  element.remove();
  parent.insertBefore(newElement, next);
}
