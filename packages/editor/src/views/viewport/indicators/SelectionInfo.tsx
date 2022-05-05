import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { Rect } from "paintvec";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { sameOrNone } from "@seanchas116/paintkit/src/util/Collection";
import { useEditorState } from "../../EditorStateContext";

const SelectionInfoWrap = styled.div`
  position: absolute;

  height: 16px;
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

const Separator = styled.div`
  width: 1px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  margin: 0 6px;
`;

export const SelectionInfo: React.FC = observer(function SelectionInfo() {
  const editorState = useEditorState();

  const instances = editorState.document.selectedElementInstances;

  const bboxes = instances.map((i) => i.boundingBox);
  const bbox = Rect.union(...bboxes);
  if (!bbox) {
    return <></>;
  }
  const bboxInViewport = bbox.transform(editorState.scroll.documentToViewport);

  const tagName =
    sameOrNone(instances.map((i) => i.element.tagName)) || "Multiple";

  const width = Number.parseFloat(bbox.width.toFixed(2));
  const height = Number.parseFloat(bbox.height.toFixed(2));

  return (
    <SelectionInfoWrap
      style={{
        left: `${(bboxInViewport.left + bboxInViewport.right) / 2}px`,
        top: `${bboxInViewport.bottom + 4}px`,
      }}
    >
      <Text>{tagName}</Text>
      <Separator />
      <Text>
        {width} × {height}
      </Text>
    </SelectionInfoWrap>
  );
});
