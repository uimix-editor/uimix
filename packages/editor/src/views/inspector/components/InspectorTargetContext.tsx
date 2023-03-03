import React from "react";
import { Selectable } from "../../../models/Selectable";

export const InspectorTargetContext = React.createContext<
  readonly Selectable[]
>([]);
