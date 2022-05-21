import { action } from "mobx";
import React, { useMemo } from "react";
import styled from "styled-components";
import { popoverStyle } from "@seanchas116/paintkit/src/components/Common";
import { PopoverButton } from "@seanchas116/paintkit/src/components/PopoverButton";
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
  constructor(parent: CSSVariableListViewItem, token: CSSVariable) {
    super();
    this.parent = parent;
    this.token = token;
  }

  readonly parent: CSSVariableListViewItem;
  readonly token: CSSVariable;

  get key(): string {
    return this.token.name;
  }
  get selected(): boolean {
    return this.token.selected;
  }
  get hovered(): boolean {
    return false;
  }

  private onNameChange = action((name: string) => {
    this.token.rename(name);
    this.parent.editorState.history.commit("Change Color Token Name");
    return true;
  });

  renderRow(options: { inverted: boolean }): React.ReactNode {
    const value = this.token.color;

    return (
      <TreeRow inverted={options.inverted}>
        <PopoverButton
          button={(open, onClick) => (
            <ColorIcon
              onClick={onClick}
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
                    this.token.color = color;
                  })}
                  onChangeEnd={() => {
                    this.parent.editorState.history.commit(
                      "Change Color Token Color"
                    );
                  }}
                />
              </ColorPickerWrap>
            );
          }}
        />
        <TreeRowNameEdit
          value={this.token.name}
          validate={(name) => {
            if (!isValidCSSIdentifier(name)) {
              return {
                value: false,
                error: "Name must be a valid CSS identifier",
              };
            }
            return { value: true };
          }}
          onChange={this.onNameChange}
          disabled={!options.inverted}
          trigger="click"
        />
      </TreeRow>
    );
  }
  deselect(): void {
    this.token.selected = false;
  }
  select(): void {
    this.token.selected = true;
  }

  handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(DRAG_MIME, "drag");
  }
}

class CSSVariableListViewItem extends RootTreeViewItem {
  constructor(editorState: EditorState, list: CSSVariableList) {
    super();
    this.editorState = editorState;
    this.list = list;
  }

  readonly editorState: EditorState;
  readonly list: CSSVariableList;

  get children(): readonly TreeViewItem[] {
    return this.list.children.map((token) => new CSSVariableItem(this, token));
  }

  deselect(): void {
    this.list.deselectAll();
  }

  canDropData(dataTransfer: DataTransfer) {
    return dataTransfer.types.includes(DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined) {
    const copy = event.altKey || event.ctrlKey;
    const beforeNode = (before as CSSVariableItem | undefined)?.token;

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
      new CSSVariableListViewItem(
        editorState,
        editorState.document.cssVariables
      ),
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
