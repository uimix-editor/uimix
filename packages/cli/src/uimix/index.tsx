import React from "react";
import "./index.css";

function applyOverrides(
  rootProps: any,
  element: React.ReactElement
): React.ReactElement {
  const { "data-refID": refID, ...props } = element.props;

  let additionalProps: any = rootProps;
  for (const id of refID ?? []) {
    additionalProps = additionalProps[id + "Props"] ?? {};
  }
  additionalProps = { ...additionalProps };
  for (const key of Object.keys(additionalProps)) {
    if (key.endsWith("Props")) {
      delete additionalProps[key];
    }
  }

  const result = React.cloneElement(
    { ...element, props },
    {
      ...additionalProps,
      className: additionalProps.className
        ? props.className + " " + additionalProps.className
        : props.className,
      children:
        additionalProps.children ??
        React.Children.map(element.props.children, (child) => {
          if (React.isValidElement(child)) {
            return applyOverrides(rootProps, child);
          } else {
            return child;
          }
        }),
    }
  );
  return result;
}
