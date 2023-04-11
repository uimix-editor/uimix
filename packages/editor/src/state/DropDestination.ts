import { Segment } from "paintvec";
import { Selectable } from "@uimix/model/src/models";

export interface DropDestination {
  parent: Selectable;
  ref?: Selectable;
  insertionLine?: Segment;
}
