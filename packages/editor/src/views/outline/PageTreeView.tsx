import { posix as path } from "path-browserify";
import { action, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { twMerge } from "tailwind-merge";
import { TreeView, TreeViewItem } from "react-draggable-tree";
import { Icon } from "@iconify/react";
import fileIcon from "@iconify-icons/ic/outline-insert-drive-file";
import folderIcon from "@iconify-icons/ic/folder";
import {
  DropBetweenIndicator,
  DropOverIndicator,
  ToggleCollapsedButton,
} from "@uimix/foundation/src/components/TreeViewParts";
import { projectState } from "../../state/ProjectState";
import { DoubleClickToEdit } from "@uimix/foundation/src/components/DoubleClickToEdit";
import { commands } from "../../state/Commands";
import { PageHierarchyEntry } from "@uimix/model/src/models";
import { showContextMenu } from "../ContextMenu";

interface PageTreeViewItem extends TreeViewItem {
  entry: PageHierarchyEntry;
}

function buildTreeViewItem(
  entry: PageHierarchyEntry,
  parent?: PageTreeViewItem
): PageTreeViewItem {
  const treeViewItem: PageTreeViewItem = {
    key: entry.id,
    parent,
    entry,
    children: [],
  };

  if (
    entry.type === "directory" &&
    !projectState.collapsedPaths.has(entry.path)
  ) {
    treeViewItem.children = entry.children.map((child) =>
      buildTreeViewItem(child, treeViewItem)
    );
  }

  return treeViewItem;
}

const PageRow = observer(
  ({
    depth,
    indentation,
    item,
  }: {
    depth: number;
    indentation: number;
    item: PageTreeViewItem;
  }) => {
    const { entry } = item;

    const selected =
      entry.type === "file" && entry.page.id === projectState.page?.id;
    const collapsed = projectState.collapsedPaths.has(entry.path);

    const onClick = action(() => {
      if (entry.type === "file") {
        projectState.openPage(entry.page);
      }
    });
    const onCollapsedChange = action((value: boolean) => {
      if (value) {
        projectState.collapsedPaths.add(entry.path);
      } else {
        projectState.collapsedPaths.delete(entry.path);
      }
    });

    return (
      <div
        onClick={onClick}
        onContextMenu={action((e) => {
          e.preventDefault();
          showContextMenu(e, commands.contextMenuForFile(entry));
        })}
        className="w-full h-7 px-1"
      >
        <div
          className={twMerge(
            "w-full h-7 flex items-center text-macaron-text rounded",
            selected
              ? "bg-macaron-active text-macaron-activeText"
              : "bg-macaron-background",
            entry.type === "file" &&
              "hover:ring-1 hover:ring-inset hover:ring-macaron-active"
          )}
          style={{
            paddingLeft: `${(depth * indentation) / 16}rem`,
          }}
        >
          <ToggleCollapsedButton
            visible={entry.type === "directory"}
            value={collapsed}
            onChange={onCollapsedChange}
          />
          {entry.type === "file" ? (
            <Icon
              icon={fileIcon}
              className={twMerge(
                "mr-1.5 text-macaron-disabledText",
                selected && "opacity-100 text-macaron-activeText"
              )}
            />
          ) : (
            <Icon icon={folderIcon} className="mr-1.5 text-blue-400" />
          )}
          <DoubleClickToEdit
            className={"flex-1 h-full"}
            value={entry.name}
            onChange={action((name: string) => {
              const newPath = path.join(path.dirname(entry.path), name);
              projectState.renamePageOrPageFolder(entry.path, newPath);
            })}
          />
        </div>
      </div>
    );
  }
);

export const PageTreeView = observer(() => {
  const rootItem = buildTreeViewItem(projectState.project.pages.toHierarchy());

  return (
    <TreeView
      className="min-h-full treeview-root"
      header={<div className="h-1" />}
      footer={<div className="h-1" />}
      rootItem={rootItem}
      background={
        <div
          className="absolute inset-0"
          onClick={action(() => {
            //state.selectedPath = undefined;
          })}
          onContextMenu={action((e) => {
            e.preventDefault();

            showContextMenu(e, commands.contextMenuForFile(rootItem.entry));
          })}
        />
      }
      dropBetweenIndicator={DropBetweenIndicator}
      dropOverIndicator={DropOverIndicator}
      renderRow={(props) => <PageRow {...props} />}
      handleDragStart={() => {
        return true;
      }}
      canDrop={({ item, draggedItem }) => {
        return !!draggedItem && item.entry.type === "directory";
      }}
      handleDrop={({ item, draggedItem }) => {
        runInAction(() => {
          if (draggedItem) {
            const entry = draggedItem.entry;
            const newDir = item.entry.path;
            const oldName = draggedItem.entry.name;
            const newPath = path.join(newDir, oldName);

            projectState.renamePageOrPageFolder(entry.path, newPath);
          }
        });
      }}
      nonReorderable
    />
  );
});

PageTreeView.displayName = "DocumentTreeView";
