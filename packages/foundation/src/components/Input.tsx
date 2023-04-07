import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { mergeRefs } from "react-merge-refs";
import { useDraftValue } from "./hooks/useDraftValue";
import { Icon, IconifyIcon } from "@iconify/react";
import { Mixed } from "../utils/Mixed";
import { Tooltip } from "./Tooltip";

export type UnstyledInputProps = Omit<
  JSX.IntrinsicElements["input"],
  "ref" | "value"
> & {
  ref?: React.Ref<HTMLInputElement>;
  value?: string | Mixed;
  onChangeValue?: (value: string) => void;
};

export const UnstyledInput = React.forwardRef<
  HTMLInputElement,
  UnstyledInputProps
>(({ value, placeholder, onChangeValue, ...props }, ref) => {
  const inputRef = React.createRef<HTMLInputElement>();

  const [draft, onDraftChange, onDraftChangeDone] = useDraftValue<string>(
    value === Mixed ? "" : value ?? "",
    onChangeValue ?? (() => {})
  );

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      const onChangeNative = () => {
        onDraftChangeDone();
      };
      input.addEventListener("change", onChangeNative);
      return () => {
        input.removeEventListener("change", onChangeNative);
      };
    }
  }, [inputRef, onDraftChangeDone]);

  return (
    <input
      {...props}
      value={draft}
      placeholder={value === Mixed ? "Mixed" : placeholder}
      onChange={(e) => onDraftChange(e.currentTarget.value)}
      ref={mergeRefs([inputRef, ref])}
    />
  );
});

UnstyledInput.displayName = "UnstyledInput";

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
