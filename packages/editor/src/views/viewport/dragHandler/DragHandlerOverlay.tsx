import { action } from "mobx";
import React, { useRef } from "react";
import { DragHandler } from "./DragHandler";
import { NodeClickMoveDragHandler } from "./NodeClickMoveDragHandler";
import { NodeInsertDragHandler } from "./NodeInsertDragHandler";
import { Selectable } from "../../../models/Selectable";
import { usePointerStroke } from "../../../components/hooks/usePointerStroke";
import { doubleClickInterval } from "../constants";
import { nodePicker } from "../renderer/NodePicker";
import { projectState } from "../../../state/ProjectState";
import { scrollState } from "../../../state/ScrollState";
import { snapper } from "../../../state/Snapper";
import { commands } from "../../../state/Commands";
import { observer } from "mobx-react-lite";
import { showContextMenu } from "../../ContextMenu";
import { viewportState } from "../../../state/ViewportState";

function isFocusable(selectable: Selectable) {
  return selectable.originalNode.type === "text";
}

export const DragHandlerOverlay: React.FC = observer(
  function DrdagHandlerOverlay() {
    const lastClickTimestampRef = useRef(0);

    const pointerProps = usePointerStroke<
      HTMLDivElement,
      DragHandler | undefined
    >({
      onBegin: action((e: React.PointerEvent) => {
        const interval = e.timeStamp - lastClickTimestampRef.current;
        lastClickTimestampRef.current = e.timeStamp;
        const isDoubleClick = interval < doubleClickInterval;

        const pickResult = nodePicker.pick(
          e.nativeEvent,
          isDoubleClick ? "doubleClick" : "click"
        );

        viewportState.hoveredSelectable = undefined;
        viewportState.focusedSelectable = undefined;

        if (viewportState.tool?.type === "insert") {
          return new NodeInsertDragHandler(viewportState.tool.mode, pickResult);
        }

        if (isDoubleClick) {
          const instance = pickResult.doubleClickable;
          if (instance?.selected && isFocusable(instance)) {
            viewportState.focusedSelectable = instance;
          }
        }

        const clickMove = NodeClickMoveDragHandler.create(pickResult);
        if (clickMove) {
          return clickMove;
        }

        projectState.page?.selectable.deselect();
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
        viewportState.hoveredSelectable = nodePicker.pick(
          e.nativeEvent
        ).default;
        viewportState.resizeBoxVisible = true;

        snapper.clear();
        if (viewportState.tool?.type === "insert") {
          snapper.snapInsertPoint(scrollState.documentPosForEvent(e));
        }
      }),
    });

    const onContextMenu = action((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const page = projectState.page;
      if (!page) {
        return;
      }

      const override = nodePicker.pick(e.nativeEvent).default;
      if (override) {
        if (!override.selected) {
          page.selectable.deselect();
          override.select();
        }
      } else {
        page.selectable.deselect();
      }

      showContextMenu(
        e,
        commands.contextMenuForSelectable(override ?? page.selectable)
      );
    });

    const cursor =
      viewportState.tool?.type === "insert" ? "crosshair" : undefined;

    return (
      <div
        className="absolute left-0 top-0 w-full h-full"
        {...pointerProps}
        onContextMenu={onContextMenu}
        style={{
          cursor,
        }}
      />
    );
  }
);
