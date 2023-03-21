import { action, computed, runInAction } from "mobx";
import { isTextInput } from "../utils/Focus";
import { Shortcut } from "../utils/Shortcut";
import { Selectable, selectablesToProjectJSON } from "../models/Selectable";
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
import { createComponent } from "../services/CreateComponent";
import { PageHierarchyEntry } from "../models/Project";
import { posix as path } from "path-browserify";
import { Node } from "../models/Node";
import { generateExampleNodes } from "../models/generateExampleNodes";
import { dialogState } from "./DialogState";

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
    // TODO: copy from instance contents
    const json = selectablesToProjectJSON(
      projectState.selectedNodes.map((node) => node.selectable)
    );
    await Clipboard.writeNodes(json);
  }

  async paste() {
    const data = await Clipboard.readNodes();

    await runInAction(async () => {
      const getInsertionTarget = () => {
        const defaultTarget = {
          parent: projectState.page,
          next: undefined,
        };

        const selectedSelectables = projectState.selectedSelectables;
        let lastSelectable: Selectable | undefined =
          selectedSelectables[selectedSelectables.length - 1];
        while (lastSelectable && lastSelectable.idPath.length > 1) {
          lastSelectable = lastSelectable.parent;
        }
        if (!lastSelectable) {
          return defaultTarget;
        }

        const parent = lastSelectable?.parent;
        if (!parent) {
          return defaultTarget;
        }

        return {
          parent: parent.originalNode,
          next: lastSelectable.originalNode.nextSibling,
        };
      };

      const insertionTarget = getInsertionTarget();
      projectState.page?.selectable.deselect();

      const nodes: Node[] = [];
      for (const [id, nodeJSON] of Object.entries(data.nodes)) {
        const node = projectState.project.nodes.create(nodeJSON.type, id);
        node.loadJSON(nodeJSON);
        nodes.push(node);
      }
      const topNodes = nodes.filter((node) => !node.parentID);

      insertionTarget.parent?.insertBefore(topNodes, insertionTarget.next);

      for (const [id, styleJSON] of Object.entries(data.styles)) {
        const selectable = projectState.project.selectables.get(id.split(":"));
        if (selectable) {
          selectable.selfStyle.loadJSON(styleJSON);
        }
      }

      // load images
      for (const [hash, image] of Object.entries(data.images ?? {})) {
        if (projectState.project.imageManager.has(hash)) {
          continue;
        }
        const blob = await fetch(image.url).then((res) => res.blob());
        await projectState.project.imageManager.insert(blob);
      }

      for (const node of topNodes) {
        node.selectable.select();
      }
    });
  }

  delete() {
    for (const selected of projectState.selectedSelectables) {
      selected.remove();
    }
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

  group() {
    const selectables = projectState.selectedSelectables;
    if (selectables.length < 2) {
      return;
    }
    const group = groupAndAutoLayout(selectables);
    if (group) {
      projectState.deselectAll();
      group.select();
    }

    projectState.undoManager.stopCapturing();
  }

  ungroup() {
    const selectables = projectState.selectedSelectables;

    projectState.deselectAll();

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
    shortcut: new Shortcut(["Mod"], "KeyZ"),
    disabled: !this.canUndo,
    onClick: action(() => this.undo()),
  };
  readonly redoCommand: MenuCommandDef = {
    type: "command",
    text: "Redo",
    shortcut: new Shortcut(["Shift", "Mod"], "KeyZ"), // TODO: Mod+Y in Windows?
    disabled: !this.canRedo,
    onClick: action(() => this.redo()),
  };

  readonly cutCommand: MenuCommandDef = {
    type: "command",
    text: "Cut",
    shortcut: new Shortcut(["Mod"], "KeyX"),
    onClick: action(() => {
      void this.cut();
    }),
  };
  readonly copyCommand: MenuCommandDef = {
    type: "command",
    text: "Copy",
    shortcut: new Shortcut(["Mod"], "KeyC"),
    onClick: action(() => {
      void this.copy();
    }),
  };
  readonly pasteCommand: MenuCommandDef = {
    type: "command",
    text: "Paste",
    shortcut: new Shortcut(["Mod"], "KeyV"),
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

  readonly insertFrameCommand: MenuCommandDef = {
    type: "command",
    text: "Frame",
    shortcut: new Shortcut([], "KeyF"),
    onClick: action(() => {
      this.insertFrame();
    }),
  };
  readonly insertTextCommand: MenuCommandDef = {
    type: "command",
    text: "Text",
    shortcut: new Shortcut([], "KeyT"),
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
    shortcut: new Shortcut(["Mod", "Alt"], "KeyK"),
    onClick: action(() => {
      this.createComponent();
    }),
  };
  readonly autoLayoutCommand: MenuCommandDef = {
    type: "command",
    text: "Auto Layout",
    shortcut: new Shortcut(["Shift"], "KeyA"),
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
    shortcut: new Shortcut(["Mod"], "KeyG"),
    onClick: action(() => {
      this.group();
    }),
  };
  readonly ungroupCommand: MenuCommandDef = {
    type: "command",
    text: "Ungroup",
    shortcut: new Shortcut(["Shift", "Mod"], "KeyG"),
    onClick: action(() => {
      this.ungroup();
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
          this.groupCommand,
          this.ungroupCommand,
          { type: "separator" },
          this.autoLayoutCommand,
          this.removeLayoutCommand,
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

      return handleShortcut(this.menu, event);
    }

    return false;
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === " ") {
      viewportState.panMode = false;
    }
  }
}

export const commands = new Commands();
