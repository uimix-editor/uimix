import { Rect, Vec2 } from "paintvec";
import { Selectable } from "../../../models/Selectable";
import { projectState } from "../../../state/ProjectState";
import { InsertMode } from "../../../state/InsertMode";
import { scrollState } from "../../../state/ScrollState";
import { snapper } from "../../../state/Snapper";
import { viewportState } from "../../../state/ViewportState";
import { Color } from "../../../utils/Color";
import { dragStartThreshold } from "../constants";
import { NodePickResult } from "../renderer/NodePicker";
import { DragHandler } from "./DragHandler";
import { resizeWithBoundingBox } from "../../../services/Resize";
import { assertNonNull } from "../../../utils/Assert";

export class NodeInsertDragHandler implements DragHandler {
  constructor(mode: InsertMode, pickResult: NodePickResult) {
    this.mode = mode;

    this.initClientPos = new Vec2(
      pickResult.event.clientX,
      pickResult.event.clientY
    );
    this.initPos = snapper.snapInsertPoint(
      scrollState.documentPosForEvent(pickResult.event)
    );

    if (!projectState.page) {
      const page = projectState.project.nodes.create("page");
      page.name = "Page 1";
      projectState.project.node.append([page]);
      projectState.pageID = page.id;
    }

    const parent =
      pickResult.default ?? assertNonNull(projectState.page).selectable;

    if (mode.type === "text") {
      const selectable = parent.append("text");
      selectable.originalNode.name = "Text";
      this.selectable = selectable;
      this.selectable.style.textContent = "Type Something";
      this.selectable.style.fill = Color.from("black").toHex();
      this.selectable.style.width = { type: "hugContents" };
      this.selectable.style.height = { type: "hugContents" };
    } else if (mode.type === "image") {
      // TODO: support image
      const selectable = parent.append("image");
      selectable.originalNode.name = "Image";
      this.selectable = selectable;
      this.selectable.style.fill = Color.from("white").toHex();
      this.selectable.style.width = { type: "fixed", value: 100 };
      this.selectable.style.height = { type: "fixed", value: 100 };
      this.selectable.style.imageHash = mode.hash;
    } else {
      const selectable = parent.append("frame");
      selectable.originalNode.name = "Frame";
      this.selectable = selectable;
      this.selectable.style.fill = Color.from("white").toHex();
      this.selectable.style.width = { type: "fixed", value: 100 };
      this.selectable.style.height = { type: "fixed", value: 100 };
    }

    resizeWithBoundingBox(
      this.selectable,
      Rect.boundingRect([this.initPos, this.initPos]),
      { x: true, y: true }
    );

    projectState.page?.selectable.deselect();
    this.selectable.select();
  }

  move(event: MouseEvent | DragEvent): void {
    const clientPos = new Vec2(event.clientX, event.clientY);
    if (
      !this.dragStarted &&
      clientPos.sub(this.initClientPos).length < dragStartThreshold
    ) {
      return;
    }
    this.dragStarted = true;

    const pos = snapper.snapResizePoint(scrollState.documentPosForEvent(event));
    const rect = Rect.boundingRect([pos, this.initPos]);

    resizeWithBoundingBox(this.selectable, rect, {
      x: true,
      y: true,
      width: true,
      height: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  end(event: MouseEvent | DragEvent): void {
    viewportState.tool = undefined;
    projectState.undoManager.stopCapturing();
  }

  private readonly mode: InsertMode;
  private readonly selectable: Selectable;
  private readonly initPos: Vec2;
  private readonly initClientPos: Vec2;
  private dragStarted = false;
}
