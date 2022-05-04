export interface DragHandler {
  move(event: MouseEvent | DragEvent): void;
  end(event: MouseEvent | DragEvent): void;
}
