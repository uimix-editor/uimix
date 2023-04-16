import { Component } from "../models/Component";
import { Selectable } from "../models/Selectable";
import { styleKeys } from "../models/Style";

export function canCreateComponent(selectable: Selectable) {
  // inside instance
  if (selectable.idPath.length > 1) {
    return false;
  }
  // non-frame node (TODO: allow?)
  if (selectable.originalNode.type !== "frame") {
    return false;
  }
  // already a component root
  if (selectable.originalNode.parent?.type === "component") {
    return false;
  }

  return true;
}

export function createComponent(selectable: Selectable) {
  const page = selectable.page;
  if (!page) {
    return;
  }
  const project = page.project;

  if (!canCreateComponent(selectable)) {
    return;
  }

  const isTopLevel = selectable.parent?.originalNode.type === "page";

  const parent = selectable.parent;
  const next = selectable.nextSibling;

  const component = project.nodes.create("component");
  component.name = selectable.node.name;
  component.append([selectable.node]);
  page.node.append([component]);

  if (!isTopLevel) {
    selectable.style.position = {
      // TODO: find better position
      x: { type: "start", start: 0 },
      y: { type: "start", start: 0 },
    };

    const instance = project.nodes.create("instance");
    instance.name = selectable.node.name;
    instance.selectable.style.mainComponent = component.id;
    parent?.insertBefore([instance.selectable], next);
  }
}

export function canDetachComponent(selectable: Selectable): boolean {
  return (
    selectable.idPath.length === 1 &&
    selectable.originalNode.type === "instance"
  );
}

export function detachComponent(selectable: Selectable) {
  if (!canDetachComponent(selectable)) {
    return;
  }

  const parent = selectable.parent;
  const next = selectable.nextSibling;
  const detached = Selectable.fromJSON(selectable.project, selectable.toJSON());
  parent?.insertBefore([detached], next, {
    fixPosition: false,
  });
  selectable.remove();

  return detached;
}

export function attachComponent(
  selectable: Selectable,
  component: Component
): Selectable {
  // - insert instance
  // - copy styles recursively
  // - remove original

  const project = selectable.project;

  const parent = selectable.parent;
  const next = selectable.nextSibling;

  const instance = project.nodes.create("instance");
  const instanceSelectable = instance.selectable;
  instance.name = selectable.node.name;
  instanceSelectable.style.mainComponent = component.node.id;

  const copyStyles = (src: Selectable, dst: Selectable) => {
    if (src.node.type !== dst.node.type) {
      return;
    }
    for (const key of styleKeys) {
      if (dst === instanceSelectable && key === "mainComponent") {
        continue;
      }
      // @ts-ignore
      dst.style[key] = src.style[key];
    }

    const srcChildren = src.children;
    const dstChildren = dst.children;
    if (srcChildren.length !== dstChildren.length) {
      return;
    }

    for (let i = 0; i < srcChildren.length; i++) {
      copyStyles(srcChildren[i], dstChildren[i]);
    }
  };

  parent?.insertBefore([instanceSelectable], next, {
    fixPosition: false,
  });

  copyStyles(selectable, instanceSelectable);

  selectable.remove();

  return instanceSelectable;
}
