import React, { useState } from "react";
import { Select } from "./Select";
import htmlTags from "html-tags";
import tagIcon from "@iconify-icons/ic/sharp-numbers";
import textIcon from "@seanchas116/design-icons/json/text.json";
import switchIcon from "@seanchas116/design-icons/json/switch.json";

export default {
  title: "Select",
  component: Select,
};

export const Basic: React.FC = () => {
  const [value, setValue] = useState<string | undefined>("div");

  return (
    <div className="flex flex-col gap-2 w-[200px]">
      <Select
        value={value}
        onChange={setValue}
        options={htmlTags.map((tag) => ({
          value: tag,
          text: tag,
        }))}
      />
    </div>
  );
};

export const Icons: React.FC = () => {
  const [value, setValue] = useState<string | undefined>("div");

  return (
    <div className="flex flex-col gap-2 w-[200px]">
      <Select
        value={value}
        onChange={setValue}
        options={[
          {
            value: "boolean",
            text: "Boolean",
            icon: switchIcon,
          },
          {
            value: "number",
            text: "Number",
            icon: tagIcon,
          },
          {
            value: "string",
            text: "String",
            icon: textIcon,
          },
        ]}
      />
    </div>
  );
};
