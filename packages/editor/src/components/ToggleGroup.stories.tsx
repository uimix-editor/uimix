import React, { useState } from "react";
import alignLeftIcon from "@iconify-icons/ic/format-align-left";
import alignCenterIcon from "@iconify-icons/ic/format-align-center";
import alignRightIcon from "@iconify-icons/ic/format-align-right";
import { Icon } from "@iconify/react";
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
            content: <Icon icon={alignLeftIcon} width={16} />,
          },
          {
            value: "center",
            content: <Icon icon={alignCenterIcon} width={16} />,
          },
          {
            value: "right",
            content: <Icon icon={alignRightIcon} width={16} />,
          },
        ]}
      />
    </div>
  );
};
