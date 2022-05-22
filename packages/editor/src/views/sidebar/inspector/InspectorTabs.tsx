import React, { useCallback } from "react";
import styled from "styled-components";
import {
  InspectorTabBar,
  InspectorTabBarItem,
} from "@seanchas116/paintkit/src/components/sidebar/InspectorTabBar";
import { Scrollable } from "@seanchas116/paintkit/src/components/Scrollable";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { startCase } from "lodash-es";
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

  let type: "element" | "text" | "variant" | "component" | "document";

  const selectedInstances = editorState.document.selectedInstances;
  if (selectedInstances.length) {
    if (selectedInstances.some((i) => !i.parent)) {
      type = "variant";
    } else if (selectedInstances.some((i) => i.type === "element")) {
      type = "element";
    } else {
      type = "text";
    }
  } else {
    if (editorState.document.selectedComponents.length) {
      type = "component";
    } else {
      type = "document";
    }
  }

  switch (type) {
    case "text": {
      return (
        <TabArea>
          <InspectorTabBar>
            <InspectorTabBarItem aria-selected>Text</InspectorTabBarItem>
          </InspectorTabBar>
        </TabArea>
      );
    }
    case "variant":
    case "element": {
      return (
        <TabArea>
          <InspectorTabBar>
            <InspectorTabBarItem
              aria-selected={editorState.currentInspectorTab === "element"}
              onClick={onClickElementTab}
            >
              {startCase(type)}
            </InspectorTabBarItem>
            <InspectorTabBarItem
              aria-selected={editorState.currentInspectorTab === "style"}
              onClick={onClickStyleTab}
            >
              Style
            </InspectorTabBarItem>
          </InspectorTabBar>
          <Scrollable hidden={editorState.currentInspectorTab !== "element"}>
            {type === "variant" ? <VariantInspector /> : <ElementInspector />}
          </Scrollable>
          <Scrollable hidden={editorState.currentInspectorTab !== "style"}>
            <StyleInspector />
          </Scrollable>
        </TabArea>
      );
    }
    case "document": {
      return (
        <TabArea>
          <InspectorTabBar>
            <InspectorTabBarItem aria-selected>Document</InspectorTabBarItem>
          </InspectorTabBar>
          <DocumentInspector />
        </TabArea>
      );
    }
    case "component": {
      return (
        <TabArea>
          <InspectorTabBar>
            <InspectorTabBarItem aria-selected>Component</InspectorTabBarItem>
          </InspectorTabBar>
        </TabArea>
      );
    }
  }
});
