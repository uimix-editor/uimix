import { action } from "mobx";
import React, { useEffect, useRef } from "react";
import { DragHandler } from "./DragHandler";
import { NodeClickMoveDragHandler } from "./NodeClickMoveDragHandler";
import { NodeInsertDragHandler } from "./NodeInsertDragHandler";
import { Selectable } from "../../../models/Selectable";
import { doubleClickInterval } from "../constants";
import { ViewportEvent } from "../renderer/NodePicker";
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

        const viewportEvent = new ViewportEvent(e, {
          mode: isDoubleClick ? "doubleClick" : "click",
        });

        viewportState.hoveredSelectable = undefined;
        viewportState.focusedSelectable = undefined;

        if (viewportState.tool?.type === "insert") {
          dragHandlerRef.current = new NodeInsertDragHandler(
            viewportState.tool.mode,
            viewportEvent
          );
          return;
        }

        if (isDoubleClick) {
          const instance = viewportEvent.doubleClickableSelectable;
          if (instance?.selected && isFocusable(instance)) {
            viewportState.focusedSelectable = instance;
          }
        }

        const clickMove = NodeClickMoveDragHandler.create(viewportEvent);
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

        const viewportEvent = new ViewportEvent(e);

        if (dragHandlerRef.current) {
          dragHandlerRef.current.move(viewportEvent);
        } else {
          onHover(viewportEvent);
        }
      });
      const onEnd = action((e: PointerEvent) => {
        element.releasePointerCapture(e.pointerId);
        dragHandlerRef.current?.end(new ViewportEvent(e));
        dragHandlerRef.current = undefined;
      });
      const onHover = action((viewportEvent: ViewportEvent) => {
        viewportState.hoveredSelectable = viewportEvent.selectable;
        viewportState.resizeBoxVisible = true;

        snapper.clear();
        if (viewportState.tool?.type === "insert") {
          snapper.snapInsertPoint(viewportEvent.pos);
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

      const override = new ViewportEvent(e.nativeEvent).selectable;
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
