import { NodePickResult } from "../renderer/NodePicker";

export interface DragHandler {
  move(pickResult: NodePickResult): void;
  end(pickResult: NodePickResult): void;
}
