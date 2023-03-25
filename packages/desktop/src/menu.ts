import { MenuItemConstructorOptions, app, shell, Menu } from "electron";

export function setApplicationMenu() {
  const isMac = process.platform === "darwin";

  const template: MenuItemConstructorOptions[] = [
    { role: "appMenu" },
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [
        {
          label: "New",
          accelerator: "CmdOrCtrl+N",
        },
        {
          label: "Open",
          accelerator: "CmdOrCtrl+O",
        },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
        },
        {
          label: "Save As",
          accelerator: "CmdOrCtrl+Shift+S",
        },
        { type: "separator" },
        ...[isMac ? { role: "close" as const } : { role: "quit" as const }],
      ],
    },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            await shell.openExternal("https://electronjs.org");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
