import { action } from "mobx";
import React, { useMemo } from "react";
import styled from "styled-components";
import { popoverStyle } from "@seanchas116/paintkit/src/components/Common";
import {
  TreeRow,
  TreeRowNameEdit,
} from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import { TreeView } from "@seanchas116/paintkit/src/components/treeview/TreeView";
import {
  RootTreeViewItem,
  LeafTreeViewItem,
  TreeViewItem,
} from "@seanchas116/paintkit/src/components/treeview/TreeViewItem";
import { ColorPicker } from "@seanchas116/paintkit/src/components/color/ColorPicker";
import { isValidCSSIdentifier } from "@seanchas116/paintkit/src/util/Name";
import { PopoverCaster } from "@seanchas116/paintkit/src/components/PopoverCaster";
import { CSSVariable } from "../../../../models/CSSVariable";
import { EditorState } from "../../../../state/EditorState";
import { CSSVariableList } from "../../../../models/CSSVariableList";
import { useEditorState } from "../../../EditorStateContext";

const DRAG_MIME = "application/x.macaron-tree-drag-css-variable";

const ColorIcon = styled.div`
  width: 16px;
  height: 16px;
  min-width: 16px;
  margin-right: 8px;
  background-color: var(--color);
  border-radius: 50%;
  cursor: pointer;
`;

const ColorPickerWrap = styled.div`
  ${popoverStyle}
`;

class CSSVariableItem extends LeafTreeViewItem {
  constructor(parent: CSSVariableListItem, variable: CSSVariable) {
    super();
    this.parent = parent;
    this.variable = variable;
  }

  readonly parent: CSSVariableListItem;
  readonly variable: CSSVariable;

  get key(): string {
    return this.variable.name;
  }
  get selected(): boolean {
    return this.variable.selected;
  }
  get hovered(): boolean {
    return false;
  }

  private onNameChange = action((name: string) => {
    this.variable.rename(name);
    this.parent.editorState.history.commit("Change CSS Variable Name");
    return true;
  });

  renderRow(options: { inverted: boolean }): React.ReactNode {
    const value = this.variable.color;

    return (
      <TreeRow inverted={options.inverted}>
        <PopoverCaster
          anchor={(open) => (
            <ColorIcon
              onClick={(e) => {
                open(e.currentTarget.getBoundingClientRect());
              }}
              style={
                {
                  "--color": value.toString(),
                } as React.CSSProperties
              }
            />
          )}
          popover={() => {
            return (
              <ColorPickerWrap>
                <ColorPicker
                  color={value}
                  onChange={action((color) => {
                    this.variable.color = color;
                  })}
                  onChangeEnd={() => {
                    this.parent.editorState.history.commit(
                      "Change CSS Variable Color"
                    );
                  }}
                />
              </ColorPickerWrap>
            );
          }}
        />
        <TreeRowNameEdit
          value={this.variable.name}
          validate={(name) => {
            if (!isValidCSSIdentifier(name)) {
              return {
                isValid: false,
                message: "Name must be a valid CSS identifier",
              };
            }
            return { isValid: true };
          }}
          onChange={this.onNameChange}
          disabled={!options.inverted}
          trigger="click"
        />
      </TreeRow>
    );
  }
  deselect(): void {
    this.variable.selected = false;
  }
  select(): void {
    this.variable.selected = true;
  }

  handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(DRAG_MIME, "drag");
  }
}

class CSSVariableListItem extends RootTreeViewItem {
  constructor(editorState: EditorState, list: CSSVariableList) {
    super();
    this.editorState = editorState;
    this.list = list;
  }

  readonly editorState: EditorState;
  readonly list: CSSVariableList;

  get children(): readonly TreeViewItem[] {
    return this.list.children.map((v) => new CSSVariableItem(this, v));
  }

  deselect(): void {
    this.list.deselectAll();
  }

  canDropData(dataTransfer: DataTransfer) {
    return dataTransfer.types.includes(DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined) {
    const copy = event.altKey || event.ctrlKey;
    const beforeNode = (before as CSSVariableItem | undefined)?.variable;

    // TODO: copy
    for (const node of this.list.selectedVariables) {
      this.list.insertBefore(node, beforeNode);
    }

    this.editorState.history.commit(
      copy ? "Duplicate CSS Variables" : "Move CSS Variables"
    );
  }
}

const TreeViewPadding = styled.div`
  height: 8px;
`;

export const CSSVariableListView: React.FC<{
  className?: string;
}> = ({ className }) => {
  const editorState = useEditorState();

  const rootItem = useMemo(
    () =>
      new CSSVariableListItem(editorState, editorState.document.cssVariables),
    [editorState]
  );

  return (
    <TreeView
      className={className}
      rootItem={rootItem}
      scroll={false}
      header={<TreeViewPadding />}
      footer={<TreeViewPadding />}
    />
  );
};
