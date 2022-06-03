import { action } from "mobx";
import { EditorState } from "../state/EditorState";

export function registerEditorKeyHandler(
  target: Window | HTMLElement,
  editorState: EditorState
): () => void {
  const onWindowKeyDown = action((e: KeyboardEvent) => {
    if (editorState.handleGlobalKeyDown(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
  const onWindowKeyUp = action((e: KeyboardEvent) => {
    editorState.handleGlobalKeyUp(e);
  });

  const _target = target as Window;

  _target.addEventListener("keydown", onWindowKeyDown, { capture: true });
  _target.addEventListener("keyup", onWindowKeyUp, { capture: true });
  return () => {
    _target.removeEventListener("keydown", onWindowKeyDown, { capture: true });
    _target.removeEventListener("keyup", onWindowKeyUp, { capture: true });
  };
}
