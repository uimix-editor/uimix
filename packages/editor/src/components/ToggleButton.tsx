import { Icon, IconProps } from "@iconify/react";
import { twMerge } from "tailwind-merge";
import { Tooltip } from "@uimix/design-system/src/components/Tooltip";

export function ToggleButton({
  className,
  icon,
  value,
  tooltip,
  onChange,
}: {
  className?: string;
  icon: IconProps["icon"];
  value?: boolean;
  tooltip?: React.ReactNode;
  onChange?: (value: boolean) => void;
}) {
  return (
    <Tooltip text={tooltip}>
      <button
        className={twMerge(
          "aria-pressed:bg-macaron-active aria-pressed:text-macaron-activeText w-6 h-6 flex items-center justify-center rounded",
          className
        )}
        aria-pressed={value}
        onClick={() => {
          onChange?.(!value);
        }}
      >
        <Icon icon={icon} width={16} />
      </button>
    </Tooltip>
  );
}
