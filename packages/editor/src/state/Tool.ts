import { InsertMode } from "./InsertMode";

export type Tool =
  | {
      type: "insert";
      mode: InsertMode;
    }
  | {
      type: "instancePalette";
    };
