import React from "react";
import styled from "styled-components";
import { TreeViewItem } from "@seanchas116/paintkit/src/components/treeview/TreeViewItem";
import {
  TreeRow,
  TreeRowIcon,
} from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import widgetsOutlineIcon from "@iconify-icons/ic/outline-widgets";
import formatBoldIcon from "@iconify-icons/ic/outline-format-bold";
import formatItalicIcon from "@iconify-icons/ic/outline-format-italic";
import interestsIcon from "@iconify-icons/ic/outline-interests";
import inputIcon from "@iconify-icons/ic/outline-login";
import chevronsIcon from "@seanchas116/paintkit/src/icon/Chevrons";
import headingIcon from "@seanchas116/paintkit/src/icon/Heading";
import imageIcon from "@seanchas116/paintkit/src/icon/Image";
import { action, computed, makeObservable } from "mobx";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { IconifyIcon } from "@iconify/react/dist/offline";
import { isValidCSSIdentifier } from "@seanchas116/paintkit/src/util/Name";
import { ElementInstance } from "../../../models/ElementInstance";
import { TextInstance } from "../../../models/TextInstance";
import { Element } from "../../../models/Element";
import { Text } from "../../../models/Text";
import { NameEdit, NODE_DRAG_MIME, slotColor } from "./Common";
import { OutlineContext } from "./OutlineContext";
import { ComponentItem } from "./ComponentItem";
import { SlotItem } from "./SlotItem";
import { TextItem } from "./TextItem";

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

const TagName = styled.div<{ color?: string }>`
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${(p) => p.color || colors.text};
  opacity: 0.5;
  margin-right: 8px;
`;

export const ElementIcon = styled(TreeRowIcon)<{ color?: string }>`
  color: ${(p) => p.color || colors.text};
  opacity: 0.5;
`;

const SlotIcon = styled(TreeRowIcon)`
  color: ${slotColor};
`;

export function createItemForInstance(
  context: OutlineContext,
  parent: ElementItem | ComponentItem | SlotItem,
  instance: ElementInstance | TextInstance
): ElementItem | TextItem {
  if (instance.type === "element") {
    if (instance.element.tagName === "slot") {
      return new SlotElementItem(context, parent, instance);
    }
    return new ElementItem(context, parent, instance);
  } else {
    return new TextItem(context, parent, instance);
  }
}

export class ElementItem extends TreeViewItem {
  constructor(
    context: OutlineContext,
    parent: ElementItem | ComponentItem | SlotItem,
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
  readonly parent: ElementItem | ComponentItem | SlotItem;
  readonly instance: ElementInstance;

  get children(): readonly TreeViewItem[] {
    const customElementMetadata =
      this.context.editorState.document.getCustomElementMetadata(
        this.instance.element.tagName
      );

    if (customElementMetadata) {
      return customElementMetadata.slots.map(
        (slot) => new SlotItem(this.context, this, slot.name ?? "")
      );
    }

    return this.instance.children.map((instance) =>
      createItemForInstance(this.context, this, instance)
    );
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
    return this.instance.element.canHaveChildren.isValid;
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
      <TreeRow
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
          rowSelected={options.inverted}
          value={this.instance.element.id}
          validate={(name) => {
            if (name && !isValidCSSIdentifier(name)) {
              return {
                isValid: false,
                message: "Name must be a valid CSS identifier",
              };
            }
            return { isValid: true };
          }}
          onChange={this.onIDChange}
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
      this.context.editorState.getElementContextMenu(this.instance)
    );
  }

  handleDragStart(e: React.DragEvent): void {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(NODE_DRAG_MIME, "drag");
  }

  canDropData(dataTransfer: DataTransfer): boolean {
    return (
      this.instance.element.canHaveChildren.isValid &&
      dataTransfer.types.includes(NODE_DRAG_MIME)
    );
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined): void {
    const copy = event.altKey || event.ctrlKey;

    let beforeNode: Element | Text | undefined;
    if (before instanceof ElementItem || before instanceof TextItem) {
      beforeNode = before.instance.node;
    }

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

export class SlotElementItem extends ElementItem {
  private onNameChange = action((name: string) => {
    if (name) {
      this.instance.element.attrs.set("name", name);
    } else {
      this.instance.element.attrs.delete("name");
    }
    this.context.editorState.history.commit("Change Name");
    return true;
  });

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <TreeRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <SlotIcon icon={this.icon} />
        <NameEdit
          color={slotColor}
          value={this.instance.element.attrs.get("name")}
          rowSelected={options.inverted}
          placeholder="(main slot)"
          nonDimmedPlaceholder
          // TODO: validate
          onChange={this.onNameChange}
          disabled={!options.inverted}
          trigger="click"
        />
      </TreeRow>
    );
  }
}
