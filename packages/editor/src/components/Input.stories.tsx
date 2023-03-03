import React, { useState } from "react";
import { Input } from "./Input";
import opacityIcon from "@iconify-icons/ic/opacity";

export default {
  title: "Input",
  component: Input,
};

export const Basic: React.FC = () => {
  const [value, setValue] = useState("Text");

  return (
    <div className="flex flex-col gap-2">
      <Input value={value} onChange={setValue} icon={opacityIcon} />
      <Input value={value} onChange={setValue} icon="W" />
    </div>
  );
};
