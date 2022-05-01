import { ColorInput } from "@seanchas116/paintkit/src/components/color/ColorInput";
import { Color } from "@seanchas116/paintkit/src/util/Color";
import { MIXED } from "@seanchas116/paintkit/src/util/Mixed";
import React from "react";

export const CSSColorInput: React.FC<{
  value?: string | typeof MIXED;
  placeholder?: string;
  onChange?: (value?: string) => void;
  onChangeEnd?: (value?: string) => void;
}> = ({ value, placeholder, onChange, onChangeEnd }) => {
  const color = typeof value === "string" ? Color.fromCSS(value) : undefined;

  return (
    <ColorInput
      color={color}
      text={color?.toString()}
      placeholder={placeholder}
      onChangeColor={(color) => onChange?.(color?.toString())}
      onChangeEndColor={(color) => onChangeEnd?.(color?.toString())}
      onChangeText={(text) => {
        if (!text) {
          onChange?.(undefined);
          onChangeEnd?.(undefined);
          return true;
        }
        const color = Color.fromCSS(text);
        if (!color) {
          return false;
        }
        onChange?.(color.toString()), onChangeEnd?.(color.toString());
        return true;
      }}
    />
  );
};
