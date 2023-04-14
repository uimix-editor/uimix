import React, { useState } from "react";
import { Vec2 } from "paintvec";
import { ResizeBox } from "./ResizeBox";

export default {
  component: ResizeBox,
};

export const Basic: React.FC = () => {
  const [p0, setP0] = useState(new Vec2(100));
  const [p1, setP1] = useState(new Vec2(300));

  return (
    <svg className="absolute left-0 top-0 w-full h-full pointer-events-none">
      <ResizeBox
        p0={p0}
        p1={p1}
        snap={(p) => p}
        onChangeBegin={() => {}}
        onChange={(p0, p1) => {
          setP0(p0);
          setP1(p1);
        }}
        onChangeEnd={() => {}}
      />
    </svg>
  );
};
