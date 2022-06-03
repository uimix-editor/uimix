import React, { useCallback } from "react";
import styled from "styled-components";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { VSplitter } from "@seanchas116/paintkit/src/components/sidebar/VSplitter";
import {
  InspectorTabBar,
  InspectorTabBarItem,
} from "@seanchas116/paintkit/src/components/sidebar/InspectorTabBar";
import { WidthResizeHandle } from "@seanchas116/paintkit/src/components/sidebar/WidthResizeHandle";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useEditorState } from "../useEditorState";
import { OutlineTreeView } from "./outline/OutlineTreeView";
import { AssetBrowser } from "./assets/AssetBrowser";
import { InspectorTabs } from "./inspector/InspectorTabs";

const SideBarWrap = styled.div`
  position: relative;
  width: 200px;
  border-left: 2px solid ${colors.separator};
  > * {
    height: 100%;
  }
`;

const minSideBarWidth = 256;

const TabArea = styled.div`
  display: flex;
  flex-direction: column;

  > :not(:first-child) {
    flex: 1;
  }
`;

export const UnifiedSideBar: React.FC = observer(() => {
  const editorState = useEditorState();

  const onClickOutlineTab = useCallback(
    action(() => {
      editorState.currentOutlineTab = "outline";
    }),
    [editorState]
  );
  const onClickAssetsTab = useCallback(
    action(() => {
      editorState.currentOutlineTab = "assets";
    }),
    [editorState]
  );
  const onChangeSplitRatio = useCallback(
    action((ratio: number) => {
      editorState.sideBarSplitRatio = ratio;
    }),
    [editorState]
  );
  const onChangeWidth = useCallback(
    action((width: number) => {
      editorState.rightSideBarWidth = Math.max(width, minSideBarWidth);
    }),
    [editorState]
  );

  return (
    <SideBarWrap
      style={{
        width: `${editorState.rightSideBarWidth}px`,
      }}
    >
      <TabArea>
        <InspectorTabBar>
          <InspectorTabBarItem
            aria-selected={editorState.currentOutlineTab === "outline"}
            onClick={onClickOutlineTab}
          >
            Outline
          </InspectorTabBarItem>
          <InspectorTabBarItem
            aria-selected={editorState.currentOutlineTab === "assets"}
            onClick={onClickAssetsTab}
          >
            Assets
          </InspectorTabBarItem>
        </InspectorTabBar>
        <VSplitter
          ratio={editorState.sideBarSplitRatio}
          onChangeRatio={onChangeSplitRatio}
          hidden={editorState.currentOutlineTab !== "outline"}
        >
          <OutlineTreeView />
          <InspectorTabs />
        </VSplitter>
        <AssetBrowser hidden={editorState.currentOutlineTab !== "assets"} />
      </TabArea>
      <WidthResizeHandle
        position="left"
        width={editorState.rightSideBarWidth}
        onChangeWidth={onChangeWidth}
      />
    </SideBarWrap>
  );
});

export const RightSideBar: React.FC = observer(() => {
  const editorState = useEditorState();

  const onChangeWidth = useCallback(
    action((width: number) => {
      editorState.rightSideBarWidth = Math.max(width, minSideBarWidth);
    }),
    [editorState]
  );

  return (
    <SideBarWrap
      style={{
        width: `${editorState.rightSideBarWidth}px`,
      }}
    >
      <InspectorTabs />
      <WidthResizeHandle
        position="left"
        width={editorState.rightSideBarWidth}
        onChangeWidth={onChangeWidth}
      />
    </SideBarWrap>
  );
});

export const LeftSideBar: React.FC = observer(() => {
  const editorState = useEditorState();

  const onClickOutlineTab = useCallback(
    action(() => {
      editorState.currentOutlineTab = "outline";
    }),
    [editorState]
  );
  const onClickAssetsTab = useCallback(
    action(() => {
      editorState.currentOutlineTab = "assets";
    }),
    [editorState]
  );
  const onChangeWidth = useCallback(
    action((width: number) => {
      editorState.leftSideBarWidth = Math.max(width, minSideBarWidth);
    }),
    [editorState]
  );

  return (
    <SideBarWrap
      style={{
        width: `${editorState.leftSideBarWidth}px`,
      }}
    >
      <TabArea>
        <InspectorTabBar>
          <InspectorTabBarItem
            aria-selected={editorState.currentOutlineTab === "outline"}
            onClick={onClickOutlineTab}
          >
            Outline
          </InspectorTabBarItem>
          <InspectorTabBarItem
            aria-selected={editorState.currentOutlineTab === "assets"}
            onClick={onClickAssetsTab}
          >
            Assets
          </InspectorTabBarItem>
        </InspectorTabBar>
        <OutlineTreeView hidden={editorState.currentOutlineTab !== "outline"} />
        <AssetBrowser hidden={editorState.currentOutlineTab !== "assets"} />
      </TabArea>
      <WidthResizeHandle
        position="right"
        width={editorState.leftSideBarWidth}
        onChangeWidth={onChangeWidth}
      />
    </SideBarWrap>
  );
});
