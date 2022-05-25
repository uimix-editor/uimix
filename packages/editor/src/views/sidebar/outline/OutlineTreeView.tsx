import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import scrollIntoView from "scroll-into-view-if-needed";
import {
  LeafTreeViewItem,
  RootTreeViewItem,
  TreeViewItem,
} from "@seanchas116/paintkit/src/components/treeview/TreeViewItem";
import {
  TreeRow,
  TreeRowIcon,
  TreeRowLabel,
  TreeRowNameEdit,
} from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import { TreeView } from "@seanchas116/paintkit/src/components/treeview/TreeView";
import {
  ContextMenuController,
  useContextMenu,
} from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import widgetsFilledIcon from "@iconify-icons/ic/baseline-widgets";
import widgetsOutlineIcon from "@iconify-icons/ic/outline-widgets";
import formatBoldIcon from "@iconify-icons/ic/outline-format-bold";
import formatItalicIcon from "@iconify-icons/ic/outline-format-italic";
import interestsIcon from "@iconify-icons/ic/outline-interests";
import inputIcon from "@iconify-icons/ic/outline-login";
import switchIcon from "@seanchas116/paintkit/src/icon/Switch";
import chevronsIcon from "@seanchas116/paintkit/src/icon/Chevrons";
import headingIcon from "@seanchas116/paintkit/src/icon/Heading";
import imageIcon from "@seanchas116/paintkit/src/icon/Image";
import { Color } from "@seanchas116/paintkit/src/util/Color";
import { action, computed, makeObservable, reaction } from "mobx";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { compact } from "lodash-es";
import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { IconifyIcon } from "@iconify/react/dist/offline";
import { EditorState } from "../../../state/EditorState";
import { Component } from "../../../models/Component";
import { DefaultVariant, Variant } from "../../../models/Variant";
import { ElementInstance } from "../../../models/ElementInstance";
import { TextInstance } from "../../../models/TextInstance";
import { Document } from "../../../models/Document";
import { useEditorState } from "../../EditorStateContext";

const slotColor = "#79BFFF";

function colorWithOpacity(colorStr: string, opacity: number): string {
  const color = Color.from(colorStr) ?? Color.white;
  return color.withAlpha(color.a * opacity).toString();
}

function iconForTagName(tagName: string): IconifyIcon {
  if (tagName === "b" || tagName === "strong") {
    return formatBoldIcon;
  }
  if (tagName === "i" || tagName === "em") {
    return formatItalicIcon;
  }
  if (tagName === "img") {
    return imageIcon;
  }
  if (tagName === "svg") {
    return interestsIcon;
  }
  if (tagName === "slot") {
    return inputIcon;
  }
  if (/^h\d$/.test(tagName)) {
    return headingIcon;
  }
  if (tagName.includes("-")) {
    return widgetsOutlineIcon;
  }
  return chevronsIcon;
}

const NODE_DRAG_MIME = "application/x.macaron-tree-drag-node";
const COMPONENT_DRAG_MIME = "application/x.macaron-tree-drag-component";
const VARIANT_DRAG_MIME = "application/x.macaron-tree-drag-variant";

const TreeViewPadding = styled.div`
  height: 8px;
`;

const TagName = styled.div<{ color?: string }>`
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${(p) => p.color || colors.text};
  opacity: 0.5;
  margin-right: 8px;
`;

const ElementIcon = styled(TreeRowIcon)<{ color?: string }>`
  color: ${(p) => p.color || colors.text};
  opacity: 0.5;
`;

const ComponentIcon = styled(TreeRowIcon)`
  color: ${colors.component};
`;

const SlotIcon = styled(TreeRowIcon)`
  color: ${slotColor};
`;

const ComponentNameEdit = styled(TreeRowNameEdit)`
  color: ${colors.componentText};
  font-weight: 700;
`;

