import { action, computed, runInAction } from "mobx";
import { isTextInput } from "../utils/Focus";
import { Shortcut } from "../utils/Shortcut";
import { Selectable } from "../models/Selectable";
import { exportToJSON as exportJSON, importJSON } from "./JSONExport";
import { viewportState } from "./ViewportState";
import { projectState } from "./ProjectState";
import { handleShortcut, MenuCommandDef, MenuItemDef } from "./MenuItemDef";
import { Clipboard } from "./Clipboard";
import {
  autoLayout,
  groupAndAutoLayout,
  removeLayout,
  ungroup,
} from "../services/AutoLayout";
import {
  attachComponent,
  canCreateComponent,
  canDetachComponent,
  createComponent,
  detachComponent,
} from "../services/CreateComponent";
import { PageHierarchyEntry } from "../models/Project";
import { posix as path } from "path-browserify";
import { generateExampleNodes } from "../models/generateExampleNodes";
import { dialogState } from "./DialogState";
import { scrollState } from "./ScrollState";
import { compact } from "lodash-es";
import { Component } from "../models/Component";

class Commands {
  @computed get canUndo(): boolean {
    // TODO
    return true;
  }
  @computed get canRedo(): boolean {
    // TODO
    return true;
  }

  undo(): void {
    projectState.undoManager.undo();
  }
  redo(): void {
    projectState.undoManager.redo();
  }

  async cut() {
    throw new Error("Not implemented");
  }

  async copy() {
    const data = projectState.getNodeClipboardData();
    if (!data) {
      return;
    }
    await Clipboard.writeNodes(data);
  }

  async paste() {
    const data = await Clipboard.readNodes();
    if (!data) {
      return;
    }
    await runInAction(async () => {
      await projectState.pasteNodeClipboardData(data);
    });
    runInAction(() => {
      projectState.undoManager.stopCapturing();
    });
  }

  delete() {
    for (const selected of projectState.selectedSelectables) {
      selected.remove();
    }
  }

  selectAll() {
    // select all siblings of the first selected node

    const firstSelected = projectState.selectedSelectables[0];
    if (!firstSelected) {
      // select all top level nodes
      for (const selectable of projectState.page?.selectable.children ?? []) {
        selectable.select();
      }
    } else {
      const parent = firstSelected.parent;
      if (!parent) {
        return;
      }
      for (const selectable of parent.children) {
        selectable.select();
      }
    }

    projectState.undoManager.stopCapturing();
  }

  insertFrame() {
    viewportState.tool = {
      type: "insert",
      mode: { type: "frame" },
    };
  }

  insertText() {
    viewportState.tool = {
      type: "insert",
      mode: { type: "text" },
    };
  }

  async insertImage() {
    const file = await new Promise<File | undefined>((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/png,image/jpeg";
      input.onchange = () => {
        resolve(input.files?.[0]);
      };
      input.click();
    });
    if (!file) {
      return;
    }

    viewportState.tool = {
      type: "insert",
      mode: { type: "image", blob: file },
    };
  }

  autoLayout() {
    const selectables = projectState.selectedSelectables;

    if (selectables.length > 1) {
      this.group();
      return;
    }

    if (selectables.length === 1) {
      autoLayout(selectables[0]);
      projectState.undoManager.stopCapturing();
    }
  }

  removeLayout() {
    for (const selectable of projectState.selectedSelectables) {
      removeLayout(selectable);
    }
    projectState.undoManager.stopCapturing();
  }

  createComponent() {
    for (const selectable of projectState.selectedSelectables) {
      createComponent(selectable);
    }
    projectState.undoManager.stopCapturing();
  }

  detachComponent() {
    const detached = compact(
      projectState.selectedSelectables.map((selectable) =>
        detachComponent(selectable)
      )
    );

    projectState.project.clearSelection();
    for (const selectable of detached) {
      selectable.select();
    }
    projectState.undoManager.stopCapturing();
  }

  attachComponent(component: Component) {
    for (const selectable of projectState.selectedSelectables) {
      attachComponent(selectable, component);
    }
    projectState.undoManager.stopCapturing();
  }

  group() {
    const selectables = projectState.selectedSelectables;
    if (selectables.length < 2) {
      return;
    }
    const group = groupAndAutoLayout(selectables);
    if (group) {
      projectState.project.clearSelection();
      group.select();
    }

    projectState.undoManager.stopCapturing();
  }

  ungroup() {
    const selectables = projectState.selectedSelectables;

    projectState.project.clearSelection();

    for (const selectable of selectables) {
      const children = selectable.children;
      for (const child of children) {
        child.select();
      }
      ungroup(selectable);
    }
    projectState.undoManager.stopCapturing();
  }

