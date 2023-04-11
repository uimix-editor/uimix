import { range, clamp } from "lodash-es";
import React, { useState } from "react";
import styled from "@emotion/styled";
import colors from "../colors.js";

export type StackAlign = "start" | "center" | "end";
export type StackJustify = "start" | "center" | "end" | "spaceBetween";

const AlignmentEditSVG = styled.svg<{ direction: "x" | "y" }>`
  aspect-ratio: 1;
  transform: ${(p) =>
    p.direction === "y" ? "matrix(0, 1, 1, 0, 0 ,0)" : "none"};
  * {
    pointer-events: none;
  }
`;

const AlignmentEditWrap = styled.div`
  background: ${colors.uiBackground};
  border-radius: 4px;
  display: flex;
  justify-content: center;
`;

const alignValues = ["start", "center", "end"] as const;

const PackedAlignmentEdit: React.VFC<{
  className?: string;
  direction: "x" | "y";
  align?: StackAlign;
  justify?: StackAlign;
  onChange: (align?: StackAlign, justify?: StackJustify) => void;
}> = ({ className, direction, align, justify, onChange }) => {
  let index: number;
  if (align && justify) {
    const row = alignValues.indexOf(align);
    const col = alignValues.indexOf(justify);
    index = col + row * 3;
  } else {
    index = -1;
  }

  const [hoverIndex, setHoverIndex] = useState(-1);

  const opacities = range(0, 9).map((i) =>
    index === i ? 1 : hoverIndex === i ? 0.3 : 0
  );

  const onClickIndex = (index: number) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    onChange(alignValues[row], alignValues[col]);
  };

  const indexFromEvent = (e: React.MouseEvent) => {
    const x = e.nativeEvent.offsetX / e.currentTarget.clientWidth;
    const y = e.nativeEvent.offsetY / e.currentTarget.clientHeight;
    const col = clamp(Math.floor(x * 3), 0, 2);
    const row = clamp(Math.floor(y * 3), 0, 2);
    return col + row * 3;
  };

  return (
    <AlignmentEditWrap className={className}>
      <AlignmentEditSVG
        direction={direction}
        viewBox="0 0 64 64"
        onMouseMove={(e) => {
          setHoverIndex(indexFromEvent(e));
        }}
        onClick={(e) => {
          onClickIndex(indexFromEvent(e));
        }}
        onMouseLeave={() => {
          setHoverIndex(-1);
        }}
      >
        <g opacity={opacities[0]}>
          <rect x="6" y="6" width="4" height="16" rx="1" fill={colors.active} />
          <rect
            x="14"
            y="6"
            width="4"
            height="10"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="22"
            y="6"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
        </g>
        <g opacity={opacities[1]}>
          <rect
            x="22"
            y="6"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="30"
            y="6"
            width="4"
            height="10"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="38"
            y="6"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
        </g>
        <g opacity={opacities[2]}>
          <rect
            x="38"
            y="6"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="46"
            y="6"
            width="4"
            height="10"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="54"
            y="6"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
        </g>
        <g opacity={opacities[3]}>
          <rect
            x="6"
            y="24"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="14"
            y="27"
            width="4"
            height="10"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="22"
            y="24"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
        </g>
        <g opacity={opacities[4]}>
          <rect
            x="22"
            y="24"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="30"
            y="27"
            width="4"
            height="10"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="38"
            y="24"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
        </g>
        <g opacity={opacities[5]}>
          <rect
            x="38"
            y="24"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="46"
            y="27"
            width="4"
            height="10"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="54"
            y="24"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
        </g>
        <g opacity={opacities[6]}>
          <rect
            x="6"
            y="42"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="14"
            y="48"
            width="4"
            height="10"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="22"
            y="42"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
        </g>
        <g opacity={opacities[7]}>
          <rect
            x="22"
            y="42"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="30"
            y="48"
            width="4"
            height="10"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="38"
            y="42"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
        </g>
        <g opacity={opacities[8]}>
          <rect
            x="38"
            y="42"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="46"
            y="48"
            width="4"
            height="10"
            rx="1"
            fill={colors.active}
          />
          <rect
            x="54"
            y="42"
            width="4"
            height="16"
            rx="1"
            fill={colors.active}
          />
        </g>
      </AlignmentEditSVG>
    </AlignmentEditWrap>
  );
};

const SpaceBetweenAlignmentEdit: React.VFC<{
  className?: string;
  direction: "x" | "y";
  align?: StackAlign;
  onChange: (value: StackAlign) => void;
}> = ({ className, direction, align, onChange: onAlignChange }) => {
  const index = align ? alignValues.indexOf(align) : -1;

  const [hoverIndex, setHoverIndex] = useState(-1);

  const opacities = range(0, 3).map((i) =>
    index === i ? 1 : hoverIndex === i ? 0.3 : 0
  );

  const onClickIndex = (index: number) => {
    onAlignChange(alignValues[index]);
  };

  const indexFromEvent = (e: React.MouseEvent) => {
    const y = e.nativeEvent.offsetY / e.currentTarget.clientHeight;
    return clamp(Math.floor(y * 3), 0, 2);
  };

  return (
    <AlignmentEditSVG
      direction={direction}
      viewBox="0 0 64 64"
      className={className}
      onMouseMove={(e) => {
        setHoverIndex(indexFromEvent(e));
      }}
      onClick={(e) => {
        onClickIndex(indexFromEvent(e));
      }}
      onMouseLeave={() => {
        setHoverIndex(-1);
      }}
    >
      <rect width="64" height="64" rx="4" fill={colors.uiBackground} />
      <g opacity={opacities[0]}>
        <rect x="6" y="6" width="4" height="16" rx="1" fill={colors.active} />
        <rect x="30" y="6" width="4" height="10" rx="1" fill={colors.active} />
        <rect x="54" y="6" width="4" height="16" rx="1" fill={colors.active} />
      </g>
      <g opacity={opacities[1]}>
        <rect x="6" y="24" width="4" height="16" rx="1" fill={colors.active} />
        <rect x="30" y="27" width="4" height="10" rx="1" fill={colors.active} />
        <rect x="54" y="24" width="4" height="16" rx="1" fill={colors.active} />
      </g>
      <g opacity={opacities[2]}>
        <rect x="6" y="42" width="4" height="16" rx="1" fill={colors.active} />
        <rect x="30" y="48" width="4" height="10" rx="1" fill={colors.active} />
        <rect x="54" y="42" width="4" height="16" rx="1" fill={colors.active} />
      </g>
    </AlignmentEditSVG>
  );
};

export const AlignmentEdit: React.VFC<{
  className?: string;
  direction: "x" | "y";
  align?: StackAlign;
  justify?: StackJustify;
  onChange: (align?: StackAlign, justify?: StackJustify) => void;
}> = ({ className, align, direction, justify, onChange }) => {
  if (justify === "spaceBetween") {
    return (
      <SpaceBetweenAlignmentEdit
        className={className}
        direction={direction}
        align={align}
        onChange={(align) => onChange(align, justify)}
      />
    );
  }
  return (
    <PackedAlignmentEdit
      className={className}
      direction={direction}
      align={align}
      justify={justify}
      onChange={onChange}
    />
  );
};
