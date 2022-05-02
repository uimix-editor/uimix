import { IconifyIcon } from "@iconify/types";
import { ComboBox } from "@seanchas116/paintkit/src/components/ComboBox";
import { DimensionInput } from "@seanchas116/paintkit/src/components/DimensionInput";
import { Input } from "@seanchas116/paintkit/src/components/Input";
import { SelectItem } from "@seanchas116/paintkit/src/components/Select";
import { kebabCase } from "lodash-es";
import { observer } from "mobx-react-lite";
import React from "react";
import { StylePropertyState } from "../../../../state/StyleInspectorState";
import { CSSColorInput } from "../CSSColorInput";

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

export const StyleInput: React.FC<{
  property: StylePropertyState;
  label?: string;
  icon?: IconifyIcon;
}> = observer(({ property, ...props }) => {
  return (
    <Input
      {...props}
      title={kebabCase(property.key)}
      placeholder={property.computed}
      value={property.value}
      onChange={property.onChange}
    />
  );
});

export const StyleComboBox: React.FC<{
  property: StylePropertyState;
  label?: string;
  icon?: IconifyIcon;
  options?: SelectItem[];
}> = observer(({ property, ...props }) => {
  return (
    <ComboBox
      {...props}
      title={kebabCase(property.key)}
      placeholder={property.computed}
      value={property.value}
      onChange={property.onChange}
    />
  );
});

export const StyleColorInput: React.FC<{
  property: StylePropertyState;
}> = observer(({ property }) => {
  return (
    <CSSColorInput
      title={kebabCase(property.key)}
      value={property.value}
      placeholder={property.computed}
      onChange={property.onChangeWithoutCommit}
      onChangeEnd={property.onChange}
    />
  );
});
