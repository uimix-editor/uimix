import * as RadixPopover from "@radix-ui/react-popover";
import { Tooltip } from "../../../components/Tooltip";
import { action } from "mobx";
import { SearchInput } from "../../outline/SearchInput";
import { projectState } from "../../../state/ProjectState";
import { ColorToken } from "../../../models/ColorToken";
import { Color } from "../../../utils/Color";
import { useState } from "react";
import { IconButton } from "../../../components/IconButton";
import { ColorRef } from "../../../models/ColorRef";
import { twMerge } from "tailwind-merge";
import { QueryTester } from "../../../utils/QueryTester";

export const ColorTokenPopover: React.FC<{
  value?: ColorRef;
  onChange: (token: ColorToken) => void;
  children: React.ReactNode;
}> = ({ value, onChange, children }) => {
  const [searchText, setSearchText] = useState("");
  const queryTester = new QueryTester(searchText);

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
            value={searchText}
            onChangeValue={setSearchText}
          />
          <div className="w-64 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-macaron-label font-medium">
                This Document
              </div>
              <IconButton
                icon="material-symbols:add"
                onClick={action(() => {
                  // Add
                  const token = projectState.project.colorTokens.add();
                  token.value = value?.color ?? Color.black;
                  token.name = token.value?.getName();
                  onChange(token);
                })}
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {projectState.project.colorTokens.all
                .filter((token) => queryTester.test(token.name ?? ""))
                .map((token) => {
                  const selected =
                    value?.value.type === "token" &&
                    value?.value.value.id === token.id;
                  return (
                    <Tooltip text={token.name} key={token.id} delayDuration={0}>
                      <div
                        className={twMerge(
                          "w-6 h-6 rounded-full border border-macaron-uiBackground",
                          selected && "ring-2 ring-macaron-active"
                        )}
                        style={{
                          backgroundColor: token.value?.toHex(),
                        }}
                        onClick={action(() => {
                          onChange(token);
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
