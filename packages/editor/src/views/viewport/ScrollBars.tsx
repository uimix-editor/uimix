import styled from "styled-components";
import React from "react";
import { Vec2 } from "paintvec";
import { observer } from "mobx-react-lite";
import { action } from "mobx";
import { usePointerStroke } from "@seanchas116/paintkit/src/components/hooks/usePointerStroke";
import { useEditorState } from "../useEditorState";
import { clamp } from "lodash-es";

const ScrollBarsWrap = styled.div``;

const ScrollRailX = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 12px;
  height: 12px;
`;

const ScrollRailY = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 12px;
  width: 12px;
`;

const ScrollBarCommon = styled.div`
  padding: 2px;

  ::before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: black;
    box-shadow: 0 0 1px 0 white;
    border-radius: 4px;
    opacity: 0.3;
  }
`;

const ScrollBarX = styled(ScrollBarCommon)`
  position: absolute;
  top: 0;
  height: 100%;
`;

const ScrollBarY = styled(ScrollBarCommon)`
  position: absolute;
  left: 0;
  width: 100%;
`;

export const ScrollBars: React.FC = observer(function ScrollBars() {
  const editorState = useEditorState();

  const viewBox = editorState.scroll.viewportRect.transform(
    editorState.scroll.viewportToDocument
  );

  const contentBBox = editorState.document.boundingBox;

  const dragFactor = 2;

  const xPointerProps = usePointerStroke<Element, Vec2>({
    onBegin: () => {
      return editorState.scroll.translation;
    },
    onMove: action((e, { totalDeltaX, initData }) => {
      editorState.scroll.translation = initData.sub(
        new Vec2(totalDeltaX * dragFactor, 0)
      );
    }),
  });
  const yPointerProps = usePointerStroke<Element, Vec2>({
    onBegin: () => {
      return editorState.scroll.translation;
    },
    onMove: action((e, { totalDeltaY, initData }) => {
      editorState.scroll.translation = initData.sub(
        new Vec2(0, totalDeltaY * dragFactor)
      );
    }),
  });

  if (!contentBBox) {
    // no content
    return null;
  }

  const xBegin = (viewBox.left - contentBBox.left) / contentBBox.width;
  const xSize = viewBox.width / contentBBox.width;
  const yBegin = (viewBox.top - contentBBox.top) / contentBBox.height;
  const ySize = viewBox.height / contentBBox.height;

  return (
    <ScrollBarsWrap>
      <ScrollRailX>
        <ScrollBarX
          {...xPointerProps}
          style={{
            left: `${clamp(xBegin, 0, 0.9) * 100}%`,
            right: `${clamp(1 - xBegin - xSize, 0, 0.9) * 100}%`,
          }}
        />
      </ScrollRailX>
      <ScrollRailY>
        <ScrollBarY
          {...yPointerProps}
          style={{
            top: `${clamp(yBegin, 0, 0.9) * 100}%`,
            bottom: `${clamp(1 - yBegin - ySize, 0, 0.9) * 100}%`,
          }}
        />
      </ScrollRailY>
    </ScrollBarsWrap>
  );
});
