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
import { SelectItem } from "@seanchas116/paintkit/src/components/Select";
import { isValidCSSIdentifier } from "@seanchas116/paintkit/src/util/Name";
import { useEditorState } from "../../../useEditorState";

const tagNameOptions: SelectItem[] = [
  { type: "header", text: "Content" },
  { value: "div", text: "div - Content Division" },
  { value: "p", text: "p - Paragraph" },
  { value: "blockquote", text: "blockquote - Blockquote" },
  { value: "pre", text: "pre - Preformatted Text" },
  { type: "header", text: "Heading" },
  { value: "h1", text: "h1 - Heading 1" },
  { value: "h2", text: "h2 - Heading 2" },
  { value: "h3", text: "h3 - Heading 3" },
  { value: "h4", text: "h4 - Heading 4" },
  { value: "h5", text: "h5 - Heading 5" },
  { value: "h6", text: "h6 - Heading 6" },
  { type: "header", text: "Input & Button" },
  { value: "input", text: "input - Input" },
  { value: "textarea", text: "textarea - Text Area" },
  { value: "select", text: "select - Select" },
  { value: "button", text: "button - Button" },
  { value: "a", text: "a - Link" },
  { type: "header", text: "Sectioning" },
  { value: "address", text: "address - Address" },
  { value: "article", text: "article - Article" },
  { value: "aside", text: "aside - Aside" },
  { value: "footer", text: "footer - Footer" },
  { value: "header", text: "header - Header" },
  { value: "main", text: "main - Main Content" },
  { value: "nav", text: "nav - Navigation Section" },
  { value: "section", text: "section - Generic Section" },
  { type: "header", text: "List" },
  { value: "li", text: "li - List Item" },
  { value: "ol", text: "ol - Ordered List" },
  { value: "ul", text: "ul - Unordered List" },
  { value: "dl", text: "dl - Description List" },
  { value: "dt", text: "dt - Description Term" },
  { value: "dd", text: "dd - Description Details" },
  { type: "header", text: "Form" },
  { value: "form", text: "form - Form" },
  { value: "label", text: "label - Label" },
  { value: "fieldset", text: "fieldset - Field Set" },
  { value: "legend", text: "legend - Field Set Legend" },
];

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
