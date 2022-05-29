import React from "react";
import styled from "styled-components";
import { TreeViewItem } from "@seanchas116/paintkit/src/components/treeview/TreeViewItem";
import {
  TreeRow,
  TreeRowIcon,
  TreeRowNameEdit,
} from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import widgetsFilledIcon from "@iconify-icons/ic/baseline-widgets";
import { action, makeObservable } from "mobx";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { compact } from "lodash-es";
import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import validateElementName from "validate-element-name";
import { Component } from "../../../models/Component";
import { Variant } from "../../../models/Variant";
import { COMPONENT_DRAG_MIME, VARIANT_DRAG_MIME } from "./Common";
import { RootItem } from "./RootItem";
import { OutlineContext } from "./OutlineContext";
import { VariantItem } from "./VariantItem";

const ComponentIcon = styled(TreeRowIcon)`
  color: ${colors.component};
`;

const ComponentNameEdit = styled(TreeRowNameEdit)`
  color: ${colors.componentText};
  font-weight: 700;
`;

export class ComponentItem extends TreeViewItem {
  constructor(context: OutlineContext, parent: RootItem, component: Component) {
    super();
    this.context = context;
    this.parent = parent;
    this.component = component;
    makeObservable(this);
    context.instanceToItem.set(component, this);
  }

  readonly context: OutlineContext;
  readonly parent: RootItem;
  readonly component: Component;

  get key(): string {
    return this.component.key;
  }

  get children(): readonly TreeViewItem[] {
    return compact(
      this.component.allVariants.map(
        (variant) =>
          new VariantItem(
            this.context,
            this,
            variant,
            assertNonNull(variant.rootInstance)
          )
      )
    );
  }

  get selected(): boolean {
    return this.component.selected;
  }
  get hovered(): boolean {
    return false;
  }
  get collapsed(): boolean {
    return this.component.collapsed;
  }
  get showsCollapseButton(): boolean {
    return true;
  }

  deselect(): void {
    this.component.deselect();
  }
  select(): void {
    this.component.select();
  }
  toggleCollapsed(): void {
    this.component.collapsed = !this.component.collapsed;
  }

  rowElement: HTMLElement | undefined;

  private onNameChange = action((name: string) => {
    this.component.rename(name);
    this.context.editorState.history.commit("Rename Component");
    return true;
  });

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <TreeRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <ComponentIcon icon={widgetsFilledIcon} />
        <ComponentNameEdit
          value={this.component.name}
          validate={(value) => validateElementName(value)}
          onChange={this.onNameChange}
          disabled={!options.inverted}
          trigger="click"
        />
      </TreeRow>
    );
  }

  handleContextMenu(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    this.context.contextMenu.show(
      e.clientX,
      e.clientY,
      this.context.editorState.getComponentContextMenu(this.component)
    );
  }

  handleDragStart(e: React.DragEvent): void {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(COMPONENT_DRAG_MIME, "drag");
  }

  canDropData(dataTransfer: DataTransfer): boolean {
    return dataTransfer.types.includes(VARIANT_DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined): void {
    const copy = event.altKey || event.ctrlKey;
    let beforeVariant = (before as VariantItem | undefined)?.variant;
    if (beforeVariant?.type === "defaultVariant") {
      beforeVariant = this.component.variants.firstChild;
    }

    const selectedVariants = filterInstance(this.component.selectedVariants, [
      Variant,
    ]);
    for (const variant of selectedVariants) {
      this.component.variants.insertBefore(variant, beforeVariant);
    }

    this.context.editorState.history.commit(
      copy ? "Duplicate Variants" : "Move Variants"
    );
  }
}
