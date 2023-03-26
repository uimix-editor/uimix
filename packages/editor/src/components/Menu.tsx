import * as AriakitMenu from "ariakit/menu";
import checkIcon from "@iconify-icons/ic/check";
import chevronRightIcon from "@iconify-icons/ic/chevron-right";
import { MenuItemDef, MenuSubmenuDef } from "../state/MenuItemDef";
import { PopoverState } from "ariakit/popover";
import { Icon } from "@iconify/react";

const shortcutClassNames = `text-macaron-disabledText text-macaron-base ml-auto pl-4`;

const menuClassNames = `text-macaron-text text-macaron-base bg-macaron-background z-10 border border-macaron-separator rounded-lg shadow-xl overflow-hidden p-1 outline-0`;

const itemClassNames =
  "aria-disabled:text-macaron-disabledText h-6 outline-0 rounded [&[data-active-item]]:bg-macaron-active [&[data-active-item]]:text-macaron-activeText pr-4 pl-6 flex items-center";

function Submenu({ def }: { def: MenuSubmenuDef }) {
  const menu = AriakitMenu.useMenuState();

  return (
    <>
      <AriakitMenu.MenuButton
        state={menu}
        as={AriakitMenu.MenuItem}
        className={itemClassNames}
      >
        {def.text}
        <div className="ml-auto pl-4">
          <Icon icon={chevronRightIcon} />
        </div>
      </AriakitMenu.MenuButton>
      {menu.mounted && <Menu state={menu} defs={def.children} />}
    </>
  );
}

function MenuItem({ def }: { def: MenuItemDef }) {
  switch (def.type) {
    case "command":
      return (
        <AriakitMenu.MenuItem
          className={itemClassNames}
          disabled={def.disabled}
          onClick={def.onClick?.bind(def)}
        >
          {def.checked && (
            <div className="absolute left-2">
              <Icon icon={checkIcon} width={12} />
            </div>
          )}
          {def.radioChecked && (
            <div className="absolute left-2">
              <svg width={16} height={16}>
                <circle cx={8} cy={8} r={2} fill="currentColor" />
              </svg>
            </div>
          )}
          {def.text}
          {!!def.shortcuts?.length && (
            <span className={shortcutClassNames}>
              {def.shortcuts[0].toText()}
            </span>
          )}
        </AriakitMenu.MenuItem>
      );
    case "submenu":
      return <Submenu def={def} />;
    case "label":
      return (
        <div className="text-macaron-disabledText text-[10px] pr-4 pl-6 leading-4">
          {def.text}
        </div>
      );
    case "separator":
      return (
        <AriakitMenu.MenuSeparator className="my-1 border-macaron-uiBackground" />
      );
    default:
      return null;
  }
}

export function Menu({
  state,
  defs,
}: {
  state: AriakitMenu.MenuState;
  defs: readonly MenuItemDef[];
}) {
  return (
    <AriakitMenu.Menu state={state} portal backdrop className={menuClassNames}>
      {defs.map((def, i) => (
        <MenuItem def={def} key={i} />
      ))}
    </AriakitMenu.Menu>
  );
}

type UseMenuButtonResult = ReturnType<
  typeof AriakitMenu.useMenuButton<"button">
>;

export const DropdownMenu: React.FC<{
  defs: readonly MenuItemDef[];
  trigger: (props: Omit<UseMenuButtonResult, "children">) => JSX.Element;
  placement?: PopoverState["placement"];
}> = ({ defs, trigger, placement }) => {
  const state = AriakitMenu.useMenuState({
    placement,
  });
  const menuButtunProps = AriakitMenu.useMenuButton<"button">({ state });

  return (
    <>
      {trigger(menuButtunProps)}
      <Menu state={state} defs={defs} />
    </>
  );
};
