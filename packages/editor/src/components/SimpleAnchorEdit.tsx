import React from "react";
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

export const SimpleAnchorEdit: React.VFC<{
  className?: string;
  xValue: "start" | "end" | "both";
  yValue: "start" | "end" | "both";
  onXChange: (value: "start" | "end" | "both") => void;
  onYChange: (value: "start" | "end" | "both") => void;
}> = ({ className, xValue, yValue, onXChange, onYChange }) => {
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
              if (xValue === "start") {
                onXChange("both");
                return;
              }
            }
            onXChange("end");
          }}
        />
      </AnchorEditSVG>
    </AnchorEditWrap>
  );
};
