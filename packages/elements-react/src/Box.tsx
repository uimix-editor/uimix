import { ReactNode, useId } from "react";
import { StyleProps, defaultStyle } from "./StyleProps";
import { buildNodeCSS } from "./buildNodeCSS";

function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export const Box: React.FC<
  Partial<StyleProps> & {
    children?: ReactNode;
  }
> = (props) => {
  const style = buildNodeCSS("frame", {
    ...defaultStyle,
    ...props,
  });

  const id = useId().replaceAll(":", "_");
  const className = `box-${id}`;

  const cssBody = Object.entries(style.self)
    .map(([key, value]) => {
      return `${kebabCase(key)}: ${String(value)};`;
    })
    .join(";");
  const childrenCSSBody = Object.entries(style.children)
    .map(([key, value]) => {
      return `${kebabCase(key)}: ${String(value)};`;
    })
    .join(";");

  const styleText = `.${className}{${cssBody}} .${className}>*{${childrenCSSBody}}`;

  return (
    <div className={className}>
      <style>{styleText}</style>
      {props.children}
    </div>
  );
};
