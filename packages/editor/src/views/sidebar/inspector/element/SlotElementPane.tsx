import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  Row12,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { Label } from "@seanchas116/paintkit/src/components/Label";
import { Input } from "@seanchas116/paintkit/src/components/Input";
import { useEditorState } from "../../../EditorStateContext";

export const SlotElementPane: React.FC = observer(function SlotElementPane() {
  const editorState = useEditorState();
  const state = editorState.elementInspectorState;

  const elements = state.slot.elements;
  if (elements.length === 0) {
    return null;
  }

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Slot</PaneHeading>
      </PaneHeadingRow>
      <Row12>
        <Label>ID</Label>
        <Input value={state.slot.name} onChange={state.slot.onNameChange} />
      </Row12>
    </Pane>
  );
});
