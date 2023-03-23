import React, { useState } from "react";
import { AnchorEdit, AnchorType } from "./AnchorEdit";

export default {
  title: "AnchorEdit",
  component: AnchorEdit,
};

export const Basic: React.FC = () => {
  const [xValue, setXValue] = useState<AnchorType>("start");
  const [yValue, setYValue] = useState<AnchorType>("start");

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
