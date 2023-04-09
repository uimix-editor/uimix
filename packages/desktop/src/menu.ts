import { MenuItemConstructorOptions, shell, Menu } from "electron";
import { Window, windows } from "./Window";

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
          click: () => {
            Window.new();
          },
        },
        {
          label: "Open",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            await Window.openFromDialog();
          },
        },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: async (menuItem, browserWindow) => {
            if (!browserWindow) {
              return;
            }
            const window = windows.get(browserWindow.webContents);
            if (!window) {
              return;
            }
            await window.file.save();
          },
        },
        {
          label: "Save As",
          accelerator: "CmdOrCtrl+Shift+S",
          click: async (menuItem, browserWindow) => {
            if (!browserWindow) {
              return;
            }
            const window = windows.get(browserWindow.webContents);
            if (!window) {
              return;
            }
            await window.file.saveAs();
          },
        },
        { type: "separator" },
        {
          label: "Revert File",
          click: (menuItem, browserWindow) => {
            if (!browserWindow) {
              return;
            }
            const window = windows.get(browserWindow.webContents);
            if (!window) {
              return;
            }
            window.file.revert();
          },
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
