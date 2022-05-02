import { IconifyIcon } from "@iconify/types";
import { DimensionInput } from "@seanchas116/paintkit/src/components/DimensionInput";
import { kebabCase } from "lodash-es";
import { observer } from "mobx-react-lite";
import React from "react";
import { StylePropertyState } from "../../../../state/StyleInspectorState";

export const StyleDimensionInput: React.FC<{
  property: StylePropertyState;
  label?: string;
  icon?: IconifyIcon;
  units?: readonly string[];
  keywords?: readonly string[];
}> = observer(({ property, ...props }) => {
  return (
    <DimensionInput
      {...props}
      title={kebabCase(property.key)}
      placeholder={property.computed}
      value={property.value}
      onChange={property.onChange}
    />
  );
});
