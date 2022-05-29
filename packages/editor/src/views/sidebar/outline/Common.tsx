import { colors } from "@seanchas116/paintkit/src/components/Palette";
import {
  TreeRow,
  TreeRowNameEdit,
} from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import { Color } from "@seanchas116/paintkit/src/util/Color";
import styled from "styled-components";

export const NameEdit = styled(TreeRowNameEdit)<{
  color?: string;
  rowSelected?: boolean;
}>`
  color: ${(p) => (p.rowSelected ? colors.text : p.color || colors.text)};
`;

export const StyledRow = styled(TreeRow)`
  position: relative;
`;

export const slotColor = "#79BFFF";

export const NODE_DRAG_MIME = "application/x.macaron-tree-drag-node";
export const COMPONENT_DRAG_MIME = "application/x.macaron-tree-drag-component";
export const VARIANT_DRAG_MIME = "application/x.macaron-tree-drag-variant";

export function colorWithOpacity(colorStr: string, opacity: number): string {
  const color = Color.from(colorStr) ?? Color.white;
  return color.withAlpha(color.a * opacity).toString();
}
