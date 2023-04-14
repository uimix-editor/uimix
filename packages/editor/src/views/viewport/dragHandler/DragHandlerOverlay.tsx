import { action } from "mobx";
import React, { useEffect, useRef } from "react";
import { DragHandler } from "./DragHandler";
import { NodeClickMoveDragHandler } from "./NodeClickMoveDragHandler";
import { NodeInsertDragHandler } from "./NodeInsertDragHandler";
import { Selectable } from "@uimix/model/src/models";
import { doubleClickInterval } from "../constants";
import { ViewportEvent } from "./ViewportEvent";
import { projectState } from "../../../state/ProjectState";
import { snapper } from "../../../state/Snapper";
import { commands } from "../../../state/Commands";
import { observer } from "mobx-react-lite";
import { showContextMenu } from "../../ContextMenu";
import { viewportState } from "../../../state/ViewportState";
import { assertNonNull } from "@uimix/foundation/src/utils/Assert";
import { BackgroundClickMoveDragHandler } from "./BackgroundClickMoveDragHandler";

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

      const onPointerDown = action((e: PointerEvent) => {
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

        // text editing mode
        if (viewportState.focusedSelectable) {
          const newTarget = viewportEvent.deepestSelectable;
          if (newTarget && isFocusable(newTarget)) {
            viewportState.focusedSelectable = newTarget;
            return;
          }
        }

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

        dragHandlerRef.current = new BackgroundClickMoveDragHandler(
          viewportEvent
        );
      });
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
        // text editing mode
        if (viewportState.focusedSelectable) {
          const newTarget = viewportEvent.deepestSelectable;
          if (newTarget && isFocusable(newTarget)) {
            viewportState.hoveredSelectable = newTarget;
            return;
          }
        }

        viewportState.hoveredSelectable = viewportEvent.selectable;
        viewportState.resizeBoxVisible = true;

        snapper.clear();
        if (viewportState.tool?.type === "insert") {
          const parent =
            viewportEvent.selectable ??
            assertNonNull(projectState.page).selectable;
          snapper.snapInsertPoint(parent, viewportEvent.pos);
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
          projectState.project.clearSelection();
          override.select();
        }
      } else {
        projectState.project.clearSelection();
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
