import React, { createRef, useEffect } from "react";

const paddingX = 4;

export const Label: React.FC<{
  text: string;
  color: string;
  left?: number;
  top?: number;
  centerX?: number;
  centerY?: number;
}> = ({ text, color, left, top, centerX = 0, centerY = 0 }) => {
  const rectRef = createRef<SVGRectElement>();
  const textRef = createRef<SVGTextElement>();

  useEffect(() => {
    if (!rectRef.current || !textRef.current) {
      return;
    }
    textRef.current.textContent = text;
    const bbox = textRef.current.getBBox();
    const rectWidth = bbox.width + paddingX * 2;
    const rectHeight = 16;

    if (left != null) {
      textRef.current.setAttribute("x", String(left + paddingX));
      rectRef.current.setAttribute("x", String(left));
    } else {
      textRef.current.setAttribute("x", String(centerX - bbox.width / 2));
      rectRef.current.setAttribute("x", String(centerX - rectWidth / 2));
    }

    if (top != null) {
      textRef.current.setAttribute("y", String(top + rectHeight / 2));
      rectRef.current.setAttribute("y", String(top));
    } else {
      textRef.current.setAttribute("y", String(centerY));
      rectRef.current.setAttribute("y", String(centerY - rectHeight / 2));
    }

    rectRef.current.setAttribute("width", String(rectWidth));
    rectRef.current.setAttribute("height", String(rectHeight));
  }, [text, left, top, centerX, centerY]);

  return (
    <>
      <rect ref={rectRef} rx={4} ry={4} fill={color} />
      <text
        ref={textRef}
        style={{
          fontSize: "10px",
          fontWeight: "500" as React.CSSProperties["fontWeight"],
        }}
        fill={"white"}
        dominantBaseline={"central"}
      />
    </>
  );
};
