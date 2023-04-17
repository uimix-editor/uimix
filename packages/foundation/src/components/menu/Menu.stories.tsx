import React, { useState } from "react";
import menuIcon from "@iconify-icons/ic/menu";
import { MenuItemDef } from "../menu/MenuItemDef";
import { Shortcut } from "../../utils/Shortcut";
import { useMenuButton, useMenuState } from "ariakit";
import { ToolButton } from "../toolbar/ToolButton";
import { Menu } from "../menu/Menu";
import { Icon } from "@iconify/react";

export default {
  title: "Menu",
  component: Menu,
};

export const Basic: React.FC = () => {
  const state = useMenuState();
  const menu = useExampleMenu();
  const menuButtunProps = useMenuButton<"button">({ state });
  return (
    <>
      <ToolButton {...menuButtunProps}>
        <Icon icon={menuIcon} width={20} />
      </ToolButton>
      <Menu state={state} defs={menu} />
    </>
  );
};

function useExampleMenu(): MenuItemDef[] {
  const [showsBookmarks, setShowsBookmarks] = useState(true);
  const [showsFullURL, setShowsFullURL] = useState(false);
  const [person, setPerson] = useState("pedro");

  return [
    {
      type: "command",
      text: "New Tab",
      shortcuts: [new Shortcut(["Mod"], "KeyT")],
    },
    {
      type: "command",
      text: "New Window",
      shortcuts: [new Shortcut(["Mod"], "KeyN")],
    },
    {
      type: "command",
      text: "New Private Window",
      shortcuts: [new Shortcut(["Shift", "Mod"], "KeyN")],
      disabled: true,
    },
    {
      type: "submenu",
      text: "More Tools",
      children: [
        {
          type: "command",
          text: "Save Page As...",
          shortcuts: [new Shortcut(["Mod"], "KeyS")],
        },
        {
          type: "command",
          text: "Create Shortcut...",
        },
        {
          type: "command",
          text: "Name Window...",
        },
        {
          type: "separator",
        },
        {
          type: "command",
          text: "Developer Tools",
        },
      ],
    },
    {
      type: "separator",
    },
    {
      type: "command",
      text: "Show Bookmarks",
      shortcuts: [new Shortcut(["Mod"], "KeyB")],
      checked: showsBookmarks,
      onClick: () => {
        setShowsBookmarks(!showsBookmarks);
      },
    },
    {
      type: "command",
      text: "Show Full URLs",
      checked: showsFullURL,
      onClick: () => {
        setShowsFullURL(!showsFullURL);
      },
    },
    {
      type: "separator",
    },
    {
      type: "label",
      text: "People",
    },
    {
      type: "command",
      text: "Pedro Duarte",
      radioChecked: person === "pedro",
      onClick: () => {
        setPerson("pedro");
      },
    },
    {
      type: "command",
      text: "Colm Tuite",
      radioChecked: person === "colm",
      onClick: () => {
        setPerson("colm");
      },
    },
  ];
}