  readonly exportJSONCommand: MenuCommandDef = {
    type: "command",
    text: "Export JSON...",
    onClick: action(() => {
      void exportJSON();
    }),
  };

  readonly importJSONCommand: MenuCommandDef = {
    type: "command",
    text: "Import JSON...",
    onClick: action(() => {
      void importJSON();
    }),
  };

  readonly undoCommand: MenuCommandDef = {
    type: "command",
    text: "Undo",
    shortcuts: [new Shortcut(["Mod"], "KeyZ")],
    disabled: !this.canUndo,
    onClick: action(() => this.undo()),
  };
  readonly redoCommand: MenuCommandDef = {
    type: "command",
    text: "Redo",
    shortcuts: [
      new Shortcut(["Shift", "Mod"], "KeyZ"),
      new Shortcut(["Mod"], "KeyY"),
    ],
    disabled: !this.canRedo,
    onClick: action(() => this.redo()),
  };

  readonly cutCommand: MenuCommandDef = {
    type: "command",
    text: "Cut",
    shortcuts: [new Shortcut(["Mod"], "KeyX")],
    onClick: action(() => {
      void this.cut();
    }),
  };
  readonly copyCommand: MenuCommandDef = {
    type: "command",
    text: "Copy",
    shortcuts: [new Shortcut(["Mod"], "KeyC")],
    onClick: action(() => {
      void this.copy();
    }),
  };
  readonly pasteCommand: MenuCommandDef = {
    type: "command",
    text: "Paste",
    shortcuts: [new Shortcut(["Mod"], "KeyV")],
    onClick: action(() => {
      void this.paste();
    }),
  };
  readonly deleteCommand: MenuCommandDef = {
    type: "command",
    text: "Delete",
    onClick: action(() => {
      this.delete();
    }),
  };
  readonly selectAllCommand: MenuCommandDef = {
    type: "command",
    text: "Select All",
    shortcuts: [new Shortcut(["Mod"], "KeyA")],
    onClick: action(() => {
      this.selectAll();
    }),
  };

  readonly insertFrameCommand: MenuCommandDef = {
    type: "command",
    text: "Frame",
    shortcuts: [new Shortcut([], "KeyF")],
    onClick: action(() => {
      this.insertFrame();
    }),
  };
  readonly insertTextCommand: MenuCommandDef = {
    type: "command",
    text: "Text",
    shortcuts: [new Shortcut([], "KeyT")],
    onClick: action(() => {
      this.insertText();
    }),
  };
  readonly insertImageCommand: MenuCommandDef = {
    type: "command",
    text: "Image",
    onClick: action(async () => {
      await this.insertImage();
    }),
  };

  readonly createComponentCommand: MenuCommandDef = {
    type: "command",
    text: "Create Component",
    shortcuts: [new Shortcut(["Mod", "Alt"], "KeyK")],
    get disabled() {
      return !projectState.selectedSelectables.some(canCreateComponent);
    },
    onClick: action(() => {
      this.createComponent();
    }),
  };

  readonly detachComponentCommand: MenuCommandDef = {
    type: "command",
    text: "Detach Component",
    get disabled() {
      return !projectState.selectedSelectables.some(canDetachComponent);
    },
    onClick: action(() => {
      this.detachComponent();
    }),
  };

  readonly autoLayoutCommand: MenuCommandDef = {
    type: "command",
    text: "Auto Layout",
    shortcuts: [new Shortcut(["Shift"], "KeyA")],
    onClick: action(() => {
      this.autoLayout();
    }),
  };
  readonly removeLayoutCommand: MenuCommandDef = {
    type: "command",
    text: "Remove Layout",
    onClick: action(() => {
      this.removeLayout();
    }),
  };
  readonly groupCommand: MenuCommandDef = {
    type: "command",
    text: "Group",
    shortcuts: [new Shortcut(["Mod"], "KeyG")],
    onClick: action(() => {
      this.group();
    }),
  };
  readonly ungroupCommand: MenuCommandDef = {
    type: "command",
    text: "Ungroup",
    shortcuts: [new Shortcut(["Shift", "Mod"], "KeyG")],
    onClick: action(() => {
      this.ungroup();
    }),
  };
  readonly zoomInCommand: MenuCommandDef = {
    type: "command",
    text: "Zoom In",
    shortcuts: [
      new Shortcut([], "Equal"),
      new Shortcut([], "NumpadAdd"),
      new Shortcut(["Mod"], "Equal"),
      new Shortcut(["Mod"], "NumpadAdd"),
      new Shortcut(["Shift"], "Equal"),
      new Shortcut(["Shift", "Mod"], "Equal"),
    ],
    onClick: action(() => {
      scrollState.zoomIn();
    }),
  };
  readonly zoomOutCommand: MenuCommandDef = {
    type: "command",
    text: "Zoom Out",
    shortcuts: [
      new Shortcut([], "Minus"),
      new Shortcut([], "NumpadSubtract"),
      new Shortcut(["Mod"], "Minus"),
      new Shortcut(["Mod"], "NumpadSubtract"),
      new Shortcut(["Shift"], "Minus"),
      new Shortcut(["Shift", "Mod"], "Minus"),
    ],
    onClick: action(() => {
      scrollState.zoomOut();
    }),
  };
  readonly resetZoomCommand: MenuCommandDef = {
    type: "command",
    text: "Reset Zoom",
    shortcuts: [
      new Shortcut(["Mod"], "Digit0"),
      new Shortcut(["Mod"], "Numpad0"),
    ],
    onClick: action(() => {
      scrollState.resetZoom();
    }),
  };

