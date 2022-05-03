import { usePointerStroke } from "@seanchas116/paintkit/src/components/hooks/usePointerStroke";
import { action } from "mobx";
import React, { useRef } from "react";
import styled from "styled-components";
import { useEditorState } from "../../EditorStateContext";
import { doubleClickInterval } from "../Constants";
import { DragHandler } from "./DragHandler";
import { ElementClickMoveDragHandler } from "./ElementClickMoveDragHandler";
import { ElementInsertDragHandler } from "./ElementInsertDragHandler";

const PointerOverlayWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

export const PointerOverlay: React.FC<{}> = () => {
  const editorState = useEditorState();

  const lastClickTimestampRef = useRef(0);

  const pointerProps = usePointerStroke<
    HTMLDivElement,
    DragHandler | undefined
  >({
    onBegin: action((e: React.PointerEvent) => {
      const interval = e.timeStamp - lastClickTimestampRef.current;
      lastClickTimestampRef.current = e.timeStamp;
      const isDoubleClick = interval < doubleClickInterval;

      const pickResult = editorState.elementPicker.pick(
        e.nativeEvent,
        isDoubleClick ? "doubleClick" : "click"
      );

      editorState.hoveredItem = undefined;
      // editorState.endTextEdit();

      if (editorState.insertMode) {
        return new ElementInsertDragHandler(editorState, pickResult);
      }

      // if (isDoubleClick) {
      //   const override = pickResult.doubleClickable;
      //   if (override?.selected) {
      //     if (editorState.startTextEdit(override)) {
      //       return;
      //     }
      //   }
      // }

      const clickMove = ElementClickMoveDragHandler.create(
        editorState,
        pickResult
      );
      if (clickMove) {
        return clickMove;
      }

      editorState.document.deselect();
    }),
    onMove: action((e: React.PointerEvent, { initData: dragHandler }) => {
      if (dragHandler) {
        dragHandler.move(e.nativeEvent);
      }
    }),
    onEnd: action((e: React.PointerEvent, { initData: dragHandler }) => {
      if (dragHandler) {
        dragHandler.end(e.nativeEvent);
      }
    }),
    onHover: action((e: React.PointerEvent) => {
      editorState.hoveredItem = editorState.elementPicker.pick(
        e.nativeEvent
      ).default;
      editorState.resizeBoxVisible = true;

      // TODO: snapping
      // editorState.snapper.clear();
      // if (editorState.insertMode) {
      //   editorState.snapper.snapInsertPoint(
      //     editorState.scroll.documentPosForEvent(e)
      //   );
      // }
    }),
  });

  return <PointerOverlayWrap {...pointerProps}></PointerOverlayWrap>;
};
