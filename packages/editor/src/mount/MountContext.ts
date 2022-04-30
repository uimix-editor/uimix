import { EditorState } from "../state/EditorState";
import { BoundingBoxUpdateScheduler } from "./BoundingBoxUpdateScheduler";
import { MountRegistry } from "./MountRegistry";

export interface MountContext {
  readonly editorState: EditorState;
  readonly domDocument: globalThis.Document;
  readonly registry: MountRegistry;
  readonly boundingBoxUpdateScheduler: BoundingBoxUpdateScheduler;
}
