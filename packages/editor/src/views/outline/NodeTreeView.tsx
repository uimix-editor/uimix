import { Icon } from "@iconify/react";
import { action, reaction, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { TreeView, TreeViewItem, TreeViewItemRow } from "react-draggable-tree";
import widgetsIcon from "@iconify-icons/ic/widgets";
import outlineWidgetsIcon from "@iconify-icons/ic/outline-widgets";
import rectIcon from "@seanchas116/design-icons/json/rect.json";
import hStackIcon from "@seanchas116/design-icons/json/h-stack.json";
import vStackIcon from "@seanchas116/design-icons/json/v-stack.json";
import textIcon from "@seanchas116/design-icons/json/text.json";
import imageIcon from "@seanchas116/design-icons/json/image.json";
import { Selectable } from "../../models/Selectable";
import { projectState } from "../../state/ProjectState";
import { DoubleClickToEdit } from "../../components/DoubleClickToEdit";
import { commands } from "../../state/Commands";
import {
  DropBetweenIndicator,
  DropOverIndicator,
  ToggleCollapsedButton,
} from "../../components/TreeViewParts";
import { showContextMenu } from "../ContextMenu";
import { viewportState } from "../../state/ViewportState";
import { twMerge } from "tailwind-merge";
import { getIconAndTextForCondition } from "../viewport/VariantLabels";
import scrollIntoView from "scroll-into-view-if-needed";

interface NodeTreeViewItem extends TreeViewItem {
  selectable: Selectable;
}

function selectableToTreeViewItem(
  selectable: Selectable,
  parent?: NodeTreeViewItem
): NodeTreeViewItem {
  const item: NodeTreeViewItem = {
    key: selectable.id,
    parent,
    selectable,
    children: [],
  };
  if (!selectable.collapsed) {
    item.children = selectable.children.map((child) =>
      selectableToTreeViewItem(child, item)
    );
  }
  return item;
}

const elementForSelectable = new WeakMap<Selectable, HTMLElement>();

const TreeRow: React.FC<{
  rows: readonly TreeViewItemRow<NodeTreeViewItem>[];
  index: number;
  selectable: Selectable;
  depth: number;
  indentation: number;
}> = observer(({ rows, index, selectable, depth, indentation }) => {
  const onCollapsedChange = action((value: boolean) => {
    selectable.collapsed = value;
  });

  const onClick = action((event: React.MouseEvent<HTMLElement>) => {
    if (event.metaKey) {
      if (selectable.selected) {
        selectable.deselect();
      } else {
        selectable.select();
      }
    } else if (event.shiftKey) {
      let minSelectedIndex = index;
      let maxSelectedIndex = index;

      for (const [i, row] of rows.entries()) {
        if (row.item.selectable.selected) {
          minSelectedIndex = Math.min(minSelectedIndex, i);
          maxSelectedIndex = Math.max(maxSelectedIndex, i);
        }
      }

      for (let i = minSelectedIndex; i <= maxSelectedIndex; ++i) {
        rows[i].item.selectable.select();
      }
    } else {
      projectState.project.clearSelection();
      selectable.select();
    }
  });

  const onMouseEnter = action(() => {
    viewportState.hoveredSelectable = selectable;
  });
  const onMouseLeave = action(() => {
    viewportState.hoveredSelectable = undefined;
  });

  const selected = selectable.selected;
  const hovered = viewportState.hoveredSelectable === selectable;
  const ancestorSelected = selectable.ancestorSelected;

  const topSelected =
    rows[index - 1]?.item.selectable.ancestorSelected ?? false;
  const bottomSelected =
    rows[index + 1]?.item.selectable.ancestorSelected ?? false;

  const isComponent = selectable.node.type === "component";

  const isInstance = selectable.originalNode.type === "instance";
  const isForeignInstance = selectable.originalNode.type === "foreign";
  const isInsideInstance = selectable.idPath.length >= 2;

  const icon = (() => {
    if (isInstance) {
      return outlineWidgetsIcon;
    }

    switch (selectable.node.type) {
      default:
      case "frame": {
        const layout = selectable.style.layout;
        if (layout === "stack") {
          const dir = selectable.style.stackDirection;
          if (dir === "x") {
            return hStackIcon;
          } else {
            return vStackIcon;
          }
        }
        if (layout === "grid") {
          return "icon-park-outline:all-application";
        }
        return rectIcon;
      }
      case "text":
        return textIcon;
      case "image":
        return imageIcon;
      case "svg":
        return "material-symbols:shapes-outline";
      case "component":
        return widgetsIcon;
      case "instance":
        return outlineWidgetsIcon;
      case "foreign":
        return "material-symbols:code";
    }
  })();

  const onContextMenu = action((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (!selectable.selected) {
      projectState.project.clearSelection();
      selectable.select();
    }

    showContextMenu(e, commands.contextMenuForSelectable(selectable));
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      elementForSelectable.set(selectable, ref.current);
    }
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onContextMenu={onContextMenu}
      className="w-full h-8 px-1"
    >
      <div
        className={twMerge(
          "w-full h-8 flex items-center text-macaron-text",
          !topSelected && "rounded-t",
          !bottomSelected && "rounded-b",
          selected
            ? "bg-macaron-active text-macaron-activeText"
            : ancestorSelected
            ? "bg-macaron-active/10"
            : "bg-macaron-background",
          hovered && "ring-1 ring-inset ring-macaron-active"
        )}
        style={{
          paddingLeft: depth * indentation,
        }}
      >
        <ToggleCollapsedButton
          visible={selectable.children.length > 0}
          value={selectable.collapsed}
          onChange={onCollapsedChange}
        />
        {selectable.parent?.node.type === "component" ? (
          (() => {
            const { icon, text } = getIconAndTextForCondition(
              selectable.originalNode.type === "variant"
                ? selectable.originalNode.condition ?? { type: "default" }
                : { type: "default" }
            );

            return (
              <>
                <Icon
                  className={twMerge(
                    "mr-1.5 text-xs text-macaron-disabledText",
                    isComponent &&
                      !selected &&
                      "text-macaron-component opacity-100",
                    selected && "opacity-100 text-macaron-activeText"
                  )}
                  icon={icon}
                />
                <span>{text}</span>
              </>
            );
          })()
        ) : (
          <>
            <Icon
              className={twMerge(
                "mr-1.5 text-xs opacity-30",
                (isComponent || isInstance) &&
                  !selected &&
                  "text-macaron-component opacity-100",
                isForeignInstance && !selected && "text-pink-500 opacity-100",
                selected && "opacity-100"
              )}
              icon={icon}
            />
            <span className="text-[10px] uppercase text-bold opacity-40 mr-1">
              {selectable.style.tagName}
            </span>
            <DoubleClickToEdit
              className={twMerge(
                "flex-1 h-full min-w-0",
                isComponent && "font-semibold",
                isInsideInstance && "italic opacity-60"
              )}
              value={selectable.originalNode.name}
              onChange={action((name: string) => {
                selectable.originalNode.name = name;
                projectState.undoManager.stopCapturing();
              })}
            />
          </>
        )}
      </div>
    </div>
  );
});

function useRevealSelectedRow() {
  useEffect(
    () =>
      reaction(
        () => projectState.selectedSelectables,
        async (selectables) => {
          for (const selectable of selectables) {
            selectable.expandAncestors();
          }

          // wait for render
          await new Promise((resolve) => setTimeout(resolve, 0));

          for (const selectable of selectables) {
            const element = elementForSelectable.get(selectable);
            if (element) {
              scrollIntoView(element, { scrollMode: "if-needed" });
            }
          }
        }
      ),
    []
  );
}

export const NodeTreeView: React.FC = observer(() => {
  const page = projectState.page;
  const rootItem = page && selectableToTreeViewItem(page.selectable);

  useRevealSelectedRow();

  if (!rootItem) {
    return null;
  }

  return (
    <TreeView
      className="min-h-full treeview-root"
      rootItem={rootItem}
      background={
        <div
          style={{
            position: "absolute",
            inset: 0,
          }}
          onClick={action(() => {
            projectState.project.clearSelection();
          })}
          onContextMenu={action((e) => {
            const page = projectState.page;
            if (!page) {
              return;
            }

            e.preventDefault();
            showContextMenu(
              e,
              commands.contextMenuForSelectable(page.selectable)
            );
          })}
        />
      }
      dropBetweenIndicator={DropBetweenIndicator}
      dropOverIndicator={DropOverIndicator}
      handleDragStart={({ item }) => {
        // if (item.selectable.isVariant) {
        //   return false;
        // }

        if (!item.selectable.selected) {
          projectState.project.clearSelection();
          item.selectable.select();
        }
        return true;
      }}
      canDrop={({ item, draggedItem }) => {
        return (
          !!draggedItem &&
          item.selectable.originalNode.canInsert(
            draggedItem.selectable.originalNode.type
          )
        );
      }}
      handleDrop={({ item, draggedItem, before }) => {
        runInAction(() => {
          if (draggedItem) {
            // TODO: prevent inserting variant as a first child of a component
            item.selectable.insertBefore(
              projectState.selectedSelectables,
              before?.selectable
            );
            projectState.undoManager.stopCapturing();
          }
        });
      }}
      renderRow={({ rows, index, item, depth, indentation }) => (
        <TreeRow
          rows={rows}
          index={index}
          selectable={item.selectable}
          depth={depth}
          indentation={indentation}
        />
      )}
    />
  );
});
