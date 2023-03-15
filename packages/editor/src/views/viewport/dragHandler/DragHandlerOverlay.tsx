import { action } from "mobx";
import React, { useEffect, useRef } from "react";
import { DragHandler } from "./DragHandler";
import { NodeClickMoveDragHandler } from "./NodeClickMoveDragHandler";
import { NodeInsertDragHandler } from "./NodeInsertDragHandler";
import { Selectable } from "../../../models/Selectable";
import { doubleClickInterval } from "../constants";
import { NodePickResult } from "../renderer/NodePicker";
import { projectState } from "../../../state/ProjectState";
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
    const dragHandlerRef = useRef<DragHandler | undefined>();

    useEffect(() => {
      const element = ref.current;
      if (!element) {
        return;
      }

      const onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0) {
          return;
        }
        element.setPointerCapture(e.pointerId);

        const interval = e.timeStamp - lastClickTimestampRef.current;
        lastClickTimestampRef.current = e.timeStamp;
        const isDoubleClick = interval < doubleClickInterval;

        const pickResult = NodePickResult.create(e, {
          mode: isDoubleClick ? "doubleClick" : "click",
        });

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
        dragHandlerRef.current = undefined;
      };
      const onPointerMove = action((e: PointerEvent) => {
        if (e.buttons === 0) {
          onEnd(e);
        }

        const pickResult = NodePickResult.create(e);

        if (dragHandlerRef.current) {
          dragHandlerRef.current.move(pickResult);
        } else {
          onHover(pickResult);
        }
      });
      const onEnd = action((e: PointerEvent) => {
        element.releasePointerCapture(e.pointerId);
        dragHandlerRef.current?.end(NodePickResult.create(e));
        dragHandlerRef.current = undefined;
      });
      const onHover = action((pickResult: NodePickResult) => {
        viewportState.hoveredSelectable = pickResult.default;
        viewportState.resizeBoxVisible = true;

        snapper.clear();
        if (viewportState.tool?.type === "insert") {
          snapper.snapInsertPoint(pickResult.pos);
        }
      });

      const rawPointerSupported = "onpointerrawupdate" in element;
      element.addEventListener("pointerdown", onPointerDown);
      element.addEventListener(
        (rawPointerSupported ? "pointerrawupdate" : "pointermove") as never,
        onPointerMove
      );
      element.addEventListener("pointerup", onEnd);

      return () => {
        element.removeEventListener("pointerdown", onPointerDown);
        element.removeEventListener(
          (rawPointerSupported ? "pointerrawupdate" : "pointermove") as never,
          onPointerMove
        );
        element.removeEventListener("pointerup", onEnd);
      };
    }, []);

    const onContextMenu = action((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const page = projectState.page;
      if (!page) {
        return;
      }

      const override = NodePickResult.create(e.nativeEvent).default;
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
