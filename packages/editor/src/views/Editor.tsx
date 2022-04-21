import React from "react";
import styled from "styled-components";
import menuIcon from "@iconify-icons/ic/outline-menu";
import paragraphIcon from "@seanchas116/paintkit/src/icon/Paragraph";
import frameIcon from "@seanchas116/paintkit/src/icon/Frame";
import { ToolBar } from "@seanchas116/paintkit/src/components/toolbar/ToolBar";
import {
  ToolButton,
  ToolButtonArray,
} from "@seanchas116/paintkit/src/components/toolbar/ToolButton";
import { ZoomControl } from "@seanchas116/paintkit/src/components/toolbar/ZoomControl";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { VSplitter } from "@seanchas116/paintkit/src/components/sidebar/VSplitter";
import {
  InspectorTabBar,
  InspectorTabBarItem,
} from "@seanchas116/paintkit/src/components/sidebar/InspectorTabBar";
import { WidthResizeHandle } from "@seanchas116/paintkit/src/components/sidebar/WidthResizeHandle";

const Columns = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  display: flex;
  background-color: ${colors.background};
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Viewport = styled.div`
  background-color: ${colors.uiBackground};
  flex: 1;
`;

const LeftSideBar = styled.div`
  position: relative;
  width: 200px;
  border-right: 2px solid ${colors.separator};
`;

const RightSideBar = styled.div`
  position: relative;
  width: 200px;
  border-left: 2px solid ${colors.separator};
  > * {
    height: 100%;
  }
`;

export const Editor: React.FC = () => {
  const [splitRatio, setSplitRatio] = React.useState(0.5);
  const [rightWidth, setRightWidth] = React.useState(200);

  return (
    <Columns>
      <Center>
        <ToolBar>
          <ToolButton label="Menu" icon={menuIcon} />

          <ToolButtonArray>
            <ToolButton label="Frame" icon={frameIcon} />
            <ToolButton label="Text" icon={paragraphIcon} />
          </ToolButtonArray>

          <ZoomControl
            percentage={100}
            onZoomIn={() => {}}
            onZoomOut={() => {}}
            onChangePercentage={() => {}}
          />
        </ToolBar>
        <Viewport />
      </Center>
      <RightSideBar
        style={{
          width: `${rightWidth}px`,
        }}
      >
        <VSplitter ratio={splitRatio} onChangeRatio={setSplitRatio}>
          <div>
            <InspectorTabBar>
              <InspectorTabBarItem aria-selected>Outline</InspectorTabBarItem>
              <InspectorTabBarItem>Assets</InspectorTabBarItem>
            </InspectorTabBar>
          </div>
          <div>
            <InspectorTabBar>
              <InspectorTabBarItem aria-selected>Element</InspectorTabBarItem>
              <InspectorTabBarItem>Style</InspectorTabBarItem>
            </InspectorTabBar>
          </div>
        </VSplitter>
        <WidthResizeHandle
          position="left"
          width={rightWidth}
          onChangeWidth={setRightWidth}
        />
      </RightSideBar>
    </Columns>
  );
};
