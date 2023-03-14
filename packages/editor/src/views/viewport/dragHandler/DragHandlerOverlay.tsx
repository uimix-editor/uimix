import { action } from "mobx";
import React, { useEffect, useRef } from "react";
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

    const ref = useRef<HTMLDivElement>(null);
    const dragHandlerRef = useRef<DragHandler | null>();

    useEffect(() => {
      const onPointerDown = (e: PointerEvent) => {
        const interval = e.timeStamp - lastClickTimestampRef.current;
        lastClickTimestampRef.current = e.timeStamp;
        const isDoubleClick = interval < doubleClickInterval;

        const pickResult = nodePicker.pick(
          e,
          isDoubleClick ? "doubleClick" : "click"
        );

        viewportState.hoveredSelectable = undefined;
        viewportState.focusedSelectable = undefined;

        if (viewportState.tool?.type === "insert") {
          dragHandlerRef.current = new NodeInsertDragHandler(
            viewportState.tool.mode,
            pickResult
          );
          return;
        }

        if (isDoubleClick) {
          const instance = pickResult.doubleClickable;
          if (instance?.selected && isFocusable(instance)) {
            viewportState.focusedSelectable = instance;
          }
        }

        const clickMove = NodeClickMoveDragHandler.create(pickResult);
        if (clickMove) {
          dragHandlerRef.current = clickMove;
          return;
        }

        projectState.page?.selectable.deselect();
        dragHandlerRef.current = null;
      };
      const onPointerMove = action((e: PointerEvent) => {
        if (e.buttons === 0) {
          onEnd(e);
        }

        if (dragHandlerRef.current) {
          dragHandlerRef.current.move(e);
        } else {
          onHover(e);
        }
      });
      const onEnd = action((e: PointerEvent) => {
        dragHandlerRef.current?.end(e);
        dragHandlerRef.current = null;
      });
      const onHover = action((e: PointerEvent) => {
        viewportState.hoveredSelectable = nodePicker.pick(e).default;
        viewportState.resizeBoxVisible = true;

        snapper.clear();
        if (viewportState.tool?.type === "insert") {
          snapper.snapInsertPoint(scrollState.documentPosForEvent(e));
        }
      });

      const el = ref.current;
      if (el) {
        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("pointerrawupdate", onPointerMove);
        el.addEventListener("pointerup", onEnd);

        return () => {
          el.removeEventListener("pointerdown", onPointerDown);
          el.removeEventListener("pointerrawupdate", onPointerMove);
          el.removeEventListener("pointerup", onEnd);
        };
      }
    }, []);

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
        ref={ref}
        className="absolute left-0 top-0 w-full h-full"
        onContextMenu={onContextMenu}
        style={{
          cursor,
        }}
      />
    );
  }
);
