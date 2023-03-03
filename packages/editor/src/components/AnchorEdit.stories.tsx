import React, { useState } from "react";
import { PositionConstraintType } from "@uimix/node-data";
import { AnchorEdit } from "./AnchorEdit";

export default {
  title: "AnchorEdit",
  component: AnchorEdit,
};

export const Basic: React.FC = () => {
  const [xValue, setXValue] = useState<PositionConstraintType>("start");
  const [yValue, setYValue] = useState<PositionConstraintType>("start");

  return (
    <AnchorEdit
      className="w-16"
      xValue={xValue}
      yValue={yValue}
      onXChange={setXValue}
      onYChange={setYValue}
    />
  );
};
