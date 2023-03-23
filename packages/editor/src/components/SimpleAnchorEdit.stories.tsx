import React, { useState } from "react";
import { SimpleAnchorEdit } from "./SimpleAnchorEdit";

export default {
  title: "SimpleAnchorEdit",
  component: SimpleAnchorEdit,
};

export const Basic: React.FC = () => {
  const [xValue, setXValue] = useState<"start" | "end" | "both">("start");
  const [yValue, setYValue] = useState<"start" | "end" | "both">("start");

  return (
    <SimpleAnchorEdit
      className="w-16"
      xValue={xValue}
      yValue={yValue}
      onXChange={setXValue}
      onYChange={setYValue}
    />
  );
};