const NameEdit = styled(TreeRowNameEdit)<{ color?: string }>`
  color: ${(p) => p.color || colors.text};
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
  const [instanceToItem] = useState(
    () =>
      new WeakMap<
        ElementInstance | TextInstance | Component,
        ElementItem | TextItem | ComponentItem
      >()
  );

  const rootItem = useMemo(
    () =>
      new RootItem({
        editorState,
        contextMenu,
        instanceToItem,
      }),
    [editorState, contextMenu]
  );

  // reveal nodes on selection change
  useEffect(
    () =>
      reaction(
        () => editorState.document.selectedInstances,
        async (instances) => {
          for (const instance of instances) {
            instance.parent?.expandAncestors();
          }

          // wait for render
          await new Promise((resolve) => setTimeout(resolve, 0));

          for (const instance of instances) {
            const item = instanceToItem.get(instance);
            if (item?.rowElement) {
              scrollIntoView(item.rowElement, {
                scrollMode: "if-needed",
              });
            }
          }
        }
      ),
    [editorState, instanceToItem]
  );

  // reveal component on selection change
  useEffect(
    () =>
      reaction(
        () => editorState.document.selectedComponents,
        async (components) => {
          // wait for render
          await new Promise((resolve) => setTimeout(resolve, 0));

          for (const component of components) {
            const item = instanceToItem.get(component);
            if (item?.rowElement) {
              scrollIntoView(item.rowElement, {
                scrollMode: "if-needed",
              });
            }
          }
        }
      ),
    [editorState, instanceToItem]
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
  instanceToItem: WeakMap<
    ElementInstance | TextInstance | Component,
    ElementItem | TextItem | ComponentItem
  >;
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
    context.instanceToItem.set(instance, this);
  }

  readonly context: OutlineContext;
  readonly parent: ElementItem | ComponentItem;
  readonly instance: ElementInstance;

  get children(): readonly TreeViewItem[] {
    return this.instance.children.map((instance) => {
      if (instance.type === "element") {
        if (instance.element.tagName === "slot") {
          return new SlotElementItem(this.context, this, instance);
        }
        return new ElementItem(this.context, this, instance);
      } else {
        return new TextItem(this.context, this, instance);
      }
    });
  }

  get key(): string {
    return this.instance.key;
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
    return this.instance.element.canHaveChildren.value;
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

  private onIDChange = action((id: string) => {
    this.instance.element.setID(id);
    this.context.editorState.history.commit("Change ID");
    return true;
  });

  rowElement: HTMLElement | undefined;

  @computed get icon(): IconifyIcon {
    return iconForTagName(this.instance.element.tagName);
  }

  @computed get isInsideSlot(): boolean {
    if (this.instance.element.tagName === "slot") {
      return true;
    }
    if (this.parent instanceof ElementItem) {
      return this.parent.isInsideSlot;
    }
    return false;
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <StyledRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <ElementIcon
          icon={this.icon}
          style={{
            color: this.isInsideSlot ? slotColor : colors.text,
          }}
        />
        <TagName
          style={{
            color: this.isInsideSlot ? slotColor : colors.text,
          }}
        >
          {this.instance.element.tagName}
        </TagName>
        <NameEdit
          color={this.isInsideSlot ? slotColor : colors.text}
          value={this.instance.element.id}
          // TODO: validate
          onChange={this.onIDChange}
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
    return (
      this.instance.element.canHaveChildren.value &&
      dataTransfer.types.includes(NODE_DRAG_MIME)
    );
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

  handleMouseEnter(): void {
    this.context.editorState.hoveredItem = this.instance;
  }
  handleMouseLeave(): void {
    this.context.editorState.hoveredItem = undefined;
  }
}

class SlotElementItem extends ElementItem {
  private onNameChange = action((name: string) => {
    this.instance.element.attrs.set("name", name);
    this.context.editorState.history.commit("Change Name");
    return true;
  });

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <StyledRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <SlotIcon icon={this.icon} />
        <NameEdit
          color={slotColor}
          value={this.instance.element.attrs.get("name")}
          placeholder="(main slot)"
          // TODO: validate
          onChange={this.onNameChange}
          disabled={!options.inverted}
          trigger="click"
        />
      </StyledRow>
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
    context.instanceToItem.set(instance, this);
  }

  readonly context: OutlineContext;
  readonly parent: ElementItem | VariantItem;
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
    return this.parent.isInsideSlot;
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <StyledRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <NameEdit
          color={colorWithOpacity(this.isInsideSlot ? slotColor : "white", 0.7)}
          value={this.instance.text.content}
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
      this.context.editorState.getTextContextMenu(this.instance)
    );
  }

  handleDragStart(e: React.DragEvent) {
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

class VariantItem extends ElementItem {
  constructor(
    context: OutlineContext,
    parent: ComponentItem,
    variant: Variant | DefaultVariant,
    rootInstance: ElementInstance
  ) {
    super(context, parent, rootInstance);
    this.variant = variant;
    makeObservable(this);
  }

  readonly variant: Variant | DefaultVariant;

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <StyledRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <ElementIcon icon={switchIcon} />
        <TreeRowLabel>{this.variant.name}</TreeRowLabel>
      </StyledRow>
    );
  }

  handleDragStart(e: React.DragEvent) {
    if (this.variant.type === "defaultVariant") {
      return;
    }
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(VARIANT_DRAG_MIME, "drag");
  }
}

class ComponentItem extends TreeViewItem {
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
      <StyledRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <ComponentIcon icon={widgetsFilledIcon} />
        <ComponentNameEdit
          value={this.component.name}
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
      this.context.editorState.getComponentContextMenu(this.component)
    );
  }

  handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(COMPONENT_DRAG_MIME, "drag");
  }

  canDropData(dataTransfer: DataTransfer) {
    return dataTransfer.types.includes(VARIANT_DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined) {
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
      this.context.editorState.getRootContextMenu()
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
