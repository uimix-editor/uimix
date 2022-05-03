import { ElementPickResult } from "../../../mount/ElementPicker";
import { EditorState } from "../../../state/EditorState";
import { InsertMode } from "../../../state/InsertMode";
import { DragHandler } from "./DragHandler";

export class ElementInsertDragHandler implements DragHandler {
  constructor(
    editorState: EditorState,
    mode: InsertMode,
    pickResult: ElementPickResult
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
