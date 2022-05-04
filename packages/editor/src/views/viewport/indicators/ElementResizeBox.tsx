import { action, computed, makeObservable } from "mobx";
import React, { useMemo } from "react";
import { Vec2, Rect } from "paintvec";
import { observer } from "mobx-react-lite";
import { ResizeBox } from "@seanchas116/paintkit/src/components/ResizeBox";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { EditorState } from "../../../state/EditorState";
import { ElementInstance } from "../../../models/ElementInstance";
import { useEditorState } from "../../EditorStateContext";

class ElementResizeBoxState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  private originalRect: Rect = new Rect();

  get selectedInstances(): ElementInstance[] {
    return this.editorState.document.selectedElementInstances;
  }

  @computed get stroke(): string {
    return colors.active;
  }

  @computed get boundingBox(): Rect | undefined {
    return Rect.union(...this.selectedInstances.map((i) => i.boundingBox));
  }

  @computed get viewportBoundingBox(): Rect | undefined {
    return this.boundingBox?.transform(
      this.editorState.scroll.documentToViewport
    );
  }

  begin() {
    // TODO
  }

  change(p0: Vec2, p1: Vec2) {
    // TODO
  }

  end() {
    // TODO
  }
}

export const ElementResizeBox: React.FC = observer(function LayerResizeBox() {
  const editorState = useEditorState();

  const state = useMemo(
    () => new ElementResizeBoxState(editorState),
    [editorState]
  );
  const boundingBox = state.viewportBoundingBox;
  if (!boundingBox) {
    return null;
  }

  return (
    <ResizeBox
      p0={boundingBox.topLeft}
      p1={boundingBox.bottomRight}
      snap={(p: Vec2) => p}
      // snap={action((p: Vec2) => {
      //   // TODO: avoid transform
      //   let pos = p.transform(editorState.scroll.viewportToDocument).round;
      //   pos = editorState.snapper.snapResizePoint(pos);
      //   return pos.transform(editorState.scroll.documentToViewport);
      // })}
      onChangeBegin={action(state.begin.bind(state))}
      onChange={action(state.change.bind(state))}
      onChangeEnd={action(state.end.bind(state))}
      stroke={state.stroke}
    />
  );
});
