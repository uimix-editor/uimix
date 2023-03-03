import { Icon, IconifyIcon } from "@iconify/react";
import * as RadixToggleGroup from "@radix-ui/react-toggle-group";
import { twMerge } from "tailwind-merge";
import { Tooltip } from "./Tooltip";

export interface ToggleGroupItem<T extends string> {
  content: IconifyIcon | React.ReactNode;
  value: T;
  tooltip?: React.ReactNode;
}

export function ToggleGroup<T extends string>({
  className,
  items,
  value,
  onChange,
}: {
  className?: string;
  items: readonly ToggleGroupItem<T>[];
  value?: T;
  onChange?: (value?: T) => void;
}) {
  return (
    <RadixToggleGroup.Root
      className={twMerge(
        "w-fit rounded text-macaron-label inline-flex",
        className
      )}
      type="single"
      value={value ?? ""}
      onValueChange={(value) => {
        if (value) {
          onChange?.(value as T);
        } else {
          onChange?.(undefined);
        }
      }}
    >
      {items.map((item) => {
        return (
          <Tooltip text={item.tooltip} key={item.value}>
            <RadixToggleGroup.Item
              value={item.value}
              className="aria-checked:bg-macaron-active aria-checked:text-macaron-activeText w-6 h-6 flex items-center justify-center rounded"
            >
              {typeof item.content === "object" &&
              item.content &&
              "body" in item.content ? (
                <Icon icon={item.content} width={16} />
              ) : (
                item.content
              )}
            </RadixToggleGroup.Item>
          </Tooltip>
        );
      })}
    </RadixToggleGroup.Root>
  );
}
