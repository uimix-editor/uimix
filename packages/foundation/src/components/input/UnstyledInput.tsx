import React, { useEffect } from "react";
import { mergeRefs } from "react-merge-refs";
import { useDraftValue } from "../hooks/useDraftValue";
import { Mixed } from "../../utils/Mixed";

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
