import React from "react";
import { action } from "mobx";
import addIcon from "@iconify-icons/ic/add";
import removeIcon from "@iconify-icons/ic/remove";
import { UnstyledInput } from "./Input";
import { twMerge } from "tailwind-merge";
import { IconButton } from "./IconButton";

export const ZoomControl: React.FC<{
  className?: string;
  percentage: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onChangePercentage: (percentage: number) => void;
}> = function ZoomControl({
  className,
  percentage,
  onZoomIn,
  onZoomOut,
  onChangePercentage,
}) {
  return (
    <div
      className={twMerge("h-6 flex items-center gap-1", className)}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <IconButton icon={removeIcon} onClick={onZoomOut} />
      <UnstyledInput
        className="w-10 h-6 rounded text-macaron-base text-macaron-text text-center bg-transparent outline-0 focus:ring-1 ring-inset ring-macaron-active"
        value={`${percentage}%`}
        onChangeValue={action((value) => {
          const newPercent = Number.parseFloat(value);
          if (isNaN(newPercent)) {
            return false;
          }
          onChangePercentage(newPercent);
          return true;
        })}
      />
      <IconButton icon={addIcon} onClick={onZoomIn} />
    </div>
  );
};
