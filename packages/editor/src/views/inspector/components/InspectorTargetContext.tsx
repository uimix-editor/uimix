import React from "react";
import { Selectable } from "@uimix/model/src/models";

export const InspectorTargetContext = React.createContext<
  readonly Selectable[]
>([]);
