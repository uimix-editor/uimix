import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import {
  LeafTreeViewItem,
  RootTreeViewItem,
  TreeViewItem,
} from "@seanchas116/paintkit/dist/components/treeview/TreeViewItem";
import { TreeView } from "@seanchas116/paintkit/dist/components/treeview/TreeView";
import {
  ContextMenuController,
  useContextMenu,
} from "@seanchas116/paintkit/dist/components/menu/ContextMenuProvider";
import { computed, makeObservable } from "mobx";
import { EditorState } from "../state/EditorState";
import { Component } from "../models/Component";
import { Variant } from "../models/Variant";
import { ElementInstance } from "../models/ElementInstance";
import { TextInstance } from "../models/TextInstance";
import { Document } from "../models/Document";

const TreeViewPadding = styled.div`
  height: 8px;
`;

export const OutlineTreeView: React.FC<{
  className?: string;
  hidden?: boolean;
  editorState: EditorState;
}> = observer(({ className, hidden, editorState }) => {
  const contextMenu = useContextMenu();

  const rootItem = useMemo(
    () =>
      new RootItem({
        editorState,
        contextMenu,
      }),
    [editorState, contextMenu]
  );

  return (
    <TreeView
      className={className}
      hidden={hidden}
      rootItem={rootItem}
      header={<TreeViewPadding />}
      footer={<TreeViewPadding />}
    />
  );
});

interface OutlineContext {
  editorState: EditorState;
  contextMenu: ContextMenuController;
}

class RootItem extends RootTreeViewItem {
  constructor(context: OutlineContext) {
    super();
    this.context = context;
  }

  readonly context: OutlineContext;

  get document(): Document {
    return this.context.editorState.document;
  }

  get children(): readonly TreeViewItem[] {
    return this.document.components.map(
      (c) => new ComponentItem(this.context, this, c)
    );
  }

  deselect(): void {
    for (const component of this.document.components) {
      component.deselect();
    }
  }

  handleContextMenu(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    this.context.contextMenu.show(
      e.clientX,
      e.clientY,
      this.context.editorState.getOutlineContextMenu()
    );
  }
}

class ComponentItem extends TreeViewItem {
  constructor(context: OutlineContext, parent: RootItem, component: Component) {
    super();
    this.context = context;
    this.parent = parent;
    this.component = component;
    makeObservable(this);
  }

  readonly context: OutlineContext;
  readonly parent: RootItem;
  readonly component: Component;

  get key(): string {
    return this.key;
  }

  get children(): readonly TreeViewItem[] {
    return [this.component.defaultVariant, ...this.component.variants].map(
      (variant) => new VariantItem(this.context, this, variant)
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

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}

class VariantItem extends TreeViewItem {
  constructor(
    context: OutlineContext,
    parent: ComponentItem,
    variant: Variant
  ) {
    super();
    this.context = context;
    this.parent = parent;
    this.variant = variant;
    makeObservable(this);
  }

  readonly parent: ComponentItem;
  readonly context: OutlineContext;
  readonly variant: Variant;

  get key(): string {
    return this.variant.key;
  }

  get children(): readonly TreeViewItem[] {
    return this.variant.rootInstance.children.map((instance) => {
      if (instance.type === "element") {
        return new ElementItem(this.context, this, instance);
      } else {
        return new TextItem(this.context, this, instance);
      }
    });
  }

  get selected(): boolean {
    return this.variant.rootInstance.selected;
  }
  get hovered(): boolean {
    return this.context.editorState.hoveredItem === this.variant.rootInstance;
  }
  get collapsed(): boolean {
    return this.variant.rootInstance.collapsed;
  }
  get showsCollapseButton(): boolean {
    return true;
  }

  deselect(): void {
    return this.variant.rootInstance.deselect();
  }
  select(): void {
    return this.variant.rootInstance.select();
  }
  toggleCollapsed(): void {
    this.variant.rootInstance.collapsed = !this.variant.rootInstance.collapsed;
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}

class ElementItem extends TreeViewItem {
  constructor(
    context: OutlineContext,
    parent: ElementItem | VariantItem,
    instance: ElementInstance
  ) {
    super();
    this.context = context;
    this.parent = parent;
    this.instance = instance;
    makeObservable(this);
  }

  readonly context: OutlineContext;
  readonly parent: ElementItem | VariantItem;
  readonly instance: ElementInstance;

  get children(): readonly TreeViewItem[] {
    return this.instance.children.map((instance) => {
      if (instance.type === "element") {
        return new ElementItem(this.context, this, instance);
      } else {
        return new TextItem(this.context, this, instance);
      }
    });
  }

  get key(): string {
    return this.instance.element.key;
  }

  get selected(): boolean {
    return this.instance.selected;
  }
  @computed get hovered(): boolean {
    return this.context.editorState.hoveredItem === this.instance;
  }
  get collapsed(): boolean {
    return this.instance.collapsed;
  }
  get showsCollapseButton(): boolean {
    return true;
  }

  deselect(): void {
    this.instance.deselect();
  }
  select(): void {
    this.instance.select();
  }
  toggleCollapsed(): void {
    this.instance.collapsed = !this.instance.collapsed;
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}

class TextItem extends LeafTreeViewItem {
  constructor(
    context: OutlineContext,
    parent: ElementItem | VariantItem,
    instance: TextInstance
  ) {
    super();
    this.context = context;
    this.parent = parent;
    this.instance = instance;
    makeObservable(this);
  }

  readonly context: OutlineContext;
  readonly parent: ElementItem | VariantItem;
  readonly instance: TextInstance;

  get key(): string {
    return this.instance.text.key;
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

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}
