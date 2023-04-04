import { clamp } from "lodash-es";
import React from "react";
import styled from "@emotion/styled";
import { Color } from "../../utils/Color";
import { usePointerStroke } from "../hooks/usePointerStroke";
import { ColorHandle } from "./ColorSlider";

const SVPickerGradient = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
`;

const SVPickerWrap = styled.div`
  position: relative;
  z-index: 0; /* Create stacking context */
`;

const SVPickerBody = styled.div`
  position: relative;
  box-shadow: 0 0 0 1px inset rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  overflow: hidden;
`;

export const SVPicker: React.FC<{
  width: number;
  height: number;
  handleSize: number;
  color: Color;
  onChange: (color: Color) => void;
  onChangeEnd: (color: Color) => void;
}> = ({ width, height, handleSize, color, onChange, onChangeEnd }) => {
  const hueDeg = Math.round(color.h * 360);

  const saturationGradient = `linear-gradient(to right, hsl(${hueDeg}, 0%, 100%), hsl(${hueDeg}, 100%, 50%))`;
  const valueGradient = `linear-gradient(to top, hsl(${hueDeg}, 0%, 0%), hsl(${hueDeg}, 0%, 100%))`;

  const valueAtEvent = (e: React.MouseEvent<HTMLElement>) => {
    // TODO: Fix value is wrong when CSS transform is applied
    const rect = e.currentTarget.getBoundingClientRect();
    const s = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const v = clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1);
    return new Color({ ...color, s, v });
  };

  const pointerProps = usePointerStroke<HTMLElement>({
    onBegin: (e) => {
      onChange(valueAtEvent(e));
    },
    onMove: (e) => {
      onChange(valueAtEvent(e));
    },
    onEnd: (e) => {
      onChangeEnd(valueAtEvent(e));
    },
  });

  return (
    <SVPickerWrap>
      <SVPickerBody
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        {...pointerProps}
      >
        <SVPickerGradient style={{ background: valueGradient }} />
        <SVPickerGradient
          style={{ background: saturationGradient, mixBlendMode: "multiply" }}
        />
        <ColorHandle
          style={{
            position: "absolute",
            left: `${-handleSize / 2 + width * color.s}px`,
            top: `${-handleSize / 2 + height * (1 - color.v)}px`,
            width: `${handleSize}px`,
            height: `${handleSize}px`,
            color: color.toHex(),
          }}
        />
      </SVPickerBody>
    </SVPickerWrap>
  );
};
