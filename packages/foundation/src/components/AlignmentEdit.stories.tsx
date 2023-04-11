import React, { useState } from "react";
import { AlignmentEdit, StackAlign, StackJustify } from "./AlignmentEdit";

export default {
  title: "AlignmentEdit",
  component: AlignmentEdit,
};

export const Basic: React.FC = () => {
  const [align, setAlign] = useState<StackAlign>("start");
  const [justify, setJustify] = useState<StackJustify>("start");
  const [direction, setDirection] = useState<"x" | "y">("x");

  return (
    <div className="flex flex-col gap-2">
      <AlignmentEdit
        className="w-16"
        direction={direction}
        align={align}
        justify={justify}
        onChange={(align, justify) => {
          if (align) {
            setAlign(align);
          }
          if (justify) {
            setJustify(justify);
          }
        }}
      />
      <p>
        <div style={{ display: "inline-block" }}>
          <select
            value={direction}
            onChange={(event) => {
              setDirection(event.currentTarget.value as "x" | "y");
            }}
          >
            <option value="x">X</option>
            <option value="y">Y</option>
          </select>
        </div>
      </p>
      <p>
        <div style={{ display: "inline-block" }}>
          <select
            value={justify === "spaceBetween" ? "spaceBetween" : "packed"}
            onChange={(event) => {
              setJustify(
                event.currentTarget.value === "spaceBetween"
                  ? "spaceBetween"
                  : "start"
              );
            }}
          >
            <option value="packed">Packed</option>
            <option value="spaceBetween">Space Between</option>
          </select>
        </div>
      </p>
      <p>Align: {align}</p>
      <p>Justify: {justify}</p>
    </div>
  );
};
