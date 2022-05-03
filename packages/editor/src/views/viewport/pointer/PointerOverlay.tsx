import { Vec2 } from "paintvec";
import React from "react";
import { useCallback } from "react";
import styled from "styled-components";
import { ElementPicker } from "../../../mount/ElementPicker";
import { useEditorState } from "../../EditorStateContext";

const PointerOverlayWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

export const PointerOverlay: React.FC<{
  picker: ElementPicker;
}> = ({ picker }) => {
  const editorState = useEditorState();

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const pos = new Vec2(e.clientX, e.clientY).sub(
        editorState.scroll.viewportClientRect.topLeft
      );

      console.log(
        picker.pick({
          clientX: pos.x,
          clientY: pos.y,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
        })
      );
    },
    [editorState]
  );

  return <PointerOverlayWrap onClick={onClick}></PointerOverlayWrap>;
};
