import { Vec2 } from "paintvec";
import { Selectable } from "../models/Selectable";

export interface DropDestination {
  parent: Selectable;
  ref?: Selectable;
  insertionLine?: [Vec2, Vec2];
}
