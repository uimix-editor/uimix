import React, { useState } from "react";
import alignLeftIcon from "@iconify-icons/ic/format-align-left";
import { ToggleButton } from "./ToggleButton";

export default {
  title: "ToggleButton",
  component: ToggleButton,
};

export const Basic: React.FC = () => {
  const [value, setValue] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <ToggleButton value={value} icon={alignLeftIcon} onChange={setValue} />
    </div>
  );
};
