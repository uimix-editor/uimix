import React, { useState } from "react";
import styled from "@emotion/styled";
import colors from "../colors";
import { Color } from "../utils/Color";

const active02Color = Color.from(colors.active)?.withAlpha(0.2).toString();

const unselectedColor = Color.from(colors.text)?.withAlpha(0.1).toString();

const AnchorEditSVG = styled.svg`
  aspect-ratio: 1;
`;

const AnchorEditWrap = styled.div`
  background: ${colors.uiBackground};
  border-radius: 4px;
  display: flex;
  justify-content: center;
`;

const AnchorClickable = styled.rect`
  rx: 4;
  fill: transparent;
  cursor: pointer;
  :hover {
    fill: ${active02Color};
  }
`;

export type AnchorType = "start" | "end" | "both" | "center" | "scale";

export const AnchorEdit: React.VFC<{
  className?: string;
  xValue: AnchorType;
  yValue: AnchorType;
  onXChange: (value: AnchorType) => void;
  onYChange: (value: AnchorType) => void;
}> = ({ className, xValue, yValue, onXChange, onYChange }) => {
  const [xCenterHovered, setXCenterHovered] = useState(false);
  const [yCenterHovered, setYCenterHovered] = useState(false);

  return (
    <AnchorEditWrap className={className}>
      <AnchorEditSVG className={className} viewBox="0 0 64 64">
        <rect
          x="30"
          y="4"
          width="4"
          height="12"
          rx="1"
          fill={
            yValue === "start" || yValue === "both"
              ? colors.active
              : unselectedColor
          }
        />
        <AnchorClickable
          x="26"
          y="0"
          width="12"
          height="20"
          onClick={(e) => {
            if (e.shiftKey) {
              if (yValue === "start") {
                onYChange("scale");
                return;
              }
              if (yValue === "end") {
                onYChange("both");
                return;
              }
            }
            onYChange("start");
          }}
        />
        <rect
          x="30"
          y="48"
          width="4"
          height="12"
          rx="1"
          fill={
            yValue === "end" || yValue === "both"
              ? colors.active
              : unselectedColor
          }
        />
        <AnchorClickable
          x="26"
          y="44"
          width="12"
          height="20"
          onClick={(e) => {
            if (e.shiftKey) {
              if (yValue === "end") {
                onYChange("scale");
                return;
              }
              if (yValue === "start") {
                onYChange("both");
                return;
              }
            }
            onYChange("end");
          }}
        />
        <rect
          x="4"
          y="30"
          width="12"
          height="4"
          rx="1"
          fill={
            xValue === "start" || xValue === "both"
              ? colors.active
              : unselectedColor
          }
        />
        <AnchorClickable
          x="0"
          y="26"
          width="20"
          height="12"
          onClick={(e) => {
            if (e.shiftKey) {
              if (xValue === "start") {
                onXChange("scale");
                return;
              }
              if (xValue === "end") {
                onXChange("both");
                return;
              }
            }
            onXChange("start");
          }}
        />
        <rect
          x="48"
          y="30"
          width="12"
          height="4"
          rx="1"
          fill={
            xValue === "end" || xValue === "both"
              ? colors.active
              : unselectedColor
          }
        />
        <AnchorClickable
          x="44"
          y="26"
          width="20"
          height="12"
          onClick={(e) => {
            if (e.shiftKey) {
              if (xValue === "end") {
                onXChange("scale");
                return;
              }
              if (xValue === "start") {
                onXChange("both");
                return;
              }
            }
            onXChange("end");
          }}
        />
        <path
          d="M31 26C30.4477 26 30 26.4477 30 27V30H27C26.4477 30 26 30.4477 26 31V33C26 33.5523 26.4477 34 27 34H30V37C30 37.5523 30.4477 38 31 38H33C33.5523 38 34 37.5523 34 37V34H37C37.5523 34 38 33.5523 38 33V31C38 30.4477 37.5523 30 37 30H34V27C34 26.4477 33.5523 26 33 26H31Z"
          fill={unselectedColor}
        />
        <rect
          x="20"
          y="20"
          width="24"
          height="24"
          fill="transparent"
          cursor="pointer"
          onMouseLeave={() => {
            setXCenterHovered(false);
            setYCenterHovered(false);
          }}
          onMouseMove={(e) => {
            const x = e.nativeEvent.offsetX - 32;
            const y = e.nativeEvent.offsetY - 32;
            if (Math.abs(x) > Math.abs(y)) {
              // x
              setXCenterHovered(true);
              setYCenterHovered(false);
            } else {
              // y
              setXCenterHovered(false);
              setYCenterHovered(true);
            }
          }}
          onClick={(e) => {
            const x = e.nativeEvent.offsetX - 32;
            const y = e.nativeEvent.offsetY - 32;
            if (Math.abs(x) > Math.abs(y)) {
              // x
              onXChange("center");
            } else {
              // y
              onYChange("center");
            }
          }}
        />
        <rect
          x="20"
          y="26"
          width="24"
          height="12"
          rx="4"
          pointerEvents="none"
          fill={xCenterHovered ? active02Color : "transparent"}
        />
        <rect
          x="26"
          y="20"
          width="12"
          height="24"
          rx="4"
          pointerEvents="none"
          fill={yCenterHovered ? active02Color : "transparent"}
        />
        <rect
          x="26"
          y="30"
          width="12"
          height="4"
          rx="1"
          pointerEvents="none"
          fill={xValue === "center" ? colors.active : "transparent"}
        />
        <rect
          x="30"
          y="26"
          width="4"
          height="12"
          rx="1"
          pointerEvents="none"
          fill={yValue === "center" ? colors.active : "transparent"}
        />
      </AnchorEditSVG>
    </AnchorEditWrap>
  );
};