  @computed get menu(): MenuItemDef[] {
    return [
      {
        type: "submenu",
        text: "File",
        children: [this.exportJSONCommand, this.importJSONCommand],
      },
      {
        type: "submenu",
        text: "Edit",
        children: [
          this.undoCommand,
          this.redoCommand,
          { type: "separator" },
          this.cutCommand,
          this.copyCommand,
          this.pasteCommand,
          this.deleteCommand,
          { type: "separator" },
          this.selectAllCommand,
        ],
      },
      {
        type: "submenu",
        text: "Create",
        children: [
          this.insertFrameCommand,
          this.insertTextCommand,
          this.insertImageCommand,
          { type: "separator" },
          {
            type: "command",
            text: "Generate Example Nodes",
            onClick: action(() => {
              const page = projectState.page;
              if (!page) {
                return;
              }
              generateExampleNodes(page);
              projectState.undoManager.stopCapturing();
            }),
          },
        ],
      },
      {
        type: "submenu",
        text: "Node",
        children: [
          this.createComponentCommand,
          { type: "separator" },
          this.detachComponentCommand,
          { type: "separator" },
          this.groupCommand,
          this.ungroupCommand,
          { type: "separator" },
          this.autoLayoutCommand,
          this.removeLayoutCommand,
        ],
      },
      {
        type: "submenu",
        text: "View",
        children: [
          this.zoomInCommand,
          this.zoomOutCommand,
          this.resetZoomCommand,
        ],
      },
    ];
  }

  contextMenuForSelectable(selectable: Selectable): MenuItemDef[] {
    if (selectable.originalNode.type === "page") {
      return [this.pasteCommand];
    }

    return [
      this.cutCommand,
      this.copyCommand,
      this.pasteCommand,
      this.deleteCommand,
      { type: "separator" },
      this.createComponentCommand,
      { type: "separator" },
      this.detachComponentCommand,
      {
        type: "submenu",
        text: "Attach Component",
        children: projectState.project.components.map((component) => {
          return {
            type: "command",
            text: component.name,
            onClick: action(() => {
              this.attachComponent(component);
            }),
          };
        }),
      },
      { type: "separator" },
      this.groupCommand,
      this.ungroupCommand,
      { type: "separator" },
      this.autoLayoutCommand,
      this.removeLayoutCommand,
    ];
  }

  contextMenuForFile(file: PageHierarchyEntry): MenuItemDef[] {
    if (file.type === "directory") {
      return [
        {
          type: "command",
          text: "New File",
          onClick: action(() => {
            const newPath = path.join(file.path, "Page 1");
            projectState.createPage(newPath);
          }),
        },
        {
          type: "command",
          text: "Delete",
          // disabled: projectState.project.pages.count === 1,
          onClick: action(() => {
            projectState.deletePageOrPageFolder(file.path);
          }),
        },
      ];
    } else {
      return [
        {
          type: "command",
          text: "Delete",
          // disabled: projectState.project.pages.count === 1,
          onClick: action(() => {
            projectState.deletePageOrPageFolder(file.path);
          }),
        },
      ];
    }
  }

  handleKeyDown(event: KeyboardEvent): boolean {
    if (dialogState.isAnyOpen) {
      return false;
    }

    if (event.key === " ") {
      viewportState.panMode = true;
    }

    if (
      event.ctrlKey ||
      event.metaKey ||
      !isTextInput(document.activeElement)
    ) {
      if (event.key === "Delete" || event.key === "Backspace") {
        this.delete();
        return true;
      }
      if (event.key === "Escape") {
        viewportState.tool = undefined;
        return true;
      }
      if (event.key === "Alt") {
        viewportState.measureMode = true;
      }

      return handleShortcut(this.menu, event);
    }

    return false;
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === " ") {
      viewportState.panMode = false;
    }
    if (event.key === "Alt") {
      viewportState.measureMode = false;
    }
  }
}

export const commands = new Commands();
