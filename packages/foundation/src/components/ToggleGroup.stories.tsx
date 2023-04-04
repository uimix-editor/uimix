import React, { useState } from "react";
import alignLeftIcon from "@iconify-icons/ic/format-align-left";
import alignCenterIcon from "@iconify-icons/ic/format-align-center";
import alignRightIcon from "@iconify-icons/ic/format-align-right";
import { ToggleGroup } from "./ToggleGroup";

export default {
  title: "ToggleGroup",
  component: ToggleGroup,
};

export const Basic: React.FC = () => {
  const [value, setValue] = useState<"left" | "center" | "right" | undefined>(
    "left"
  );

  return (
    <div className="flex flex-col gap-2">
      <ToggleGroup
        value={value}
        onChange={setValue}
        items={[
          {
            value: "left",
            icon: alignLeftIcon,
          },
          {
            value: "center",
            icon: alignCenterIcon,
          },
          {
            value: "right",
            icon: alignRightIcon,
          },
        ]}
      />
    </div>
  );
};
