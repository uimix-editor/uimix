import { ElementInstance } from "../models/ElementInstance";
import { TextInstance } from "../models/TextInstance";

export interface DropDestination {
  parent: ElementInstance;
  ref?: ElementInstance | TextInstance;
}
