import { EditorState } from "../state/EditorState";
import { MountRegistry } from "./MountRegistry";

export interface MountContext {
  editorState: EditorState;
  registry: MountRegistry;
}
