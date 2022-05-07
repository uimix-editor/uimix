import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { useEditorState } from "../../EditorStateContext";

const AssetTabItem = styled.div`
  color: ${(p) => (p["aria-selected"] ? colors.text : colors.disabledText)};
  font-size: 12px;
  font-weight: 600;
  line-height: 12px;
  padding: 12px 6px;
`;

const AssetTab = styled.div`
  display: flex;
  padding: 0 10px;
`;

const AssetBrowserWrap = styled.div`
  display: flex;
  flex-direction: column;

  > :last-child {
    flex: 1;
  }
`;

export const AssetBrowser: React.VFC<React.HTMLAttributes<HTMLDivElement>> =
  observer(function AssetBrowser({ ...props }) {
    const editorState = useEditorState();

    return (
      <AssetBrowserWrap {...props}>
        <AssetTab>
          <AssetTabItem
            aria-selected={editorState.assetTab === "components"}
            onClick={action(() => {
              editorState.assetTab = "components";
            })}
          >
            Components
          </AssetTabItem>
          <AssetTabItem
            aria-selected={editorState.assetTab === "images"}
            onClick={action(() => {
              editorState.assetTab = "images";
            })}
          >
            Images
          </AssetTabItem>
          <AssetTabItem
            aria-selected={editorState.assetTab === "icons"}
            onClick={action(() => {
              editorState.assetTab = "icons";
            })}
          >
            Icons
          </AssetTabItem>
        </AssetTab>
        {editorState.assetTab === "components" ? (
          <div />
        ) : editorState.assetTab === "images" ? (
          <div />
        ) : editorState.assetTab === "icons" ? (
          <div />
        ) : undefined}
      </AssetBrowserWrap>
    );
  });
