import React from "react";
import "./button.css";
import { Infer, builders } from "../schema";

export const ButtonProps = builders.object({
  primary: builders.boolean({
    description: "Is this the principal call to action on the page?",
  }),
  backgroundColor: builders.string({
    description: "What background color to use",
  }),
  size: builders.enum(["small", "medium", "large"], {
    description: "How large should the button be?",
  }),
  label: builders.string({
    description: "Button contents",
  }),
});

export type ButtonProps = Infer<typeof ButtonProps> & {
  // /**
  //  * Is this the principal call to action on the page?
  //  */
  // primary?: boolean;
  // /**
  //  * What background color to use
  //  */
  // backgroundColor?: string;
  // /**
  //  * How large should the button be?
  //  */
  // size?: "small" | "medium" | "large";
  // /**
  //  * Button contents
  //  */
  // label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;

  className?: string;
};

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label = "Button",
  className,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";
  return (
    <button
      type="button"
      className={[
        "storybook-button",
        `storybook-button--${size}`,
        mode,
        className ?? "",
      ].join(" ")}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};
