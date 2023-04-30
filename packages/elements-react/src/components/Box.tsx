import { ReactNode, useId } from "react";
import {
  StyleProps,
  defaultStyle,
  SelfAndChildrenCSS,
  buildNodeCSS,
} from "../style";

function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export const Box: React.FC<
  Partial<StyleProps> & {
    children?: ReactNode;
  }
> = (props) => {
  const styles = buildNodeCSS("frame", {
    ...defaultStyle,
    ...props,
  });

  const id = useId().replaceAll(":", "_");
  const className = `box-${id}`;

  return (
    <div className={className}>
      <Style targetClassName={className} styles={styles} />
      {props.children}
    </div>
  );
};

export const Text: React.FC<
  Partial<StyleProps> & {
    children?: ReactNode;
  }
> = (props) => {
  const styles = buildNodeCSS("text", {
    ...defaultStyle,
    ...props,
  });

  const id = useId().replaceAll(":", "_");
  const className = `box-${id}`;

  return (
    <div className={className}>
      <Style targetClassName={className} styles={styles} />
      {props.textContent}
    </div>
  );
};

const Style: React.FC<{
  targetClassName: string;
  styles: SelfAndChildrenCSS;
}> = ({ styles, targetClassName }) => {
  const cssBody = Object.entries(styles.self)
    .map(([key, value]) => {
      return `${kebabCase(key)}: ${String(value)};`;
    })
    .join(";");
  const childrenCSSBody = Object.entries(styles.children)
    .map(([key, value]) => {
      return `${kebabCase(key)}: ${String(value)};`;
    })
    .join(";");

  const styleText = `.${targetClassName}{${cssBody}} .${targetClassName}>*{${childrenCSSBody}}`;

  return <style>{styleText}</style>;
};
