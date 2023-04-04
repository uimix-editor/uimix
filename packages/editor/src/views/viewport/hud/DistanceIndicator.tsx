import { Transform, Vec2 } from "paintvec";
import React from "react";
import { roundToFixed } from "@uimix/foundation/src/utils/Math";
import { Label } from "./Label";

export const XDistanceIndicator: React.FC<{
  y: number;
  x1: number;
  x2: number;
  transform: Transform;
  color: string;
}> = ({ y, x1, x2, transform, color }) => {
  const { x: x1_, y: y_ } = new Vec2(x1, y).transform(transform);
  const { x: x2_ } = new Vec2(x2, y).transform(transform);

  return (
    <>
      <line stroke={color} x1={x1_} y1={y_} x2={x2_} y2={y_} />
      <Label
        centerX={(x1_ + x2_) / 2}
        top={y_ + 4}
        color={color}
        text={String(roundToFixed(Math.abs(x1 - x2), 2))}
      />
    </>
  );
};

export const YDistanceIndicator: React.FC<{
  x: number;
  y1: number;
  y2: number;
  transform: Transform;
  color: string;
}> = ({ x, y1, y2, transform, color }) => {
  const { x: x_, y: y1_ } = new Vec2(x, y1).transform(transform);
  const { y: y2_ } = new Vec2(x, y2).transform(transform);

  return (
    <>
      <line stroke={color} x1={x_} y1={y1_} x2={x_} y2={y2_} />
      <Label
        centerY={(y1_ + y2_) / 2}
        left={x_ + 4}
        color={color}
        text={String(roundToFixed(Math.abs(y1 - y2), 2))}
      />
    </>
  );
};
