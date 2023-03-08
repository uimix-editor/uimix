import { Icon } from "@iconify/react";
import { observer } from "mobx-react-lite";
import { DropdownMenu } from "../../components/Menu";
import { ToolButton } from "../../components/ToolButton";
import { commands } from "../../state/Commands";
import rectIcon from "@seanchas116/design-icons/json/rect.json";
import textIcon from "@seanchas116/design-icons/json/text.json";
import imageIcon from "@seanchas116/design-icons/json/image.json";
import { viewportState } from "../../state/ViewportState";
import { action } from "mobx";

export const VerticalToolBar = observer(() => {
  return (
    <div className="w-10 flex flex-col items-center p-1.5 justify-between">
      <div className="flex flex-col items-center gap-1">
        <ToolButton
          aria-pressed={!viewportState.insertMode}
          onClick={action(() => {
            viewportState.insertMode = undefined;
          })}
        >
          <Icon
            icon="material-symbols:arrow-selector-tool-outline"
            width={20}
          />
        </ToolButton>
        <ToolButton
          aria-pressed={viewportState.insertMode?.type === "frame"}
          onClick={action(() => {
            commands.insertFrame();
          })}
        >
          <Icon icon={rectIcon} width={20} />
        </ToolButton>
        <ToolButton
          aria-pressed={viewportState.insertMode?.type === "text"}
          onClick={action(() => {
            commands.insertText();
          })}
        >
          <Icon icon={textIcon} width={20} />
        </ToolButton>
        <ToolButton
          aria-pressed={viewportState.insertMode?.type === "image"}
          onClick={action(() => {
            commands.insertImage();
          })}
        >
          <Icon icon={imageIcon} width={20} />
        </ToolButton>
        <ToolButton>
          <Icon icon="material-symbols:widgets-outline" width={20} />
        </ToolButton>
      </div>
      <DropdownMenu
        defs={commands.menu}
        trigger={(props) => (
          <ToolButton {...props}>
            <Icon icon="ic:menu" width={20} />
          </ToolButton>
        )}
      />
    </div>
  );
});
