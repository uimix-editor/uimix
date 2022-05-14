import {
  checkPattern,
  textTruncate,
} from "@seanchas116/paintkit/src/components/Common";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import styled from "styled-components";

export const AssetGrid = styled.div`
  margin: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  gap: 12px;
`;

export const AssetGridItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AssetGridItemTitle = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${colors.text};
  ${textTruncate}
`;

export const AssetGridItemThumbnail = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  ${checkPattern("white", "rgba(0,0,0,0.1)", "16px")}
`;
