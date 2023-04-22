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
  DoubleClickToEdit,
} from "@uimix/foundation/src/components";
import { projectState } from "../../state/ProjectState";
import { commands } from "../../state/Commands";
import { Image, PathTreeModelItem } from "@uimix/model/src/models";
import { showContextMenu } from "../ContextMenu";

interface ImageTreeViewItem extends TreeViewItem {
  entry: PathTreeModelItem<Image>;
}

function buildTreeViewItem(
  entry: PathTreeModelItem<Image>,
  parent?: ImageTreeViewItem
): ImageTreeViewItem {
  const treeViewItem: ImageTreeViewItem = {
    key: entry.path,
    parent,
    entry,
    children: [],
  };

  if (
    entry.type === "directory" &&
    !projectState.imageTreeModel.collapsedPaths.has(entry.path)
  ) {
    treeViewItem.children = entry.children.map((child) =>
      buildTreeViewItem(child, treeViewItem)
    );
  }

  return treeViewItem;
}

const ImageRow = observer(
  ({
    depth,
    indentation,
    item,
  }: {
    depth: number;
    indentation: number;
    item: ImageTreeViewItem;
  }) => {
    const { entry } = item;

    const selected = false;
    const collapsed = projectState.imageTreeModel.collapsedPaths.has(
      entry.path
    );

    const onClick = action(() => {
      // TODO
    });
    const onCollapsedChange = action((value: boolean) => {
      if (value) {
        projectState.imageTreeModel.collapsedPaths.add(entry.path);
      } else {
        projectState.imageTreeModel.collapsedPaths.delete(entry.path);
      }
    });

    return (
      <div
        onClick={onClick}
        onContextMenu={action((e) => {
          e.preventDefault();
          //showContextMenu(e, commands.contextMenuForPage(entry));
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
              projectState.imageTreeModel.rename(entry.path, newPath);
            })}
          />
        </div>
      </div>
    );
  }
);

export const ImageTreeView = observer(() => {
  const rootItem = buildTreeViewItem(projectState.imageTreeModel.root);

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

            //showContextMenu(e, commands.contextMenuForPage(rootItem.entry));
          })}
        />
      }
      dropBetweenIndicator={DropBetweenIndicator}
      dropOverIndicator={DropOverIndicator}
      renderRow={(props) => <ImageRow {...props} />}
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

            projectState.imageTreeModel.rename(entry.path, newPath);
          }
        });
      }}
      nonReorderable
    />
  );
});

ImageTreeView.displayName = "DocumentTreeView";
