import path from "path";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import styled from "styled-components";
import Tippy from "@tippyjs/react";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { Scrollable } from "@seanchas116/paintkit/src/components/Scrollable";
import { useEditorState } from "../../useEditorState";
import { SearchBar } from "./SearchBar";
import {
  AssetGrid,
  AssetGridHeading,
  AssetGridItem,
  AssetGridItemThumbnail,
  AssetGridItemTitle,
} from "./AssetGrid";

export const imageAssetDragMime = "application/x-macaron-image-asset";

const Item: React.FC<{
  filePath: string;
}> = observer(function Item({ filePath }) {
  const editorState = useEditorState();
  // const name = path.basename(filePath).slice(0, -path.extname(filePath).length);

  return (
    <Tippy content={filePath}>
      <AssetGridItem>
        <AssetGridItemThumbnail
          loading="lazy"
          src={editorState.resolveImageAssetURL(filePath)}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "copy";
            e.dataTransfer.setData(imageAssetDragMime, filePath);
          }}
        />
        <AssetGridItemTitle>{path.basename(filePath)}</AssetGridItemTitle>
      </AssetGridItem>
    </Tippy>
  );
});

export const ImageBrowser: React.FC = observer(function ImageBrowser() {
  const editorState = useEditorState();

  const [search, setSearch] = useState("");
  const imageFiles = editorState.imageAssets.filter((filePath) =>
    filePath.includes(search)
  );

  const imageFilesForDirectory = new Map<string, string[]>();
  for (const filePath of imageFiles) {
    const dir = path.dirname(filePath);

    let files = imageFilesForDirectory.get(dir);
    if (!files) {
      files = [];
      imageFilesForDirectory.set(dir, files);
    }

    files.push(filePath);
  }

  return (
    <ImageBrowserWrap>
      <SearchBar value={search} onChange={setSearch} />
      {imageFiles.length === 0 ? (
        <NoImageLabel>No image files in the workspace</NoImageLabel>
      ) : (
        <StyledScrollable>
          {[...imageFilesForDirectory].map(([dirName, filePaths]) => (
            <>
              <AssetGridHeading>{dirName}</AssetGridHeading>
              <AssetGrid>
                {filePaths.map((filePath) => (
                  <Item filePath={filePath} />
                ))}
              </AssetGrid>
            </>
          ))}
        </StyledScrollable>
      )}
    </ImageBrowserWrap>
  );
});

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
