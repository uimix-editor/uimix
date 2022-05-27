import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  Row12,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { ComboBox } from "@seanchas116/paintkit/src/components/ComboBox";
import { Label } from "@seanchas116/paintkit/src/components/Label";
import { Input } from "@seanchas116/paintkit/src/components/Input";
import { SelectOption } from "@seanchas116/paintkit/src/components/Select";
import { isValidCSSIdentifier } from "@seanchas116/paintkit/src/util/Name";
import { useEditorState } from "../../../EditorStateContext";

const tagNameOptions: SelectOption[] = ["div", "h1"].map((value) => ({
  value,
}));

export const ElementCommonPane: React.FC = observer(
  function ElementCommonPane() {
    const state = useEditorState().elementInspectorState;

    const slotCandidates = state.slotTargetCandidates;

    return (
      <Pane>
        <ComboBox
          value={state.tagName}
          options={tagNameOptions}
          onChange={state.onChangeTagName}
        />
        <RowGroup>
          {state.isStyleableElementSelected && (
            <Row12>
              <Label>ID</Label>
              <Input
                value={state.id}
                onChange={state.onChangeID}
                validate={(name) => {
                  if (name && !isValidCSSIdentifier(name)) {
                    return {
                      isValid: false,
                      message: "Name must be a valid CSS identifier",
                    };
                  }
                  return { isValid: true };
                }}
              />
            </Row12>
          )}
          {slotCandidates.length > 0 && (
            <Row12>
              <Label>Slot</Label>
              <ComboBox
                options={slotCandidates.map((slot) => ({
                  value: slot,
                  text: slot || "(Main Slot)",
                }))}
                value={state.slotTarget}
                onChange={state.onChangeSlotTarget}
              />
            </Row12>
          )}
        </RowGroup>
      </Pane>
    );
  }
);
