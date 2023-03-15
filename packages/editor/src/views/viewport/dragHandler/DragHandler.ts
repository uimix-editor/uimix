import { ViewportEvent } from "../renderer/NodePicker";

export interface DragHandler {
  move(event: ViewportEvent): void;
  end(event: ViewportEvent): void;
}
