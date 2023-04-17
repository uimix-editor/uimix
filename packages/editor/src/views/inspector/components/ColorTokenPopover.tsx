import * as RadixPopover from "@radix-ui/react-popover";
import { IconButton, Tooltip } from "@uimix/foundation/src/components";
import { action } from "mobx";
import { SearchInput } from "../../outline/SearchInput";
import { projectState } from "../../../state/ProjectState";
import { ColorToken, ColorRef, CodeColorToken } from "@uimix/model/src/models";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { QueryTester } from "@uimix/foundation/src/utils/QueryTester";
import { Color } from "@uimix/foundation/src/utils/Color";

export const ColorTokenPopover: React.FC<{
  value?: ColorRef;
  onChange: (token: ColorToken | CodeColorToken) => void;
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
          className="bg-macaron-background z-10 border border-macaron-separator rounded-lg shadow-xl overflow-hidden text-xs text-macaron-text"
        >
          <SearchInput
            placeholder="Search"
            value={searchText}
            onChangeValue={setSearchText}
          />
          <div className="w-64 p-3 max-h-80 overflow-auto flex flex-col gap-2">
            <ColorTokenGroupsView
              name="This Project"
              tokens={projectState.project.colorTokens.all}
              queryTester={queryTester}
              value={value}
              onChange={onChange}
              onAdd={action(() => {
                const colorTokens = projectState.page?.colorTokens;
                if (!colorTokens) return;
                const token = colorTokens.add();
                token.value = value?.color ?? Color.black;
                token.name = token.value?.getName();
                onChange(token);
              })}
            />
            <ColorTokenGroupsView
              name="Code"
              tokens={[
                ...projectState.project.colorTokens.codeColorTokens.values(),
              ]}
              queryTester={queryTester}
              value={value}
              onChange={onChange}
            />
          </div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

const ColorTokenGroupsView: React.FC<{
  name: string;
  tokens: (ColorToken | CodeColorToken)[];
  queryTester: QueryTester;
  onChange: (token: ColorToken | CodeColorToken) => void;
  value?: ColorRef;
  onAdd?: () => void;
}> = ({ name, tokens, queryTester, onChange, value, onAdd }) => {
  const groups = colorTokensToGroups(tokens);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between font-semibold">
        <div>{name}</div>
        {onAdd && <IconButton icon="material-symbols:add" onClick={onAdd} />}
      </div>
      {tokens.length === 0 && (
        <div className="text-macaron-disabledText">No tokens</div>
      )}
      {[...groups].map(([group, tokens]) => {
        const filteredTokens = tokens.filter((token) =>
          queryTester.test(token.name ?? "")
        );
        if (!filteredTokens.length) {
          return null;
        }

        return (
          <ColorTokenGroupView
            name={group}
            tokens={filteredTokens}
            onChange={onChange}
            value={value}
          />
        );
      })}
    </div>
  );
};

const ColorTokenGroupView: React.FC<{
  name: string;
  tokens: (ColorToken | CodeColorToken)[];
  onChange: (token: ColorToken | CodeColorToken) => void;
  value?: ColorRef;
}> = ({ name, tokens, onChange, value }) => {
  const isTokenSelected = (token: ColorToken | CodeColorToken) => {
    return value?.value.type === "token" && value?.value.value.id === token.id;
  };

  return (
    <div className="flex flex-col gap-1">
      {!!name && <div>{name}</div>}
      <div className="flex gap-1 flex-wrap">
        {tokens.map((token) => (
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

function colorTokensToGroups(
  allTokens: (ColorToken | CodeColorToken)[]
): Map<string, (ColorToken | CodeColorToken)[]> {
  const groups = new Map<string, (ColorToken | CodeColorToken)[]>();

  for (const token of allTokens) {
    const path = (token.name ?? "").split("/");
    const group = path.slice(0, path.length - 1).join("/");
    let tokens = groups.get(group);
    if (!tokens) {
      tokens = [];
      groups.set(group, tokens);
    }
    tokens.push(token);
  }

  return groups;
}
