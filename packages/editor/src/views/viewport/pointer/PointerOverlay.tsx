import { usePointerStroke } from "@seanchas116/paintkit/src/components/hooks/usePointerStroke";
import { useContextMenu } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { isVoidElement } from "@seanchas116/paintkit/src/util/HTMLTagCategory";
import { action } from "mobx";
import React, { useRef } from "react";
import styled from "styled-components";
import { ElementInstance } from "../../../models/ElementInstance";
import { parseFragment } from "../../../fileFormat/fragment";
import { TextInstance } from "../../../models/TextInstance";
import { useEditorState } from "../../useEditorState";
import { imageAssetDragMime } from "../../sidebar/assets/ImageBrowser";
import { doubleClickInterval } from "../Constants";
import { DragHandler } from "./DragHandler";
import { ElementClickMoveDragHandler } from "./ElementClickMoveDragHandler";
import { ElementInsertDragHandler } from "./ElementInsertDragHandler";
import { findNewParent } from "./ElementInFlowMoveDragHandler";

const PointerOverlayWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

function isInnerHTMLEditable(instance: ElementInstance): boolean {
  const element = instance.element;
  const nonSlottedChildren = element.children.filter(
    (child) => child.type === "text" || !child.attrs.get("slot")
  );

  if (nonSlottedChildren.length === 0) {
    return !isVoidElement(element.tagName);
  }

  return nonSlottedChildren.some((child) => child.type === "text");
}

export const PointerOverlay: React.FC<{}> = () => {
  const editorState = useEditorState();
  const contextMenu = useContextMenu();

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
      editorState.innerHTMLEditTarget = undefined;

      if (editorState.insertMode) {
        return new ElementInsertDragHandler(
          editorState,
          editorState.insertMode,
          pickResult
        );
      }

      if (isDoubleClick) {
        const instance = pickResult.doubleClickable;
        if (instance?.selected && isInnerHTMLEditable(instance)) {
          editorState.innerHTMLEditTarget = instance;
        }
      }

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

      editorState.snapper.clear();
      if (editorState.insertMode) {
        editorState.snapper.snapInsertPoint(
          editorState.scroll.documentPosForEvent(e)
        );
      }
    }),
  });

  const onDragOver = action((e: React.DragEvent) => {
    const target = editorState.elementPicker.pick(e.nativeEvent).default;
    editorState.hoveredItem = target;

    if (e.dataTransfer.types.includes("text/html")) {
      e.preventDefault();
    }
  });

  const onDrop = action(async (e: React.DragEvent) => {
    e.preventDefault();

    const pickResult = editorState.elementPicker.pick(e.nativeEvent);

    const target = pickResult.default;
    if (!target) {
      return;
    }

    const insertInstances = action(
      (instances: (ElementInstance | TextInstance)[]) => {
        if (target.hasLayout) {
          const { parent, ref } = findNewParent(editorState, pickResult, []);
          if (parent) {
            for (const instance of instances) {
              parent.node.insertBefore(instance.node, ref?.node);
            }
          }
        } else {
          for (const instance of instances) {
            if (instance.type !== "element") {
              continue;
            }

            if (!instance.element.id) {
              instance.element.setID(instance.element.tagName);
            }
            instance.style.position = "absolute";

            const pos = editorState.scroll
              .documentPosForEvent(e)
              .sub(target.offsetParentOfChildren.boundingBox.topLeft);
            instance.style.left = `${pos.x}px`;
            instance.style.top = `${pos.y}px`;
          }
          target.element.append(...instances.map((i) => i.node));
        }

        editorState.document.deselect();
        for (const instance of instances) {
          instance.select();
        }

        editorState.history.commit("Drop");
      }
    );

    if (e.dataTransfer.types.includes(imageAssetDragMime)) {
      const url = e.dataTransfer.getData(imageAssetDragMime);
      if (url.endsWith(".svg")) {
        const response = await fetch(editorState.resolveImageAssetURL(url));
        const html = await response.text();
        const fragment = parseFragment(html);
        if (fragment && fragment.type === "instances") {
          insertInstances(fragment.instances);
        }
      } else {
        const html = `<img src="${url}"/>`;
        const fragment = parseFragment(html);
        if (fragment && fragment.type === "instances") {
          insertInstances(fragment.instances);
        }
      }
      return;
    }

    if (e.dataTransfer.types.includes("text/html")) {
      const html = e.dataTransfer.getData("text/html");
      const fragment = parseFragment(html);
      if (fragment && fragment.type === "instances") {
        insertInstances(fragment.instances);
      }
      return;
    }
  });

  const onContextMenu = action((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const override = editorState.elementPicker.pick(e.nativeEvent).default;
    if (override) {
      if (!override.selected) {
        editorState.document.deselect();
        override.select();
      }

      contextMenu.show(
        e.clientX,
        e.clientY,
        editorState.getElementContextMenu(override)
      );
    } else {
      contextMenu.show(e.clientX, e.clientY, editorState.getRootContextMenu());
    }
  });

  return (
    <PointerOverlayWrap
      {...pointerProps}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onContextMenu={onContextMenu}
    ></PointerOverlayWrap>
  );
};
