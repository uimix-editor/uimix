import React from "react";
import { twMerge } from "tailwind-merge";
import { Icon, IconifyIcon } from "@iconify/react";
import { Mixed } from "../../utils/Mixed";
import { Tooltip } from "../misc/Tooltip";
import { UnstyledInput } from "./UnstyledInput";

export const Input: React.FC<{
  className?: string;
  value?: string | Mixed;
  onChange?: (value: string) => void;
  placeholder?: string;
  icon?: IconifyIcon | React.ReactNode;
  tooltip?: React.ReactNode;
}> = ({ className, value, onChange, placeholder, icon, tooltip }) => {
  return (
    <Tooltip text={tooltip}>
      <div className={twMerge("h-fit relative", className)}>
        <UnstyledInput
          className="block outline-0 w-full h-7 px-1.5 bg-macaron-uiBackground rounded focus:ring-1 ring-inset ring-macaron-active text-macaron-text text-macaron-base placeholder:text-macaron-disabledText"
          value={value}
          onChangeValue={onChange}
          placeholder={placeholder}
        />
        <div className="absolute right-1.5 top-0 bottom-0 flex items-center text-macaron-disabledText text-2xs font-medium">
          {typeof icon === "object" && icon && "body" in icon ? (
            <Icon icon={icon} className="text-xs" />
          ) : (
            icon
          )}
        </div>
      </div>
    </Tooltip>
  );
};
