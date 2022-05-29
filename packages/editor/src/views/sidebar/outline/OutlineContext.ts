import { ContextMenuController } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { EditorState } from "../../../state/EditorState";
import { Component } from "../../../models/Component";
import { ElementInstance } from "../../../models/ElementInstance";
import { TextInstance } from "../../../models/TextInstance";
import { ComponentItem } from "./ComponentItem";
import { ElementItem } from "./ElementItem";
import { TextItem } from "./TextItem";

export interface OutlineContext {
  editorState: EditorState;
  contextMenu: ContextMenuController;
  instanceToItem: WeakMap<
    ElementInstance | TextInstance | Component,
    ElementItem | TextItem | ComponentItem
  >;
}
