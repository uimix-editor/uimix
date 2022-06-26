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
import blockIcon from "@iconify-icons/ic/outline-block";
import cursorPointerIcon from "@iconify-icons/mdi/cursor-pointer";
import cursorDefaultIcon from "@iconify-icons/mdi/cursor-default";
import cursorTextIcon from "@iconify-icons/mdi/cursor-text";
import { Icon } from "@iconify/react/dist/offline";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { StyleComboBox, StyleInput } from "./Components";

const cursorOptions = [
  { value: "auto" },
  { value: "default", icon: <Icon icon={cursorDefaultIcon} /> },
  { value: "pointer", icon: <Icon icon={cursorPointerIcon} /> },
  { value: "text", icon: <Icon icon={cursorTextIcon} /> },
  { value: "not-allowed", icon: <Icon icon={blockIcon} /> },
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
