import { Shortcut } from "../utils/Shortcut";

export interface MenuCommandDef {
  type: "command";
  text: string;
  shortcut?: Shortcut;
  disabled?: boolean;
  checked?: boolean;
  radioChecked?: boolean;
  onClick?: () => void;
}

export interface MenuCheckBoxDef {
  type: "checkbox";
  text: string;
  shortcut?: Shortcut;
  disabled?: boolean;
  checked: boolean | "indeterminate";
  onChange?: (checked: boolean | "indeterminate") => void;
}

export interface MenuRadioGroupDef {
  type: "radiogroup";
  value: string;
  onChange?: (value: string) => void;
  items: {
    value: string;
    text: string;
    shortcut?: Shortcut;
  }[];
}

export interface MenuSubmenuDef {
  type: "submenu";
  text: string;
  children: MenuItemDef[];
}

export interface MenuLabelDef {
  type: "label";
  text: string;
}

export interface MenuSeparatorDef {
  type: "separator";
}

export type MenuItemDef =
  | MenuCommandDef
  | MenuCheckBoxDef
  | MenuRadioGroupDef
  | MenuSubmenuDef
  | MenuLabelDef
  | MenuSeparatorDef;

export function handleShortcut(
  menu: MenuItemDef[],
  event: KeyboardEvent
): boolean {
  for (const def of menu) {
    if (def.type === "command" && def.shortcut?.matches(event)) {
      def.onClick?.();
      return true;
    } else if (def.type === "submenu") {
      if (handleShortcut(def.children, event)) {
        return true;
      }
    }
  }
  return false;
}
