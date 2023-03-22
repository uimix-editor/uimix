import { Rect, Vec2 } from "paintvec";
import { Selectable } from "../../../models/Selectable";
import { projectState } from "../../../state/ProjectState";
import { InsertMode } from "../../../state/InsertMode";
import { snapper } from "../../../state/Snapper";
import { viewportState } from "../../../state/ViewportState";
import { Color } from "../../../utils/Color";
import { dragStartThreshold } from "../constants";
import { ViewportEvent } from "./ViewportEvent";
import { DragHandler } from "./DragHandler";
import { resizeWithBoundingBox } from "../../../services/Resize";
import { action } from "mobx";
import { assertNonNull } from "../../../utils/Assert";

export class NodeInsertDragHandler implements DragHandler {
  constructor(mode: InsertMode, event: ViewportEvent) {
    this.mode = mode;

    const parent =
      event.selectable ?? assertNonNull(projectState.page).selectable;

    this.initClientPos = new Vec2(event.event.clientX, event.event.clientY);
    this.initPos = snapper.snapInsertPoint(parent, event.pos);

    if (!projectState.page) {
      const page = projectState.project.nodes.create("page");
      page.name = "Page 1";
      projectState.project.node.append([page]);
      projectState.pageID = page.id;
    }

    if (mode.type === "text") {
      const selectable = parent.append("text");
      selectable.originalNode.name = "Text";
      this.selectable = selectable;
      this.selectable.style.textContent = "Type Something";
      this.selectable.style.fills = [
        { type: "solid", hex: Color.from("black").toHex() },
      ];
      this.selectable.style.width = { type: "hugContents" };
      this.selectable.style.height = { type: "hugContents" };
    } else if (mode.type === "image") {
      // TODO: support image
      const selectable = parent.append("image");
      selectable.originalNode.name = "Image";
      this.selectable = selectable;
      this.selectable.style.fills = [
        { type: "solid", hex: Color.from("white").toHex() },
      ];
      this.selectable.style.width = { type: "fixed", value: 100 };
      this.selectable.style.height = { type: "fixed", value: 100 };
      void projectState.project.imageManager.insert(mode.blob).then(
        action((hash) => {
          console.log(hash);
          this.selectable.style.imageHash = hash;
        })
      );
    } else {
      const selectable = parent.append("frame");
      selectable.originalNode.name = "Frame";
      this.selectable = selectable;
      this.selectable.style.fills = [
        { type: "solid", hex: Color.from("white").toHex() },
      ];
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

  move(event: ViewportEvent): void {
    if (
      !this.dragStarted &&
      event.clientPos.sub(this.initClientPos).length < dragStartThreshold
    ) {
      return;
    }
    this.dragStarted = true;

    const pos = snapper.snapResizePoint([this.selectable], event.pos);
    const rect = Rect.boundingRect([pos, this.initPos]);

    resizeWithBoundingBox(this.selectable, rect, {
      x: true,
      y: true,
      width: true,
      height: true,
    });
  }

  end(): void {
    viewportState.tool = undefined;
    projectState.undoManager.stopCapturing();
  }

  private readonly mode: InsertMode;
  private readonly selectable: Selectable;
  private readonly initPos: Vec2;
  private readonly initClientPos: Vec2;
  private dragStarted = false;
}
