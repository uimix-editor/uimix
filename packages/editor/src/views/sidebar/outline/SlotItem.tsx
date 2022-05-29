import React from "react";
import { TreeViewItem } from "@seanchas116/paintkit/src/components/treeview/TreeViewItem";
import arrowForwardIcon from "@iconify-icons/ic/outline-arrow-forward";
import { action, makeObservable } from "mobx";
import { Icon } from "@iconify/react/dist/offline";
import styled, { css } from "styled-components";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { TreeRow } from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import { Element } from "../../../models/Element";
import { Text } from "../../../models/Text";
import { getInstance } from "../../../models/InstanceRegistry";
import { ElementInstance } from "../../../models/ElementInstance";
import { NODE_DRAG_MIME, slotColor } from "./Common";
import { OutlineContext } from "./OutlineContext";
import { createItemForInstance, ElementItem } from "./ElementItem";
import { TextItem } from "./TextItem";

const SlotIndicator = styled.div<{ rowSelected?: boolean }>`
  color: ${slotColor};
  margin-right: 8px;
  margin-left: -12px;
  display: flex;
  align-items: center;
  gap: 4px;

  ${(p) =>
    p.rowSelected &&
    css`
      color: ${colors.activeText};
    `}
`;

export class SlotItem extends TreeViewItem {
  constructor(context: OutlineContext, parent: ElementItem, slotName: string) {
    super();
    this.context = context;
    this.parent = parent;
    this.slotName = slotName;
    makeObservable(this);
  }

  context: OutlineContext;
  parent: ElementItem;
  slotName: string;

  get key(): string {
    return this.parent.key + ":" + this.slotName;
  }

  get children(): readonly TreeViewItem[] {
    const childInstances = this.parent.instance.children.filter((child) => {
      if (child.type === "text") {
        return this.slotName === "";
      }
      return (child.element.attrs.get("slot") ?? "") === this.slotName;
    });

    return childInstances.map((i) =>
      createItemForInstance(this.context, this, i)
    );
  }
  get selected(): boolean {
    return false;
  }
  get hovered(): boolean {
    return false;
  }
  get collapsed(): boolean {
    return false;
  }
  get showsCollapseButton(): boolean {
    return false;
  }
  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <SlotIndicator rowSelected={options.inverted}>
          <Icon icon={arrowForwardIcon} />
          {this.slotName || "(main slot)"}
        </SlotIndicator>
      </TreeRow>
    );
  }
  deselect(): void {}
  select(): void {}
  toggleCollapsed(): void {}

  handleContextMenu(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    const instance = this.parent.instance;
    const editorState = this.context.editorState;

    this.context.contextMenu.show(e.clientX, e.clientY, [
      {
        text: "Add Element",
        onClick: action(() => {
          const element = new Element({ tagName: "div" });
          element.rename("div");
          if (this.slotName) {
            element.attrs.set("slot", this.slotName);
          }
          instance.element.append(element);

          const addedInstance = getInstance(instance.variant, element);
          editorState.document.deselect();
          addedInstance.select();

          editorState.history.commit("Add Element");
          return true;
        }),
      },
      {
        text: "Add Text",
        onClick: action(() => {
          const text = new Text({ content: "Text" });
          instance.element.append(text);

          const addedInstance = getInstance(instance.variant, text);
          editorState.document.deselect();
          addedInstance.select();

          editorState.history.commit("Add Text");
          return true;
        }),
      },
    ]);
  }

  canDropData(dataTransfer: DataTransfer): boolean {
    return (
      this.parent.instance.element.canHaveChildren.isValid &&
      dataTransfer.types.includes(NODE_DRAG_MIME)
    );
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined): void {
    const copy = event.altKey || event.ctrlKey;
    const beforeNode = (before as ElementItem | TextItem | undefined)?.instance
      .node;

    // TODO: copy
    for (const node of this.context.editorState.document.selectedNodes) {
      if (node.type === "element") {
        node.attrs.set("slot", this.slotName);
        this.parent.instance.node.insertBefore(node, beforeNode);
      } else {
        if (this.slotName === "") {
          this.parent.instance.node.insertBefore(node, beforeNode);
        } else {
          const span = new Element({ tagName: "span" });
          span.attrs.set("slot", this.slotName);
          span.append(node);
          this.parent.instance.node.insertBefore(span, beforeNode);
        }
      }
    }

    this.context.editorState.history.commit(
      copy ? "Duplicate Layers" : "Move Layers"
    );
  }
}
