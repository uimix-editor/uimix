import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { Vec2 } from "paintvec";
import React, { useRef } from "react";
import styled from "styled-components";
import { usePointerStroke } from "@seanchas116/paintkit/src/components/hooks/usePointerStroke";
import { useEditorState } from "../EditorStateContext";

export const PanOverlay: React.FC = observer(function PanOverlay() {
  const editorState = useEditorState();

  const lastPosRef = useRef(new Vec2());

  const pointerHandlers = usePointerStroke<HTMLElement>({
    onBegin: action((e) => {
      lastPosRef.current = new Vec2(e.screenX, e.screenY).round;
    }),

    onMove: action((e) => {
      const pos = new Vec2(e.screenX, e.screenY).round;
      const offset = pos.round.sub(lastPosRef.current);
      lastPosRef.current = pos;

      const { scroll } = editorState;
      scroll.translation = scroll.translation.add(offset);
    }),
  });

  return <PanOverlayWrap hidden={!editorState.panMode} {...pointerHandlers} />;
});

const PanOverlayWrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: grab;
`;
