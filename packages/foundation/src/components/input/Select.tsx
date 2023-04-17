import * as RadixSelect from "@radix-ui/react-select";
import { popoverStyle } from "../styles/styles";
import checkIcon from "@iconify-icons/ic/check";
import upIcon from "@iconify-icons/ic/keyboard-arrow-up";
import downIcon from "@iconify-icons/ic/keyboard-arrow-down";
import { Icon, IconifyIcon } from "@iconify/react";
import { twMerge } from "tailwind-merge";
import React from "react";

export interface SelectOption<T extends string> {
  value: T;
  text?: string;
  icon?: IconifyIcon;
}

export function Select<T extends string>({
  className,
  options,
  placeholder,
  value,
  onChange,
}: {
  className?: string;
  options: readonly SelectOption<T>[];
  placeholder?: string;
  value?: T;
  onChange?: (value: T) => void;
}): JSX.Element {
  return (
    <CustomSelect
      options={options}
      value={value}
      onChange={onChange}
      trigger={
        <RadixSelect.Trigger
          className={twMerge(
            "relative outline-0 h-7 bg-macaron-uiBackground rounded focus:ring-1 ring-inset ring-macaron-active text-macaron-text text-macaron-base text-macaron-text placeholder:text-macaron-disabledText flex items-center justify-between",
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="absolute right-1.5">
            <Icon icon={downIcon} className="text-xs text-macaron-label" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
      }
    />
  );
}

const SelectItem: React.FC<{ option: SelectOption<string> }> = React.memo(
  ({ option }) => {
    return (
      <RadixSelect.Item
        value={option.value}
        className="pl-4 relative h-7 flex items-center outline-0 text-macaron-text [&[data-highlighted]]:bg-macaron-active [&[data-highlighted]]:text-macaron-activeText"
      >
        <RadixSelect.ItemIndicator className="absolute left-1.5">
          <Icon icon={checkIcon} className="text-xs opacity-60" />
        </RadixSelect.ItemIndicator>
        <RadixSelect.ItemText>
          <div className="px-1.5 flex items-center gap-1">
            {option.icon && (
              <Icon
                icon={option.icon}
                className="text-xs text-macaron-disabledText"
              />
            )}
            {option.text ?? option.value}
          </div>
        </RadixSelect.ItemText>
      </RadixSelect.Item>
    );
  }
);

export function CustomSelect<T extends string>({
  options,
  value,
  onChange,
  trigger,
}: {
  options: readonly SelectOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  trigger?: JSX.Element;
}): JSX.Element {
  return (
    <RadixSelect.Root
      value={value}
      onValueChange={(value) => onChange?.(value as T)}
    >
      {trigger}
      <RadixSelect.Portal>
        <RadixSelect.Content className={popoverStyle}>
          <RadixSelect.ScrollUpButton className="w-full flex justify-center p-1">
            <Icon icon={upIcon} className="text-xs text-macaron-label" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className="SelectViewport">
            {options.map((option) => (
              <SelectItem option={option} key={option.value} />
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="w-full flex justify-center p-1">
            <Icon icon={downIcon} className="text-xs text-macaron-label" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
