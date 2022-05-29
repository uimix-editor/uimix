import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import scrollIntoView from "scroll-into-view-if-needed";
import { TreeView } from "@seanchas116/paintkit/src/components/treeview/TreeView";
import { useContextMenu } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { reaction } from "mobx";
import { Component } from "../../../models/Component";
import { ElementInstance } from "../../../models/ElementInstance";
import { TextInstance } from "../../../models/TextInstance";
import { useEditorState } from "../../EditorStateContext";
import { ElementItem } from "./ElementItem";
import { ComponentItem } from "./ComponentItem";
import { RootItem } from "./RootItem";
import { TextItem } from "./TextItem";

const TreeViewPadding = styled.div`
  height: 8px;
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
            instance.expandAncestors();
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
