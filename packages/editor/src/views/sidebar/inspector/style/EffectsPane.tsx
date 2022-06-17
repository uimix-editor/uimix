import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  Row12,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import opacityIcon from "@iconify-icons/ic/outline-opacity";
import mouseIcon from "@iconify-icons/ic/outline-mouse";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { StyleComboBox, StyleInput } from "./Components";

const cursorOptions = [
  { value: "auto" },
  { value: "default" },
  { value: "pointer" },
  { value: "text" },
  { value: "not-allowed" },
];

export const EffectsPane: React.FC<{
  state: StyleInspectorState;
}> = observer(function EffectsPane({ state }) {
  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Effects</PaneHeading>
      </PaneHeadingRow>

      <RowGroup>
        <Row12>
          <StyleInput icon={opacityIcon} property={state.props.opacity} />
          <StyleComboBox
            icon={mouseIcon}
            options={cursorOptions}
            property={state.props.cursor}
          />
        </Row12>
      </RowGroup>
    </Pane>
  );
});
