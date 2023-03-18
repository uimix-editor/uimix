import React, { useCallback } from "react";
import { Icon, IconProps } from "@iconify/react";
import menuIcon from "@iconify-icons/ic/menu";
import rectIcon from "@seanchas116/design-icons/json/rect.json";
import textIcon from "@seanchas116/design-icons/json/text.json";
import imageIcon from "@seanchas116/design-icons/json/image.json";
import { observer } from "mobx-react-lite";
import { ZoomControl } from "../../components/ZoomControl";
import { scrollState } from "../../state/ScrollState";
import { action } from "mobx";
import { twMerge } from "tailwind-merge";
import { DropdownMenu } from "../../components/Menu";
import { ToolButton } from "../../components/ToolButton";
import { commands } from "../../state/Commands";
import { viewportState } from "../../state/ViewportState";

const LargeToolButton: React.FC<{
  icon: IconProps["icon"];
  selected?: boolean;
  text: string;
  onClick?: () => void;
}> = ({ icon, selected, text, onClick }) => {
  return (
    <div
      onClick={onClick}
      aria-selected={selected}
      className="flex w-fit gap-1 p-2 items-center rounded
      hover:bg-macaron-uiBackground
      aria-selected:bg-macaron-active
      aria-selected:text-macaron-activeText
      text-neutral-800"
    >
      <Icon icon={icon} className="text-base" />
      <div className="font-medium text-macaron-base">{text}</div>
    </div>
  );
};

export const ToolBar = observer(function ToolBar({
  className,
}: {
  className?: string;
}) {
  const onZoomOut = useCallback(
    action(() => scrollState.zoomOut()),
    []
  );
  const onZoomIn = useCallback(
    action(() => scrollState.zoomIn()),
    []
  );
  const onChangeZoomPercent = useCallback(
    action((percent: number) => scrollState.zoomAroundCenter(percent / 100)),
    []
  );

  return (
    <div
      className={twMerge(
        "box-content h-10 border-b border-macaron-separator bg-macaron-background text-macaron-text flex items-center justify-center relative",
        className
      )}
    >
      <div className="absolute left-3 top-0 bottom-0 flex gap-4 items-center">
        <DropdownMenu
          defs={commands.menu}
          trigger={(props) => (
            <ToolButton {...props}>
              <Icon icon={menuIcon} width={20} />
            </ToolButton>
          )}
        />
        <div className="flex">
          <LargeToolButton
            icon="material-symbols:widgets-outline-rounded"
            //selected={viewportState.insertMode?.type === "component"}
            text="Assets"
          />
          <LargeToolButton
            icon={textIcon}
            selected={
              viewportState.tool?.type === "insert" &&
              viewportState.tool.mode.type === "text"
            }
            text="Text"
            onClick={action(() => {
              commands.insertText();
            })}
          />
          <LargeToolButton
            icon={rectIcon}
            selected={
              viewportState.tool?.type === "insert" &&
              viewportState.tool.mode.type === "frame"
            }
            text="Frame"
            onClick={action(() => {
              commands.insertFrame();
            })}
          />
          <LargeToolButton
            icon={imageIcon}
            selected={
              viewportState.tool?.type === "insert" &&
              viewportState.tool.mode.type === "image"
            }
            text="Image"
            onClick={action(async () => {
              await commands.insertImage();
            })}
          />
        </div>
      </div>

      <div className="flex">
        {
          // TODO: title?
        }
      </div>

      <div className="absolute right-3 top-0 bottom-0 flex items-center gap-4">
        <ZoomControl
          percentage={Math.round(scrollState.scale * 100)}
          onZoomOut={onZoomOut}
          onZoomIn={onZoomIn}
          onChangePercentage={onChangeZoomPercent}
        />
        <a
          className="bg-macaron-active rounded px-2 py-1.5 text-xs hover:bg-macaron-activeHover text-macaron-activeText flex items-center gap-1"
          target="_blank"
          href="https://github.com/seanchas116/uimix"
        >
          <Icon icon="mdi:github" className="text-base" />
          GitHub
        </a>
      </div>
    </div>
  );
});
