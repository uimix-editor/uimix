import { useState } from "react";
import { SeparableInput } from "./SeparableInput";
import icon_line_weight from "@iconify-icons/ic/outline-line-weight";
import eachEdgeIcon from "@seanchas116/design-icons/json/separate-edges.json";
import edgeTopIcon from "@seanchas116/design-icons/json/edge-top.json";
import edgeRightIcon from "@seanchas116/design-icons/json/edge-right.json";
import edgeBottomIcon from "@seanchas116/design-icons/json/edge-bottom.json";
import edgeLeftIcon from "@seanchas116/design-icons/json/edge-left.json";
import { TooltipProvider } from "./Tooltip";

export default {
  title: "SeparableInput",
  component: SeparableInput,
};

export const Basic = () => {
  const [top, setTop] = useState(0);
  const [right, setRight] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft] = useState(0);

  return (
    <TooltipProvider>
      <div className="w-[14.5rem]">
        <SeparableInput
          title="Border Width"
          values={{
            top: String(top),
            right: String(right),
            bottom: String(bottom),
            left: String(left),
          }}
          edgeIcons={{
            all: icon_line_weight,
            top: edgeTopIcon,
            right: edgeRightIcon,
            bottom: edgeBottomIcon,
            left: edgeLeftIcon,
          }}
          toggleIcon={eachEdgeIcon}
          onChange={(edge, value) => {
            const numValue = Number.parseFloat(value);
            if (isNaN(numValue)) {
              return false;
            }

            switch (edge) {
              case "top":
                setTop(numValue);
                break;
              case "right":
                setRight(numValue);
                break;
              case "bottom":
                setBottom(numValue);
                break;
              case "left":
                setLeft(numValue);
                break;
              case "all":
                setTop(numValue);
                setRight(numValue);
                setBottom(numValue);
                setLeft(numValue);
                break;
            }
            return true;
          }}
        />
      </div>
    </TooltipProvider>
  );
};
