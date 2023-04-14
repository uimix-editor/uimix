import React from "react";
import { twMerge } from "tailwind-merge";

export const ToolButton = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithoutRef<JSX.IntrinsicElements["button"]>
>(({ className, ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className={twMerge(
        `text-macaron-text text-xl outline-0 w-7 h-7 flex items-center justify-center rounded aria-pressed:bg-macaron-active aria-pressed:text-macaron-activeText aria-expanded:bg-macaron-active aria-expanded:text-macaron-activeText active:scale-110 hover:bg-macaron-uiBackground`,
        className
      )}
    />
  );
});

ToolButton.displayName = "ToolButton";
