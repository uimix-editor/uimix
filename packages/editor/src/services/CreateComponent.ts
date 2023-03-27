import { Selectable } from "../models/Selectable";
import { projectState } from "../state/ProjectState";

export function createComponent(selectable: Selectable) {
  const { page } = projectState;
  if (!page) {
    return;
  }

  if (selectable.idPath.length > 1) {
    return;
  }
  if (selectable.originalNode.type !== "frame") {
    // TODO: allow non-frame components?
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

  parent?.insertBefore(next, [instance.selectable]);
}
