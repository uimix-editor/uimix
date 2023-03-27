import { Selectable } from "../models/Selectable";
import { projectState } from "../state/ProjectState";

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
  const { page } = projectState;
  if (!page) {
    return;
  }
  if (!canCreateComponent(selectable)) {
    return;
  }

  const parent = selectable.parent;
  const next = selectable.nextSibling;

  const component = projectState.project.nodes.create("component");
  component.name = selectable.node.name;
  component.append([selectable.node]);
  page.append([component]);

  selectable.style.position = {
    // TODO: find better position
    x: { type: "start", start: 0 },
    y: { type: "start", start: 0 },
  };

  const instance = projectState.project.nodes.create("instance");
  instance.name = selectable.node.name;
  instance.selectable.style.mainComponent = component.id;

  parent?.insertBefore([instance.selectable], next);
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
