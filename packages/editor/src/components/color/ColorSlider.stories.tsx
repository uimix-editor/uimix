import React, { useState } from "react";
import { Color } from "../../utils/Color";
import { ColorSlider } from "./ColorSlider";

export default {
  component: ColorSlider,
};

export const Basic: React.FC = () => {
  const [color0, setColor0] = useState(new Color({ h: 0, s: 1, v: 1 }));
  const [color1, setColor1] = useState(new Color({ h: 0, s: 1, v: 1 }));

  return (
    <div className="flex flex-col gap-4">
      <ColorSlider
        direction="right"
        length={160}
        handleSize={12}
        railWidth={8}
        color={color0.toHex()}
        colorStops={[
          "#FF0000",
          "#FFFF00",
          "#00FF00",
          "#00FFFF",
          "#0000FF",
          "#FF00FF",
          "#FF0000",
        ]}
        value={color0.h}
        onChange={(h) => {
          setColor0(new Color({ ...color0, h }));
        }}
      />
      <ColorSlider
        direction="right"
        length={160}
        handleSize={12}
        railWidth={8}
        color={color1.toHex()}
        colorStops={["#FF000000", "#FF0000FF"]}
        value={color1.a}
        onChange={(a) => {
          setColor1(new Color({ ...color1, a }));
        }}
      />
      <div className="flex gap-4">
        <ColorSlider
          direction="top"
          length={160}
          handleSize={12}
          railWidth={8}
          color={color0.toHex()}
          colorStops={[
            "#FF0000",
            "#FFFF00",
            "#00FF00",
            "#00FFFF",
            "#0000FF",
            "#FF00FF",
            "#FF0000",
          ]}
          value={color0.h}
          onChange={(h) => {
            setColor0(new Color({ ...color0, h }));
          }}
        />
        <ColorSlider
          direction="top"
          length={160}
          handleSize={12}
          railWidth={8}
          color={color1.toHex()}
          colorStops={["#FF000000", "#FF0000FF"]}
          value={color1.a}
          onChange={(a) => {
            setColor1(new Color({ ...color1, a }));
          }}
        />
      </div>
    </div>
  );
};
