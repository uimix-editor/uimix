import React, { useCallback } from "react";
import styled from "styled-components";
import {
  InspectorTabBar,
  InspectorTabBarItem,
} from "@seanchas116/paintkit/src/components/sidebar/InspectorTabBar";
import { Scrollable } from "@seanchas116/paintkit/src/components/Scrollable";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useEditorState } from "../../EditorStateContext";
import { ElementInspector } from "./element/ElementInspector";
import { VariantInspector } from "./VariantInspector";
import { StyleInspector } from "./style/StyleInspector";
import { DocumentInspector } from "./document/DocumentInspector";

const TabArea = styled.div`
  display: flex;
  flex-direction: column;

  > :not(:first-child) {
    flex: 1;
  }
`;

export const InspectorTabs: React.FC = observer(function InspectorTabs() {
  const editorState = useEditorState();

  const onClickElementTab = useCallback(
    action(() => {
      editorState.currentInspectorTab = "element";
    }),
    [editorState]
  );
  const onClickStyleTab = useCallback(
    action(() => {
      editorState.currentInspectorTab = "style";
    }),
    [editorState]
  );

  return (
    <TabArea hidden={editorState.currentOutlineTab === "assets"}>
      <InspectorTabBar>
        <InspectorTabBarItem
          aria-selected={editorState.currentInspectorTab === "element"}
          onClick={onClickElementTab}
        >
          Element
        </InspectorTabBarItem>
        <InspectorTabBarItem
          aria-selected={editorState.currentInspectorTab === "style"}
          onClick={onClickStyleTab}
        >
          Style
        </InspectorTabBarItem>
      </InspectorTabBar>
      <Scrollable hidden={editorState.currentInspectorTab !== "element"}>
        {editorState.variantInspectorState.isVisible ? (
          <VariantInspector />
        ) : editorState.elementInspectorState.isVisible ? (
          <ElementInspector />
        ) : (
          <DocumentInspector />
        )}
      </Scrollable>
      <Scrollable hidden={editorState.currentInspectorTab !== "style"}>
        <StyleInspector />
      </Scrollable>
    </TabArea>
  );
});
