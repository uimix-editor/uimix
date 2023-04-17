import * as RadixPopover from "@radix-ui/react-popover";
import { Tooltip, IconButton } from "@uimix/foundation/src/components";
import { action } from "mobx";
import { SearchInput } from "../../outline/SearchInput";
import { projectState } from "../../../state/ProjectState";
import { ColorToken, ColorRef, CodeColorToken } from "@uimix/model/src/models";
import { Color } from "@uimix/foundation/src/utils/Color";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { QueryTester } from "@uimix/foundation/src/utils/QueryTester";

export const ColorTokenPopover: React.FC<{
  value?: ColorRef;
  onChange: (token: ColorToken | CodeColorToken) => void;
  children: React.ReactNode;
}> = ({ value, onChange, children }) => {
  const [searchText, setSearchText] = useState("");
  const queryTester = new QueryTester(searchText);

  const isTokenSelected = (token: ColorToken | CodeColorToken) => {
    return value?.value.type === "token" && value?.value.value.id === token.id;
  };

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
          <div className="w-64 p-3 max-h-80 overflow-auto flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="text-macaron-label font-medium">
                  This Document
                </div>
                <IconButton
                  icon="material-symbols:add"
                  onClick={action(() => {
                    const colorTokens = projectState.page?.colorTokens;
                    if (!colorTokens) return;
                    // Add
                    const token = colorTokens.add();
                    token.value = value?.color ?? Color.black;
                    token.name = token.value?.getName();
                    onChange(token);
                  })}
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                {projectState.project.colorTokens.all
                  .filter((token) => queryTester.test(token.name ?? ""))
                  .map((token) => (
                    <ColorTokenIcon
                      token={token}
                      selected={isTokenSelected(token)}
                      onClick={action(() => {
                        onChange(token);
                      })}
                    />
                  ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-macaron-label font-medium">Code</div>
              </div>

              {[...projectState.project.colorTokens.codeColorTokensByGroup].map(
                ([group, tokens]) => {
                  const filteredTokens = tokens.filter((token) =>
                    queryTester.test(token.name ?? "")
                  );
                  if (!filteredTokens.length) {
                    return null;
                  }
                  return (
                    <div className="flex flex-col gap-1">
                      {group !== "" && (
                        <div className="text-macaron-label font-medium">
                          {group}
                        </div>
                      )}
                      <div className="flex gap-1 flex-wrap">
                        {filteredTokens.map((token) => (
                          <ColorTokenIcon
                            token={token}
                            selected={isTokenSelected(token)}
                            onClick={action(() => {
                              onChange(token);
                            })}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

const ColorTokenIcon: React.FC<{
  token: ColorToken | CodeColorToken;
  selected: boolean;
  onClick: () => void;
}> = ({ token, selected, onClick }) => {
  return (
    <Tooltip text={token.name} key={token.id} delayDuration={0}>
      <div
        className={twMerge(
          "w-6 h-6 rounded-full border border-macaron-separator",
          selected && "ring-2 ring-macaron-active"
        )}
        style={{
          backgroundColor: token.value?.toHex(),
        }}
        onClick={onClick}
      />
    </Tooltip>
  );
};
