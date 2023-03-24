import { Selectable } from "../models/Selectable";

export interface DropDestination {
  parent: Selectable;
  ref?: Selectable;
  shouldShowInsertionLine: boolean;
}
