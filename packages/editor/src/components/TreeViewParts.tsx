import clsx from "clsx";
import chevronRightIcon from "@iconify-icons/ic/chevron-right";
import { Icon } from "@iconify/react";

export function DropBetweenIndicator({
  left,
  top,
}: {
  left: number;
  top: number;
}) {
  return (
    <div
      className="absolute pointer-events-none bg-macaron-active"
      style={{
        left: `${left}px`,
        right: "0",
        top: `${top}px`,
        height: "2px",
      }}
    />
  );
}

export function DropOverIndicator({
  top,
  height,
}: {
  top: number;
  height: number;
}) {
  return (
    <div
      className="absolute pointer-events-none border border-macaron-active"
      style={{
        top: `${top}px`,
        left: 0,
        right: 0,
        height: `${height}px`,
      }}
    />
  );
}

export function ToggleCollapsedButton({
  visible,
  value,
  onChange,
}: {
  visible: boolean;
  value: boolean;
  onChange: (collapsed: boolean) => void;
}) {
  return visible ? (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange(!value);
      }}
      className={clsx(
        "w-4 h-4 flex items-center justify-center opacity-0 [.treeview-root:hover_&]:opacity-50 transition-opacity",
        {
          "rotate-90": !value,
        }
      )}
    >
      <Icon className="text-xs" icon={chevronRightIcon} />
    </button>
  ) : (
    <div className="w-4 h-4" />
  );
}
