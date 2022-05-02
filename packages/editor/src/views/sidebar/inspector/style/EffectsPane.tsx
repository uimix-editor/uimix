import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  Row111,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import opacityIcon from "@iconify-icons/ic/outline-opacity";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { StyleInput } from "./Util";

export const EffectsPane: React.FC<{
  state: StyleInspectorState;
}> = observer(function EffectsPane({ state }) {
  if (state.styles.length === 0) {
    return null;
  }

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Effects</PaneHeading>
      </PaneHeadingRow>

      <RowGroup>
        <Row111>
          <StyleInput icon={opacityIcon} property={state.props.opacity} />
        </Row111>
      </RowGroup>
    </Pane>
  );
});
