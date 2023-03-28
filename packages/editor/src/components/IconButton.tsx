import { Icon, IconProps } from "@iconify/react";
import React from "react";
import { twMerge } from "tailwind-merge";

export type IconButtonProps = React.PropsWithoutRef<
  JSX.IntrinsicElements["button"]
> & {
  icon: IconProps["icon"];
  rotate?: number;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, rotate, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={twMerge(
          "-m-0.5 w-5 h-5 rounded flex items-center justify-center text-macaron-icon hover:bg-macaron-text/10 aria-pressed:bg-macaron-active aria-pressed:text-macaron-activeText",
          className
        )}
      >
        <Icon icon={icon} width={16} rotate={rotate} />
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
