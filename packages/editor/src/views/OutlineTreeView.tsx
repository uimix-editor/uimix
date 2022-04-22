import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import {
  LeafTreeViewItem,
  RootTreeViewItem,
  TreeViewItem,
} from "@seanchas116/paintkit/dist/components/treeview/TreeViewItem";
import {
  TreeRow,
  TreeRowIcon,
  TreeRowLabel,
  TreeRowNameEdit,
} from "@seanchas116/paintkit/dist/components/treeview/TreeRow";
import { TreeView } from "@seanchas116/paintkit/dist/components/treeview/TreeView";
import {
  ContextMenuController,
  useContextMenu,
} from "@seanchas116/paintkit/dist/components/menu/ContextMenuProvider";
import widgetsFilledIcon from "@iconify-icons/ic/baseline-widgets";
import switchIcon from "@seanchas116/paintkit/dist/icon/Switch";
import { action, computed, makeObservable } from "mobx";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { EditorState } from "../state/EditorState";
import { Component } from "../models/Component";
import { Variant } from "../models/Variant";
import { ElementInstance } from "../models/ElementInstance";
import { TextInstance } from "../models/TextInstance";
import { Document } from "../models/Document";
import { useEditorState } from "./EditorStateContext";

const NODE_DRAG_MIME = "application/x.macaron-tree-drag-node";
const COMPONENT_DRAG_MIME = "application/x.macaron-tree-drag-component";

const TreeViewPadding = styled.div`
  height: 8px;
`;

const TagName = styled.div<{
  color: string;
}>`
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${(p) => p.color};
  opacity: 0.5;
  margin-right: 6px;
`;

const StyledIcon = styled(TreeRowIcon)<{
  iconColor: string;
}>`
  color: ${(p) => p.iconColor};
`;

const StyledNameEdit = styled(TreeRowNameEdit)<{
  isComponent?: boolean;
  color: string;
}>`
  color: ${(p) => p.color};
  font-weight: ${(p) => (p.isComponent ? "700" : "400")};
`;

const StyledRow = styled(TreeRow)`
  position: relative;
`;

export const OutlineTreeView: React.FC<{
  className?: string;
  hidden?: boolean;
}> = observer(({ className, hidden }) => {
  const contextMenu = useContextMenu();
  const editorState = useEditorState();

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

class ElementItem extends TreeViewItem {
  constructor(
    context: OutlineContext,
    parent: ElementItem | ComponentItem,
    instance: ElementInstance
  ) {
    super();
    this.context = context;
    this.parent = parent;
    this.instance = instance;
    makeObservable(this);
  }

  readonly context: OutlineContext;
  readonly parent: ElementItem | ComponentItem;
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

  private onNameChange = action((id: string) => {
    this.instance.element.id = id;
    return true;
  });

  protected rowElement: HTMLElement | undefined;

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <StyledRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <TagName color={colors.text}> {this.instance.element.tagName}</TagName>
        <StyledNameEdit
          color={colors.text}
          value={this.instance.element.id}
          // TODO: validate
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
      this.context.editorState.getElementContextMenu(this.instance)
    );
  }

  handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(NODE_DRAG_MIME, "drag");
  }

  canDropData(dataTransfer: DataTransfer) {
    return dataTransfer.types.includes(NODE_DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined) {
    const copy = event.altKey || event.ctrlKey;
    const beforeNode = (before as ElementItem | TextItem | undefined)?.instance
      .node;

    // TODO: copy
    for (const node of this.context.editorState.document.selectedNodes) {
      this.instance.node.insertBefore(node, beforeNode);
    }

    this.context.editorState.history.commit(
      copy ? "Duplicate Layers" : "Move Layers"
    );
  }
}

class TextItem extends LeafTreeViewItem {
  constructor(
    context: OutlineContext,
    parent: ElementItem,
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

  private onNameChange = action((content: string) => {
    this.instance.text.content = content;
    return true;
  });

  private rowElement: HTMLElement | undefined;

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <StyledRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <StyledNameEdit
          color={colors.text}
          value={this.instance.text.content}
          // TODO: validate
          onChange={this.onNameChange}
          disabled={!options.inverted}
          trigger="click"
        />
      </StyledRow>
    );
  }

  handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(NODE_DRAG_MIME, "drag");
  }
}

class VariantItem extends ElementItem {
  constructor(
    context: OutlineContext,
    parent: ComponentItem,
    variant: Variant
  ) {
    super(context, parent, variant.rootInstance);
    this.variant = variant;
    makeObservable(this);
  }

  readonly variant: Variant;

  get key(): string {
    return this.variant.key;
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <StyledRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <StyledIcon icon={switchIcon} iconColor={colors.icon} />
        <TreeRowLabel>Default</TreeRowLabel>
      </StyledRow>
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
    return this.component.key;
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

  private rowElement: HTMLElement | undefined;

  private onNameChange = action((name: string) => {
    this.component.name = name;
    return true;
  });

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <StyledRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <StyledIcon icon={widgetsFilledIcon} iconColor={colors.component} />
        <StyledNameEdit
          color={colors.text}
          isComponent
          value={this.component.name}
          // TODO: validate
          onChange={this.onNameChange}
          disabled={!options.inverted}
          trigger="click"
        />
      </StyledRow>
    );
  }

  handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(COMPONENT_DRAG_MIME, "drag");
  }
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
      this.context.editorState.getOutlineContextMenu()
    );
  }

  canDropData(dataTransfer: DataTransfer) {
    return dataTransfer.types.includes(COMPONENT_DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined) {
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
