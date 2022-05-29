import React from "react";
import {
  RootTreeViewItem,
  TreeViewItem,
} from "@seanchas116/paintkit/src/components/treeview/TreeViewItem";
import { Document } from "../../../models/Document";
import { OutlineContext } from "./OutlineContext";
import { ComponentItem } from "./ComponentItem";
import { COMPONENT_DRAG_MIME } from "./Common";

export class RootItem extends RootTreeViewItem {
  constructor(context: OutlineContext) {
    super();
    this.context = context;
  }

  readonly context: OutlineContext;

  get document(): Document {
    return this.context.editorState.document;
  }

  get children(): readonly TreeViewItem[] {
    return this.document.components.children.map(
      (c) => new ComponentItem(this.context, this, c)
    );
  }

  deselect(): void {
    for (const component of this.document.components.children) {
      component.deselect();
    }
  }

  handleContextMenu(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    this.context.contextMenu.show(
      e.clientX,
      e.clientY,
      this.context.editorState.getRootContextMenu()
    );
  }

  canDropData(dataTransfer: DataTransfer): boolean {
    return dataTransfer.types.includes(COMPONENT_DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined): void {
    const copy = event.altKey || event.ctrlKey;
    const beforeComponent = (before as ComponentItem | undefined)?.component;

    // TODO: copy
    for (const node of this.document.selectedComponents) {
      this.document.components.insertBefore(node, beforeComponent);
    }

    this.context.editorState.history.commit(
      copy ? "Duplicate Components" : "Move Components"
    );
  }
}
