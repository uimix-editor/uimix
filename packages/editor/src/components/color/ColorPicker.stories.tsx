import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { Color } from "../../utils/Color";
import { ColorPicker } from "./ColorPicker";

export default {
  component: ColorPicker,
};

export const Basic: React.FC = () => {
  const [color, setColor] = useState(() => Color.from("purple"));
  return (
    <div className="flex flex-col gap-8">
      <SketchPicker
        color={color.toHex()}
        onChange={(change) => {
          const { hsl } = change;
          setColor(
            Color.hsl({
              h: hsl.h / 360,
              s: hsl.s,
              l: hsl.l,
              a: hsl.a ?? 1,
            })
          );
        }}
      />
      <ColorPicker
        color={color}
        onChange={setColor}
        onChangeEnd={(color) => {
          console.log("change end", color);
          setColor(color);
        }}
      />
    </div>
  );
};
