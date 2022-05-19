import { Vec2 } from "paintvec";
import { ElementInstance } from "../models/ElementInstance";

export function moveByPixels(instance: ElementInstance, offset: Vec2): void {
  if (instance.computedStyle.position !== "absolute") {
    return;
  }

  // TODO: right/bottom

  instance.style.left = `${
    Number.parseInt(instance.computedStyle.left ?? "0") + offset.x
  }px`;
  instance.style.top = `${
    Number.parseInt(instance.computedStyle.top ?? "0") + offset.y
  }px`;
}
