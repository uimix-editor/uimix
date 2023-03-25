import { MenuItemConstructorOptions, shell, Menu } from "electron";
import { File } from "./File";
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
            new Window(new File());
          },
        },
        {
          label: "Open",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            const file = File.open();
            if (!file) {
              return;
            }
            new Window(file);
          },
        },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: (menuItem, browserWindow) => {
            if (!browserWindow) {
              return;
            }
            const window = windows.get(browserWindow.webContents);
            if (!window) {
              return;
            }
            window.file.save();
          },
        },
        {
          label: "Save As",
          accelerator: "CmdOrCtrl+Shift+S",
          click: (menuItem, browserWindow) => {
            if (!browserWindow) {
              return;
            }
            const window = windows.get(browserWindow.webContents);
            if (!window) {
              return;
            }
            window.file.saveAs();
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
