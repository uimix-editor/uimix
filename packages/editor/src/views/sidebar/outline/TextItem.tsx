import React from "react";
import { LeafTreeViewItem } from "@seanchas116/paintkit/src/components/treeview/TreeViewItem";
import { action, computed, makeObservable } from "mobx";
import { TextInstance } from "../../../models/TextInstance";
import {
  colorWithOpacity,
  NameEdit,
  NODE_DRAG_MIME,
  slotColor,
  StyledRow,
} from "./Common";
import { OutlineContext } from "./OutlineContext";
import { ElementItem } from "./ElementItem";
import { ComponentItem } from "./ComponentItem";
import { SlotItem } from "./SlotItem";

export class TextItem extends LeafTreeViewItem {
  constructor(
    context: OutlineContext,
    parent: ElementItem | ComponentItem | SlotItem,
    instance: TextInstance
  ) {
    super();
    this.context = context;
    this.parent = parent;
    this.instance = instance;
    makeObservable(this);
    context.instanceToItem.set(instance, this);
  }

  readonly context: OutlineContext;
  readonly parent: ElementItem | ComponentItem | SlotItem;
  readonly instance: TextInstance;

  get key(): string {
    return this.instance.key;
  }

  get selected(): boolean {
    return this.instance.selected;
  }
  @computed get hovered(): boolean {
    return this.context.editorState.hoveredItem === this.instance;
  }

  deselect(): void {
    this.instance.deselect();
  }
  select(): void {
    this.instance.select();
  }

  private onNameChange = action((content: string) => {
    this.instance.text.content = content;
    this.context.editorState.history.commit("Change Text");
    return true;
  });

  rowElement: HTMLElement | undefined;

  @computed get isInsideSlot(): boolean {
    return this.parent instanceof ElementItem
      ? this.parent.isInsideSlot
      : false;
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <StyledRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <NameEdit
          color={colorWithOpacity(this.isInsideSlot ? slotColor : "white", 0.7)}
          rowSelected={options.inverted}
          value={this.instance.text.content}
          onChange={this.onNameChange}
          disabled={!options.inverted}
          trigger="click"
        />
      </StyledRow>
    );
  }

  handleContextMenu(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    this.context.contextMenu.show(
      e.clientX,
      e.clientY,
      this.context.editorState.getTextContextMenu(this.instance)
    );
  }

  handleDragStart(e: React.DragEvent): void {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(NODE_DRAG_MIME, "drag");
  }

  handleMouseEnter(): void {
    this.context.editorState.hoveredItem = this.instance;
  }
  handleMouseLeave(): void {
    this.context.editorState.hoveredItem = undefined;
  }
}
