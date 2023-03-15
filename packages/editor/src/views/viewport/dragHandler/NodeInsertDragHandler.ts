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

    this.initClientPos = new Vec2(event.event.clientX, event.event.clientY);
    this.initPos = snapper.snapInsertPoint(event.pos);

    if (!projectState.page) {
      const page = projectState.project.nodes.create("page");
      page.name = "Page 1";
      projectState.project.node.append([page]);
      projectState.pageID = page.id;
    }

    const parent =
      event.selectable ?? assertNonNull(projectState.page).selectable;

    if (mode.type === "text") {
      const selectable = parent.append("text");
      selectable.originalNode.name = "Text";
      this.instance = selectable;
      this.instance.style.textContent = "Type Something";
      this.instance.style.fill = Color.from("black").toHex();
      this.instance.style.width = { type: "hugContents" };
      this.instance.style.height = { type: "hugContents" };
    } else if (mode.type === "image") {
      // TODO: support image
      const selectable = parent.append("image");
      selectable.originalNode.name = "Image";
      this.instance = selectable;
      this.instance.style.fill = Color.from("white").toHex();
      this.instance.style.width = { type: "fixed", value: 100 };
      this.instance.style.height = { type: "fixed", value: 100 };
      projectState.project.imageManager.insert(mode.blob).then(
        action((hash) => {
          console.log(hash);
          this.instance.style.imageHash = hash;
        })
      );
    } else {
      const selectable = parent.append("frame");
      selectable.originalNode.name = "Frame";
      this.instance = selectable;
      this.instance.style.fill = Color.from("white").toHex();
      this.instance.style.width = { type: "fixed", value: 100 };
      this.instance.style.height = { type: "fixed", value: 100 };
    }

    resizeWithBoundingBox(
      this.instance,
      Rect.boundingRect([this.initPos, this.initPos]),
      { x: true, y: true }
    );

    projectState.page?.selectable.deselect();
    this.instance.select();
  }

  move(event: ViewportEvent): void {
    if (
      !this.dragStarted &&
      event.clientPos.sub(this.initClientPos).length < dragStartThreshold
    ) {
      return;
    }
    this.dragStarted = true;

    const pos = snapper.snapResizePoint(event.pos);
    const rect = Rect.boundingRect([pos, this.initPos]);

    resizeWithBoundingBox(this.instance, rect, {
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
  private readonly instance: Selectable;
  private readonly initPos: Vec2;
  private readonly initClientPos: Vec2;
  private dragStarted = false;
}
