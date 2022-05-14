import {
  checkPattern,
  textTruncate,
} from "@seanchas116/paintkit/src/components/Common";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { Scrollable } from "@seanchas116/paintkit/src/components/Scrollable";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import styled from "styled-components";
import { Component } from "../../../models/Component";
import { useEditorState } from "../../EditorStateContext";
import { SearchBar } from "./SearchBar";

const StyledScrollable = styled(Scrollable)``;

const ComponentBrowserWrap = styled.div`
  display: flex;
  flex-direction: column;

  ${StyledScrollable} {
    flex: 1;
  }
`;

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

export const ComponentBrowser: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ ...props }) => {
  const [search, setSearch] = useState("");

  const editorState = useEditorState();

  const components = editorState.document.components.children.filter(
    (component) => component.name.includes(search)
  );

  return (
    <ComponentBrowserWrap>
      <SearchBar value={search} onChange={setSearch} />
      <StyledScrollable>
        <Items>
          {components.map((component) => (
            <Item component={component} />
          ))}
        </Items>
      </StyledScrollable>
    </ComponentBrowserWrap>
  );
};

const Thumbnail = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  ${checkPattern("white", "rgba(0,0,0,0.1)", "16px")}
`;

const Item: React.FC<{
  component: Component;
}> = observer(function Item({ component }) {
  return (
    <ItemWrap>
      <Thumbnail
        loading="lazy"
        draggable
        onDragStart={(e) => {
          //e.dataTransfer.effectAllowed = "copy";
          //e.dataTransfer.setData(imageAssetDragMime, filePath);
        }}
      />
      <ItemTitle>{component.name}</ItemTitle>
    </ItemWrap>
  );
});
