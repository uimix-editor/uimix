import { Vec2 } from "paintvec";
import { ElementInstance } from "../../../models/ElementInstance";
import { EditorState } from "../../../state/EditorState";
import { DragHandler } from "./DragHandler";

export class ElementMoveDragHandler implements DragHandler {
  constructor(
    editorState: EditorState,
    overrides: ElementInstance[],
    initPos: Vec2
  ) {
    // TODO
  }

  move(event: MouseEvent | DragEvent): void {
    // TODO
  }

  end(event: MouseEvent | DragEvent): void {
    // TODO
  }
}
