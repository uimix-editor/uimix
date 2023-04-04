import { Icon } from "@iconify/react";
import { observer } from "mobx-react-lite";
import { DropdownMenu } from "@uimix/foundation/src/components/Menu";
import { ToolButton } from "@uimix/foundation/src/components/ToolButton";
import { commands } from "../../state/Commands";
import rectIcon from "@seanchas116/design-icons/json/rect.json";
import textIcon from "@seanchas116/design-icons/json/text.json";
import imageIcon from "@seanchas116/design-icons/json/image.json";
import { viewportState } from "../../state/ViewportState";
import { action } from "mobx";
import { Tooltip } from "@uimix/foundation/src/components/Tooltip";

export const ToolBar = observer(() => {
  // TODO: use material symbols instead of SVGs

  return (
    <div className="w-10 flex flex-col items-center p-1.5">
      <DropdownMenu
        defs={commands.menu}
        placement="right-start"
        trigger={(props) => (
          <ToolButton {...props}>
            <Icon icon="ic:menu" width={16} />
          </ToolButton>
        )}
      />
      <div className="flex flex-col items-center gap-1 mt-2">
        <Tooltip text="Select" side="right">
          <ToolButton
            aria-pressed={!viewportState.tool}
            onClick={action(() => {
              viewportState.tool = undefined;
            })}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M6.39601 12.083L8.33301 9.604H12.104L6.39601 4.938V12.083ZM11.062 17.229L8.31201 11.333L5.31201 15.042V2.625L15.125 10.688H9.75001L12.5 16.562L11.062 17.229Z"
                fill="currentColor"
              />
            </svg>
          </ToolButton>
        </Tooltip>
        <Tooltip text="Frame (F)" side="right">
          <ToolButton
            aria-pressed={
              viewportState.tool?.type === "insert" &&
              viewportState.tool.mode.type === "frame"
            }
            onClick={action(() => {
              commands.insertFrame();
            })}
          >
            <Icon icon={rectIcon} width={20} />
          </ToolButton>
        </Tooltip>
        <Tooltip text="Text (T)" side="right">
          <ToolButton
            aria-pressed={
              viewportState.tool?.type === "insert" &&
              viewportState.tool.mode.type === "text"
            }
            onClick={action(() => {
              commands.insertText();
            })}
          >
            <Icon icon={textIcon} width={20} />
          </ToolButton>
        </Tooltip>
        <Tooltip text="Image" side="right">
          <ToolButton
            aria-pressed={
              viewportState.tool?.type === "insert" &&
              viewportState.tool.mode.type === "image"
            }
            onClick={action(async () => {
              await commands.insertImage();
            })}
          >
            <Icon icon={imageIcon} width={20} />
          </ToolButton>
        </Tooltip>
        <Tooltip text="Instance" side="right">
          <ToolButton
            aria-pressed={viewportState.tool?.type === "instancePalette"}
            onClick={action(() => {
              viewportState.tool = {
                type: "instancePalette",
              };
            })}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M13.25 11L9 6.75L13.25 2.5L17.479 6.75L13.25 11ZM3 9V3H9V9H3ZM11 17V11H17V17H11ZM3 17V11H9V17H3ZM4.5 7.5H7.5V4.5H4.5V7.5ZM13.25 8.875L15.354 6.75L13.25 4.625L11.125 6.75L13.25 8.875ZM12.5 15.5H15.5V12.5H12.5V15.5ZM4.5 15.5H7.5V12.5H4.5V15.5Z"
                fill="currentColor"
              />
            </svg>
          </ToolButton>
        </Tooltip>
        <Tooltip text="Generate with AI (TODO)" side="right">
          <ToolButton>
            <Icon icon="carbon:machine-learning" width={20} />
          </ToolButton>
        </Tooltip>
      </div>
    </div>
  );
});
