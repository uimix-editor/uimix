import React from "react";
import { observer } from "mobx-react-lite";
import { Rect } from "paintvec";
import styled from "@emotion/styled";
import colors from "../../../colors";
import { projectState } from "../../../state/ProjectState";
import { viewportState } from "../../../state/ViewportState";

const SelectionInfoWrap = styled.div`
  position: absolute;

  height: 20px;
  border-radius: 4px;
  padding: 0 8px;
  transform: translate(-50%, 0);

  display: flex;
  align-items: center;

  background: ${colors.active};

  white-space: nowrap;
`;

const Text = styled.div`
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: white;
`;

// const Separator = styled.div`
//   width: 1px;
//   height: 8px;
//   background: rgba(255, 255, 255, 0.5);
//   margin: 0 6px;
// `;

export const SelectionInfo: React.FC = observer(function SelectionInfo() {
  if (viewportState.focusedSelectable) {
    return null;
  }

  const selectables = projectState.selectedSelectables;

  const bboxes = selectables.map((i) => i.computedRect);
  const bbox = Rect.union(...bboxes);
  if (!bbox) {
    return null;
  }
  const bboxInViewport = bbox.transform(projectState.scroll.documentToViewport);

  // const tagName =
  //   sameOrNone(
  //     selectables.map((i) => {
  //       // TODO: other tagnames
  //       return "div";
  //     })
  //   ) || "Multiple";

  const width = Number.parseFloat(bbox.width.toFixed(2));
  const height = Number.parseFloat(bbox.height.toFixed(2));

  return (
    <SelectionInfoWrap
      style={{
        left: `${(bboxInViewport.left + bboxInViewport.right) / 2}px`,
        top: `${bboxInViewport.bottom + 6}px`,
      }}
    >
      {/* <Text>{tagName}</Text>
      <Separator /> */}
      <Text>
        {width} × {height}
      </Text>
    </SelectionInfoWrap>
  );
});
