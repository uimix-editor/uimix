import { Scrollable } from "@seanchas116/paintkit/src/components/Scrollable";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import styled from "styled-components";
import { Component } from "../../../models/Component";
import { useEditorState } from "../../EditorStateContext";
import {
  AssetGrid,
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
    const externalComponents = [
      ...editorState.document.loadedCustomElements,
    ].filter((tagName) => tagName.includes(search));

    return (
      <ComponentBrowserWrap>
        <SearchBar value={search} onChange={setSearch} />
        <StyledScrollable>
          <AssetGrid>
            {components.map((component) => (
              <Item component={component} key={component.key} />
            ))}
          </AssetGrid>
          <AssetGrid>
            {externalComponents.map((tagName) => (
              <TagNameItem tagName={tagName} key={tagName} />
            ))}
          </AssetGrid>
        </StyledScrollable>
      </ComponentBrowserWrap>
    );
  });

const Item: React.FC<{
  component: Component;
}> = observer(function Item({ component }) {
  return (
    <AssetGridItem>
      <AssetGridItemThumbnail
        src={component.thumbnail}
        loading="lazy"
        draggable
        onDragStart={(e) => {
          const tagName = component.name;
          e.dataTransfer.effectAllowed = "copy";
          e.dataTransfer.setData("text/html", `<${tagName}></${tagName}>`);
        }}
      />
      <AssetGridItemTitle>{component.name}</AssetGridItemTitle>
    </AssetGridItem>
  );
});

const TagNameItem: React.FC<{
  tagName: string;
}> = observer(function Item({ tagName }) {
  return (
    <AssetGridItem>
      <AssetGridItemThumbnail
        src=""
        loading="lazy"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "copy";
          e.dataTransfer.setData(
            "text/html",
            `<${tagName}>Content</${tagName}>`
          );
        }}
      />
      <AssetGridItemTitle>{tagName}</AssetGridItemTitle>
    </AssetGridItem>
  );
});
