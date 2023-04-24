import { Icon } from "@iconify/react";
import { observer } from "mobx-react-lite";
import {
  DropdownMenu,
  ToolButton,
  Tooltip,
} from "@uimix/foundation/src/components";
import { commands } from "../../state/Commands";
import rectIcon from "@seanchas116/design-icons/json/rect.json";
import textIcon from "@seanchas116/design-icons/json/text.json";
import imageIcon from "@seanchas116/design-icons/json/image.json";
import { viewportState } from "../../state/ViewportState";
import { action } from "mobx";
import { twMerge } from "tailwind-merge";

export const ToolBar: React.FC<{
  position: "left" | "top";
}> = observer(({ position }) => {
  // TODO: use material symbols instead of SVGs

  const tooltipSide = position === "left" ? "right" : "bottom";

  return (
    <div
      className={twMerge(
        "flex items-center p-1.5",
        position === "left" ? "w-10 flex-col" : "h-10"
      )}
    >
      <DropdownMenu
        defs={commands.menu}
        placement={position === "left" ? "right-start" : "bottom-start"}
        trigger={(props) => (
          <ToolButton {...props}>
            <Icon icon="ic:menu" className="text-base" />
          </ToolButton>
        )}
      />
      <div
        className={twMerge(
          "flex items-center gap-1",
          position === "left" ? "flex-col mt-2" : "flex-row ml-2"
        )}
      >
        <Tooltip text="Select" side={tooltipSide}>
          <ToolButton
            aria-pressed={!viewportState.tool}
            onClick={action(() => {
              viewportState.tool = undefined;
            })}
          >
            <svg
              className="text-xl"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
            >
              <path
                d="M6.39601 12.083L8.33301 9.604H12.104L6.39601 4.938V12.083ZM11.062 17.229L8.31201 11.333L5.31201 15.042V2.625L15.125 10.688H9.75001L12.5 16.562L11.062 17.229Z"
                fill="currentColor"
              />
            </svg>
          </ToolButton>
        </Tooltip>
        <Tooltip text="Frame (F)" side={tooltipSide}>
          <ToolButton
            aria-pressed={
              viewportState.tool?.type === "insert" &&
              viewportState.tool.mode.type === "frame"
            }
            onClick={action(() => {
              commands.insertFrame();
            })}
          >
            <Icon icon={rectIcon} className="text-xl" />
          </ToolButton>
        </Tooltip>
        <Tooltip text="Text (T)" side={tooltipSide}>
          <ToolButton
            aria-pressed={
              viewportState.tool?.type === "insert" &&
              viewportState.tool.mode.type === "text"
            }
            onClick={action(() => {
              commands.insertText();
            })}
          >
            <Icon icon={textIcon} className="text-xl" />
          </ToolButton>
        </Tooltip>
        <Tooltip text="Image" side={tooltipSide}>
          <ToolButton
            aria-pressed={
              viewportState.tool?.type === "insert" &&
              viewportState.tool.mode.type === "image"
            }
            onClick={action(async () => {
              await commands.insertImage();
            })}
          >
            <Icon icon={imageIcon} className="text-xl" />
          </ToolButton>
        </Tooltip>
        <Tooltip text="Instance" side={tooltipSide}>
          <ToolButton
            aria-pressed={viewportState.tool?.type === "instancePalette"}
            onClick={action(() => {
              viewportState.tool = {
                type: "instancePalette",
              };
            })}
          >
            <svg
              className="text-xl"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
            >
              <path
                d="M13.25 11L9 6.75L13.25 2.5L17.479 6.75L13.25 11ZM3 9V3H9V9H3ZM11 17V11H17V17H11ZM3 17V11H9V17H3ZM4.5 7.5H7.5V4.5H4.5V7.5ZM13.25 8.875L15.354 6.75L13.25 4.625L11.125 6.75L13.25 8.875ZM12.5 15.5H15.5V12.5H12.5V15.5ZM4.5 15.5H7.5V12.5H4.5V15.5Z"
                fill="currentColor"
              />
            </svg>
          </ToolButton>
        </Tooltip>
        <Tooltip text="Generate with AI (TODO)" side={tooltipSide}>
          <ToolButton>
            <Icon icon="carbon:machine-learning" className="text-xl" />
          </ToolButton>
        </Tooltip>
      </div>
      <div className={twMerge("flex items-center gap-1 ml-auto")}>
        <Tooltip text="2-column" side={tooltipSide}>
          <ToolButton
            aria-pressed={viewportState.layout === "twoColumn"}
            onClick={action(() => {
              viewportState.layout = "twoColumn";
            })}
          >
            <svg
              className="text-xl"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M2.75 16V4C2.75 3.30964 3.30964 2.75 4 2.75H16C16.6904 2.75 17.25 3.30964 17.25 4V16C17.25 16.6904 16.6904 17.25 16 17.25H4C3.30964 17.25 2.75 16.6904 2.75 16Z"
                stroke="currentColor"
                strokeWidth={1.5}
              />
              <rect
                x="12.5"
                y="3"
                width="1.5"
                height="14"
                fill="currentColor"
              />
            </svg>
          </ToolButton>
        </Tooltip>
        <Tooltip text="3-column" side={tooltipSide}>
          <ToolButton
            aria-pressed={viewportState.layout === "threeColumn"}
            onClick={action(() => {
              viewportState.layout = "threeColumn";
            })}
          >
            <svg
              className="text-xl"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M2.75 16V4C2.75 3.30964 3.30964 2.75 4 2.75H16C16.6904 2.75 17.25 3.30964 17.25 4V16C17.25 16.6904 16.6904 17.25 16 17.25H4C3.30964 17.25 2.75 16.6904 2.75 16Z"
                stroke="currentColor"
                strokeWidth={1.5}
              />
              <rect
                x="12.5"
                y="3"
                width="1.5"
                height="14"
                fill="currentColor"
              />
              <rect x="6" y="3" width="1.5" height="14" fill="currentColor" />
            </svg>
          </ToolButton>
        </Tooltip>
      </div>
    </div>
  );
});
