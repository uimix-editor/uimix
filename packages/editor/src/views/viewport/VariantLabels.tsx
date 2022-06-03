import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { usePointerStroke } from "@seanchas116/paintkit/src/components/hooks/usePointerStroke";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { useContextMenu } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { DefaultVariant, Variant } from "../../models/Variant";
import { ElementPickResult } from "../../mount/ElementPicker";
import { useEditorState } from "../useEditorState";
import { DragHandler } from "./pointer/DragHandler";
import { ElementClickMoveDragHandler } from "./pointer/ElementClickMoveDragHandler";

const LabelWrap = styled.div`
  pointer-events: all;
  position: absolute;
  transform: translateY(-100%);
  color: ${colors.text};
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 2px;
`;

const Label: React.FC<{
  variant: Variant | DefaultVariant;
}> = observer(function Label({ variant }) {
  const editorState = useEditorState();
  const contextMenu = useContextMenu();

  const rootInstance = assertNonNull(variant.rootInstance);

  const pos = rootInstance.boundingBox.topLeft.transform(
    editorState.scroll.documentToViewport
  );

  const dragProps = usePointerStroke<Element, DragHandler | undefined>({
    onBegin: action((e) => {
      return ElementClickMoveDragHandler.create(
        editorState,
        new ElementPickResult(
          editorState.document,
          [rootInstance],
          e.nativeEvent,
          "click"
        )
      );
    }),
    onMove: action((e, { initData: dragHandler }) => {
      dragHandler?.move(e.nativeEvent);
    }),
    onEnd: action((e, { initData: dragHandler }) => {
      dragHandler?.end(e.nativeEvent);
    }),
    onHover: action(() => {
      editorState.hoveredItem = rootInstance;
    }),
  });
  const onPointerLeave = action(() => {
    editorState.hoveredItem = undefined;
  });
  const onContextMenu = action((e: React.MouseEvent) => {
    e.preventDefault();
    editorState.document.deselect();
    rootInstance.select();

    contextMenu.show(
      e.clientX,
      e.clientY,
      editorState.getElementContextMenu(rootInstance)
    );
  });

  return (
    <LabelWrap
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        color: colors.label,
        // pointerEvents: override.isLocked ? "none" : "auto",
      }}
      {...dragProps}
      onPointerLeave={onPointerLeave}
      onContextMenu={onContextMenu}
    >
      {variant.component?.name} - {variant.name}
    </LabelWrap>
  );
});

const FrameLabelsWrap = styled.div``;

export const FrameLabels: React.FC<{}> = observer(function FrameLabels() {
  const editorState = useEditorState();

  const variants = editorState.document.components.children.flatMap(
    (component) => component.allVariants
  );

  return (
    <FrameLabelsWrap>
      {variants.map((variant) => (
        <Label variant={variant} key={variant.key} />
      ))}
    </FrameLabelsWrap>
  );
});
