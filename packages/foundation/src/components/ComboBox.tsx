import downIcon from "@iconify-icons/ic/keyboard-arrow-down";
import { Icon, IconifyIcon } from "@iconify/react";
import { twMerge } from "tailwind-merge";
import { SelectOption } from "./Select";
import { UnstyledInput } from "./Input";
import { useId } from "react";

export function ComboBox({
  className,
  options,
  placeholder,
  value,
  onChange,
}: {
  className?: string;
  options: readonly SelectOption<string>[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: string | IconifyIcon;
}): JSX.Element {
  const datalistId = useId();

  const optionsNode = options.map((o) => (
    <option key={o.value} value={o.value}>
      {o.text}
    </option>
  ));

  // TODO: use Radix Select (currently native select is much faster when there are many options)
  return (
    <div
      className={twMerge(
        `relative
         outline-0 w-full h-7 bg-macaron-uiBackground rounded
         focus-within:ring-1 ring-inset ring-macaron-active text-macaron-text text-macaron-base`,
        className
      )}
    >
      <datalist id={datalistId}>{optionsNode}</datalist>
      <select
        className="absolute inset-0 text-macaron-base opacity-0"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {optionsNode}
      </select>
      <UnstyledInput
        className="absolute inset-0 right-4 bg-transparent px-1.5 outline-0 placeholder:text-macaron-disabledText
        [&::-webkit-calendar-picker-indicator]:opacity-0"
        value={value}
        onChangeValue={onChange}
        placeholder={placeholder}
        list={datalistId}
      />
      <Icon
        icon={downIcon}
        className="text-xs text-macaron-label absolute right-1 top-0 bottom-0 my-auto pointer-events-none"
      />
    </div>
  );
}
