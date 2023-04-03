import * as RadixPopover from "@radix-ui/react-popover";
import { Tooltip } from "../../../components/Tooltip";
import { action } from "mobx";
import { SearchInput } from "../../outline/SearchInput";
import { projectState } from "../../../state/ProjectState";
import { ColorToken } from "../../../models/ColorToken";

export const ColorTokenPopover: React.FC<{
  onSelect: (token: ColorToken) => void;
  children: React.ReactNode;
}> = ({ onSelect, children }) => {
  return (
    <RadixPopover.Root>
      <Tooltip text="Color Tokens">
        <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>
      </Tooltip>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align="start"
          className="bg-macaron-background z-10 border border-macaron-separator rounded-lg shadow-xl overflow-hidden text-xs"
        >
          <SearchInput
            placeholder="Search"
            value={""}
            onChangeValue={action((value) => {
              // TODO
            })}
          />
          <div className="w-64 p-3">
            <div className="text-macaron-label font-medium mb-2">
              This Document
            </div>
            <div className="flex gap-1 flex-wrap">
              {projectState.project.colorTokens.all.map((token) => {
                return (
                  <Tooltip text={token.name} key={token.id} delayDuration={0}>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: token.value?.toHex(),
                      }}
                      onClick={action(() => {
                        onSelect(token);
                      })}
                    />
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};
