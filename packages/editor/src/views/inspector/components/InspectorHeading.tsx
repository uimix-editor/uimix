import { Icon, IconifyIconProps } from "@iconify/react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function InspectorHeading({
  icon,
  iconClassName,
  text,
  dimmed,
  buttons,
}: {
  icon: IconifyIconProps["icon"];
  iconClassName?: string;
  text: React.ReactNode;
  dimmed?: boolean;
  buttons?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex items-center justify-between h-4">
      <h2
        className={clsx("leading-4 font-medium flex gap-1.5 items-center", {
          "text-macaron-disabledText": dimmed,
        })}
      >
        <Icon
          icon={icon}
          className={twMerge("text-base opacity-50", iconClassName)}
        />
        {text}
      </h2>
      <div className="flex">{buttons}</div>
    </div>
  );
}
