import React, { useState } from "react";
import styled from "@emotion/styled";
import colorizeIcon from "@iconify-icons/ic/outline-colorize";
import { mod } from "../../utils/Math";
import { Color } from "../../utils/Color";
import { UnstyledInput } from "../input/UnstyledInput";
import { checkPattern } from "../styles/checkPattern";
import { ColorSlider } from "./ColorSlider";
import { SVPicker } from "./SVPicker";
import { Icon } from "@iconify/react";
import tw from "tailwind-styled-components";
import { twMerge } from "tailwind-merge";

declare global {
  interface EyeDropper {
    open(): Promise<{ sRGBHex: string }>;
  }

  // eslint-disable-next-line no-var
  var EyeDropper: {
    prototype: EyeDropper;
    new (): EyeDropper;
  };
}

const InputColumn: React.FC<JSX.IntrinsicElements["div"]> = tw.div`
  flex flex-col items-center gap-1 min-w-0
`;

const Input = tw(UnstyledInput)`
  outline-0 w-full h-6 bg-macaron-uiBackground rounded focus:ring-1 ring-inset ring-macaron-active text-macaron-text text-macaron-base placeholder:text-macaron-disabledText text-center
`;

const InputLabel = tw.label`
  text-2xs leading-none text-macaron-label
`;

type SliderMode = "rgb" | "hsv";

const InputsRow = ({
  color,
  onChange,
  onChangeEnd,
}: {
  color: Color;
  onChange?: (color: Color) => void;
  onChangeEnd?: (color: Color) => void;
}) => {
  const [mode, setMode] = useState<SliderMode>("hsv");

  const rgbColor = color.rgb;

  return (
    <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr] gap-1">
      <InputColumn>
        <Input
          value={color.toHex6()}
          onChangeValue={(hexString) => {
            const newColor = Color.from(
              hexString[0] === "#" ? hexString : "#" + hexString
            );
            if (!newColor) {
              return false;
            }
            onChange?.(newColor);
            onChangeEnd?.(newColor);
            return true;
          }}
        />
        <InputLabel>Hex</InputLabel>
      </InputColumn>
      {mode === "hsv" ? (
        <>
          <InputColumn>
            <Input
              value={Math.round(color.h * 360).toString()}
              onChangeValue={(hString) => {
                const h = mod(Number.parseInt(hString) / 360, 1);
                const newColor = new Color({ ...color, h });
                onChange?.(newColor);
                onChangeEnd?.(newColor);
                return true;
              }}
            />
            <InputLabel onClick={() => setMode("rgb")}>H</InputLabel>
          </InputColumn>
          {(["s", "v"] as const).map((key) => {
            return (
              <InputColumn key={key}>
                <Input
                  value={Math.round(color[key] * 100).toString()}
                  onChangeValue={(valueString) => {
                    const value = mod(Number.parseInt(valueString) / 100, 1);
                    const newColor = new Color({ ...color, [key]: value });
                    onChange?.(newColor);
                    onChangeEnd?.(newColor);
                    return true;
                  }}
                />
                <InputLabel onClick={() => setMode("rgb")}>
                  {key.toUpperCase()}
                </InputLabel>
              </InputColumn>
            );
          })}
        </>
      ) : (
        <>
          {(["r", "g", "b"] as const).map((key) => {
            return (
              <InputColumn key={key}>
                <Input
                  value={Math.round(rgbColor[key] * 255).toString()}
                  onChangeValue={(valueString) => {
                    const value = mod(Number.parseInt(valueString) / 255, 1);
                    const newColor = Color.rgb({
                      ...rgbColor,
                      [key]: value,
                    });
                    onChange?.(newColor);
                    onChangeEnd?.(newColor);
                    return true;
                  }}
                />
                <InputLabel onClick={() => setMode("hsv")}>
                  {key.toUpperCase()}
                </InputLabel>
              </InputColumn>
            );
          })}
        </>
      )}

      <InputColumn>
        <Input
          value={Math.round(color.a * 100).toString()}
          onChangeValue={(aString) => {
            const a = mod(Number.parseInt(aString) / 100, 1);
            const newColor = new Color({ ...color, a });
            onChange?.(newColor);
            onChangeEnd?.(newColor);
            return true;
          }}
        />
        <InputLabel onClick={() => setMode(mode === "rgb" ? "hsv" : "rgb")}>
          A
        </InputLabel>
      </InputColumn>
    </div>
  );
};

const ColorBox = styled.div`
  position: relative;
  overflow: hidden;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px inset rgba(0, 0, 0, 0.15);
  background-color: currentColor;

  &::before {
    content: "";

    z-index: -1;

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    ${checkPattern("white", "#aaa", "8px")}
  }
`;

export const ColorPicker: React.FC<{
  color: Color;
  onChange?: (color: Color) => void;
  onChangeEnd?: (color: Color) => void;
  className?: string;
}> = ({ color, onChange, onChangeEnd, className }) => {
  const opaqueColor = new Color({ ...color, a: 1 });

  const onEyeDropper = async () => {
    if (!window.EyeDropper) {
      return;
    }

    const eyeDropper = new EyeDropper();

    const result = await eyeDropper.open();
    const color = Color.from(result.sRGBHex);
    if (!color) {
      return;
    }
    onChange?.(color);
  };

  return (
    <div className={twMerge("w-[232px] flex flex-col gap-3 p-3", className)}>
      <SVPicker
        width={208}
        height={160}
        handleSize={12}
        color={opaqueColor}
        onChange={(opaqueColor) => {
          onChange?.(new Color({ ...opaqueColor, a: color.a }));
        }}
        onChangeEnd={(opaqueColor) => {
          onChangeEnd?.(new Color({ ...opaqueColor, a: color.a }));
        }}
      />
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <ColorSlider
            direction="right"
            length={160}
            handleSize={12}
            railWidth={8}
            color={new Color({ h: color.h, s: 1, v: 1 }).toHex()}
            colorStops={[
              "#FF0000",
              "#FFFF00",
              "#00FF00",
              "#00FFFF",
              "#0000FF",
              "#FF00FF",
              "#FF0000",
            ]}
            value={color.h}
            onChange={(h) => {
              onChange?.(new Color({ ...color, h }));
            }}
            onChangeEnd={(h) => {
              onChangeEnd?.(new Color({ ...color, h }));
            }}
          />
          <ColorSlider
            direction="right"
            length={160}
            handleSize={12}
            railWidth={8}
            color={opaqueColor.toHex()}
            colorStops={[
              new Color({ ...color, a: 0 }).toHex(),
              new Color({ ...color, a: 1 }).toHex(),
            ]}
            value={color.a}
            onChange={(a) => {
              onChange?.(new Color({ ...color, a }));
            }}
            onChangeEnd={(a) => {
              onChangeEnd?.(new Color({ ...color, a }));
            }}
          />
        </div>
        <button
          className="text-macaron-text w-5 h-5 flex items-center justify-center"
          onClick={onEyeDropper}
        >
          <Icon icon={colorizeIcon} className="text-base" />
        </button>
        <ColorBox style={{ color: color.toHex() }} />
      </div>
      <InputsRow color={color} onChange={onChange} onChangeEnd={onChangeEnd} />
    </div>
  );
};
