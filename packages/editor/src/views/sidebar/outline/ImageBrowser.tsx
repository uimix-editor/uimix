import path from "path";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import styled from "styled-components";
import Tippy from "@tippyjs/react";
import {
  checkPattern,
  textTruncate,
} from "@seanchas116/paintkit/dist/components/Common";
import { colors } from "@seanchas116/paintkit/dist/components/Palette";
import { Scrollable } from "@seanchas116/paintkit/dist/components/Scrollable";
import { useEditorState } from "../../EditorStateContext";
import { SearchBar } from "./SearchBar";

const Item: React.FC<{
  filePath: string;
}> = observer(function Item({ filePath }) {
  const editorState = useEditorState();
  // const name = path.basename(filePath).slice(0, -path.extname(filePath).length);

  return (
    <Tippy content={filePath}>
      <ItemWrap>
        <Thumbnail
          loading="lazy"
          src={editorState.resolveImageAssetURL(filePath)}
          draggable
          onDragStart={(e) => {
            // TODO
            // const data: ImageURLMimeData = {
            //   name: lowerFirst(toIdentifier(name)),
            //   url: filePath,
            // };
            // e.dataTransfer.effectAllowed = "copy";
            // e.dataTransfer.setData(imageURLMimeType, JSON.stringify(data));
          }}
        />
        <ItemTitle>{path.basename(filePath)}</ItemTitle>
      </ItemWrap>
    </Tippy>
  );
});

export const ImageBrowser: React.FC = observer(function IconBrowser() {
  const editorState = useEditorState();

  const [search, setSearch] = useState("");
  const imageFiles = editorState.imageAssets.filter((filePath) =>
    filePath.includes(search)
  );
  const normalImageFiles = imageFiles.filter(
    (filePath) => !filePath.endsWith(".svg")
  );
  const svgImageFiles = imageFiles.filter((filePath) =>
    filePath.endsWith(".svg")
  );

  return (
    <ImageBrowserWrap>
      <SearchBar value={search} onChange={setSearch} />
      {imageFiles.length === 0 ? (
        <NoImageLabel>No image files in the workspace</NoImageLabel>
      ) : (
        <StyledScrollable>
          <Heading>Images</Heading>
          <Items>
            {normalImageFiles.map((filePath) => (
              <Item filePath={filePath} />
            ))}
          </Items>
          <Heading>SVGs</Heading>
          <Items>
            {svgImageFiles.map((filePath) => (
              <Item filePath={filePath} />
            ))}
          </Items>
        </StyledScrollable>
      )}
    </ImageBrowserWrap>
  );
});

const Items = styled.div`
  margin: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  gap: 12px;
`;

const ItemWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemTitle = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${colors.text};
  ${textTruncate}
`;

const Thumbnail = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  ${checkPattern("white", "rgba(0,0,0,0.1)", "16px")}
`;

const StyledScrollable = styled(Scrollable)``;

const NoImageLabel = styled.div`
  color: ${colors.disabledText};
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageBrowserWrap = styled.div`
  display: flex;
  flex-direction: column;

  ${StyledScrollable}, ${NoImageLabel} {
    flex: 1;
  }
`;

const Heading = styled.div`
  margin: 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 12px;
  color: ${colors.disabledText};
`;
