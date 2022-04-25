import React from "react";
import menuIcon from "@iconify-icons/ic/outline-menu";
import paragraphIcon from "@seanchas116/paintkit/src/icon/Paragraph";
import frameIcon from "@seanchas116/paintkit/src/icon/Frame";
import { ToolBar as ToolBarWrap } from "@seanchas116/paintkit/src/components/toolbar/ToolBar";
import {
  ToolButton,
  ToolButtonArray,
} from "@seanchas116/paintkit/src/components/toolbar/ToolButton";
import { Dropdown } from "@seanchas116/paintkit/src/components/menu/Dropdown";
import { ZoomControl } from "@seanchas116/paintkit/src/components/toolbar/ZoomControl";
import { observer } from "mobx-react-lite";
import { action } from "mobx";
import { useEditorState } from "./EditorStateContext";

export const ToolBar: React.FC = observer(() => {
  const editorState = useEditorState();

  return (
    <ToolBarWrap>
      <Dropdown
        options={editorState.getMainMenu()}
        button={(open, onClick) => (
          <ToolButton
            label="Menu"
            icon={menuIcon}
            selected={open}
            onClick={(_, elem) => onClick(elem)}
          />
        )}
      />
      <ToolButtonArray>
        <ToolButton label="Frame" icon={frameIcon} />
        <ToolButton label="Text" icon={paragraphIcon} />
      </ToolButtonArray>

      <ZoomControl
        percentage={Math.round(editorState.scroll.scale * 100)}
        onZoomOut={action(() => editorState.scroll.zoomOut())}
        onZoomIn={action(() => editorState.scroll.zoomIn())}
        onChangePercentage={action((percentage) => {
          editorState.scroll.zoomAroundCenter(percentage / 100);
        })}
      />
    </ToolBarWrap>
  );
});
