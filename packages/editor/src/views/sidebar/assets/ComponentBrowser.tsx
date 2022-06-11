import React from "react";
import { Scrollable } from "@seanchas116/paintkit/src/components/Scrollable";
import { toHtml } from "hast-util-to-html";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import styled from "styled-components";
import { CustomElementMetadata } from "../../../models/CustomElementMetadata";
import { useEditorState } from "../../useEditorState";
import {
  AssetGrid,
  AssetGridHeading,
  AssetGridItem,
  AssetGridItemThumbnail,
  AssetGridItemTitle,
} from "./AssetGrid";
import { SearchBar } from "./SearchBar";

const StyledScrollable = styled(Scrollable)``;

const ComponentBrowserWrap = styled.div`
  display: flex;
  flex-direction: column;

  ${StyledScrollable} {
    flex: 1;
  }
`;

export const ComponentBrowser: React.FC<React.HTMLAttributes<HTMLDivElement>> =
  observer(function ComponentBrowser({ ...props }) {
    const [search, setSearch] = useState("");

    const editorState = useEditorState();

    const components = editorState.document.components.children.filter(
      (component) => component.name.includes(search)
    );
    const customElements = [
      ...editorState.document.externalCustomElementMetadataList,
    ].filter((c) => c.tagName.includes(search));

    return (
      <ComponentBrowserWrap>
        <SearchBar value={search} onChange={setSearch} />
        <StyledScrollable>
          <AssetGridHeading>This File</AssetGridHeading>
          <AssetGrid>
            {components.map((component) => (
              <Item metadata={component.metadata} key={component.key} />
            ))}
          </AssetGrid>
          <AssetGridHeading>External</AssetGridHeading>
          <AssetGrid>
            {customElements.map((customElement) => (
              <Item metadata={customElement} key={customElement.tagName} />
            ))}
          </AssetGrid>
        </StyledScrollable>
      </ComponentBrowserWrap>
    );
  });

const Item: React.FC<{
  metadata: CustomElementMetadata;
}> = observer(function Item({ metadata }) {
  return (
    <AssetGridItem>
      <AssetGridItemThumbnail
        src={metadata.thumbnail}
        loading="lazy"
        draggable
        onDragStart={(e) => {
          const tagName = metadata.tagName;
          const defaultContent = toHtml(
            CustomElementMetadata.defaultContent(metadata)
          );
          e.dataTransfer.effectAllowed = "copy";
          e.dataTransfer.setData(
            "text/html",
            `<${tagName}>${defaultContent}</${tagName}>`
          );
        }}
      />
      <AssetGridItemTitle>{metadata.tagName}</AssetGridItemTitle>
    </AssetGridItem>
  );
});
