import { ViewportEvent } from "./ViewportEvent";

export interface DragHandler {
  move(event: ViewportEvent): void;
  end(event: ViewportEvent): void;
}
