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

  const showsStyle =
    (type === "element" || type === "variant") &&
    editorState.elementInspectorState.isStyleableElementSelected;

  return (
    <TabArea>
      <InspectorTabBar>
        {showsStyle ? (
          <>
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
          </>
        ) : (
          <InspectorTabBarItem aria-selected>
            {startCase(type)}
          </InspectorTabBarItem>
        )}
      </InspectorTabBar>
      <Scrollable
        hidden={showsStyle && editorState.currentInspectorTab !== "element"}
      >
        {type === "document" ? (
          <DocumentInspector />
        ) : type === "variant" ? (
          <VariantInspector />
        ) : type === "element" ? (
          <ElementInspector />
        ) : undefined}
      </Scrollable>
      <Scrollable
        hidden={!showsStyle || editorState.currentInspectorTab !== "style"}
      >
        <StyleInspector />
      </Scrollable>
    </TabArea>
  );
});
