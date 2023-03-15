import { compact } from "lodash-es";
import { Selectable } from "../../../models/Selectable";
import { scrollState } from "../../../state/ScrollState";
import { selectableForDOM } from "../renderer/NodeRenderer";

export class NodePicker {
  document: Document | undefined;

  instancesFromPoint(clientX: number, clientY: number): Selectable[] {
    if (!this.document) {
      return [];
    }

    const doms = this.document.elementsFromPoint(
      clientX - scrollState.viewportDOMClientRect.left,
      clientY - scrollState.viewportDOMClientRect.top
    );

    return [
      ...compact(doms.map((dom) => selectableForDOM.get(dom as HTMLElement))),
    ];
  }

  // pick(
  //   event: MouseEvent | DragEvent,
  //   mode: "click" | "doubleClick" = "click",
  //   clientPos = new Vec2(event.clientX, event.clientY)
  // ): NodePickResult {
  //   return new NodePickResult(
  //     this.instancesFromPoint(clientPos.x, clientPos.y),
  //     clientPos,
  //     scrollState.documentPosForClientPos(clientPos),
  //     event,
  //     mode
  //   );
  // }
}

export const nodePicker = new NodePicker();
