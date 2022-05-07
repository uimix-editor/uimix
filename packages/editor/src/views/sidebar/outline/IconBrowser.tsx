import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import materialIcons from "@iconify/json/json/ic.json";
import { IconifyJSON } from "@iconify/types";
import Tippy from "@tippyjs/react";
import { action, reaction } from "mobx";
import icon_height from "@iconify-icons/ic/outline-height";
import icon_rotate_right from "@iconify-icons/ic/outline-rotate-right";
import icon_flip from "@iconify-icons/ic/outline-flip";
import { Select } from "@seanchas116/paintkit/src/components/Select";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import {
  Pane,
  Row111,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { NumberInput } from "@seanchas116/paintkit/src/components/NumberInput";
import { Scrollable } from "@seanchas116/paintkit/src/components/Scrollable";
import { IconButton } from "@seanchas116/paintkit/src/components/IconButton";
import { useContextMenu } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { iconToSVGString } from "@seanchas116/paintkit/src/util/Image";
import { useEditorState } from "../../EditorStateContext";
import { IconItem, IconSet } from "./IconSet";
import { IconBrowserState } from "./IconBrowserState";
import { SearchBar } from "./SearchBar";

const IconThumbnailSVG = styled.svg`
  background: var(--icon-background);
  transform: var(--icon-transform);
`;

const IconThumbnailBody: React.VFC<{
  item: IconItem;
}> = ({ item }) => {
  const editorState = useEditorState();

  const getSVGText = () => {
    const { size, rotation, flipX } = editorState.iconBrowserState;
    return iconToSVGString({ ...item, rotate: rotation, hFlip: flipX }, size);
  };

  const contextMenu = useContextMenu();

  return (
    <Tippy content={item.id}>
      <div
        draggable
        onDragStart={(e) => {
          const svgText = getSVGText();
          e.dataTransfer.effectAllowed = "copy";
          e.dataTransfer.setData("text/html", svgText);
        }}
        onContextMenu={(e) => {
          e.preventDefault();

          contextMenu.show(e.clientX, e.clientY, [
            {
              text: "Copy SVG",
              onClick: action(() => {
                const svgText = getSVGText();
                const htmlBlob = new Blob([svgText], { type: "text/html" });
                const textBlob = new Blob([svgText], { type: "text/plain" });
                void navigator.clipboard.write([
                  new ClipboardItem({
                    [htmlBlob.type]: htmlBlob,
                    [textBlob.type]: textBlob,
                  }),
                ]);
                return true;
              }),
            },
          ]);
        }}
      >
        <IconThumbnailSVG
          width={24}
          height={24}
          dangerouslySetInnerHTML={{ __html: item.body }}
        />
      </div>
    </Tippy>
  );
};

const IconThumbnailWrap = styled.div`
  width: 24px;
  height: 24px;
  background: white;
  contain: strict;
  content-visibility: auto;
`;

const IconThumbnail: React.FC<{
  item: IconItem;
}> = function IconThumbnail({ item }) {
  const ref = React.createRef<HTMLDivElement>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) {
      return;
    }

    const root = elem.closest("[data-simplebar]");
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      },
      {
        root: root,
      }
    );
    intersectionObserver.observe(elem);

    return () => intersectionObserver.disconnect();
  }, []);

  return (
    <IconThumbnailWrap ref={ref}>
      {visible && <IconThumbnailBody item={item} />}
    </IconThumbnailWrap>
  );
};

const iconSet = new IconSet(materialIcons as IconifyJSON);

const IconPropertyEdit: React.VFC<{
  iconBrowserState: IconBrowserState;
}> = observer(function IconPropertyEdit({ iconBrowserState }) {
  return (
    <Pane
      style={{
        borderBottom: "none",
      }}
    >
      {/* <RowGroup>
        <FillInput
          value={iconBrowserState.color}
          onChange={action((color) => {
            if (color instanceof ColorFill) {
              iconBrowserState.color = color;
            }
          })}
          onChangeEnd={() => {}}
        />
      </RowGroup> */}
      <Row111>
        <NumberInput
          icon={icon_height}
          title="Size"
          value={iconBrowserState.size}
          placeholder="Size"
          onChange={action((value) => {
            if (value !== undefined) {
              iconBrowserState.size = value;
              return true;
            }
            return false;
          })}
        />
        <NumberInput
          icon={icon_rotate_right}
          title="Rotation"
          value={iconBrowserState.rotation}
          placeholder="Rotation"
          onChange={action((value) => {
            if (value !== undefined) {
              iconBrowserState.rotation = value;
              return true;
            }
            return false;
          })}
        />
        <Tippy content="Flip X">
          <IconButton
            pressed={iconBrowserState.flipX}
            icon={icon_flip}
            onClick={action(() => {
              iconBrowserState.flipX = !iconBrowserState.flipX;
            })}
          />
        </Tippy>
      </Row111>
    </Pane>
  );
});

export const IconBrowser: React.VFC<{
  className?: string;
}> = observer(function IconBrowser({ className }) {
  const editorState = useEditorState();

  const [search, setSearch] = useState("");

  const [currentThemeID, setCurrentThemeID] = useState(
    [...iconSet.prefixes][0][0]
  );

  const prefix = iconSet.prefixes.get(currentThemeID)?.id ?? "";

  const allIcons = [...iconSet.items.values()].filter((item) =>
    item.id.startsWith(prefix)
  );

  const icons = search
    ? allIcons
        .filter((item) =>
          item.id.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
        .sort((a, b) => a.id.length - b.id.length)
        .slice(0, 100)
    : allIcons;

  const thumbnailsRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    const thumbnails = thumbnailsRef.current;
    if (!thumbnails) {
      return;
    }

    return reaction(
      () =>
        [
          editorState.iconBrowserState.rotation,
          editorState.iconBrowserState.flipX,
        ] as const,
      ([rotation, flipX]) => {
        thumbnails.style.setProperty(
          "--icon-background",
          //color.color.v > 0.5 ? "black" : "white"
          "white"
        );
        thumbnails.style.setProperty(
          "--icon-transform",
          ` scaleX(${flipX ? -1 : 1}) rotate(${rotation}deg)`
        );
      },
      { fireImmediately: true }
    );
  }, [editorState]);

  return (
    <IconBrowserWrap className={className}>
      <FamilySelectArea>
        <Select
          value="ic"
          options={[
            {
              value: "ic",
              text: "Google Material Icons",
            },
          ]}
        />
        <ThemeSelect>
          {[...iconSet.prefixes.values()].map((prefix, i) => (
            <ThemeSelctItem
              key={prefix.id}
              aria-selected={prefix.id === currentThemeID}
              onClick={() => setCurrentThemeID(prefix.id)}
            >
              {prefix.title}
            </ThemeSelctItem>
          ))}
        </ThemeSelect>
      </FamilySelectArea>
      <SearchBar value={search} onChange={setSearch} />
      <StyledScrollable>
        <IconThumbnails ref={thumbnailsRef}>
          {icons.map((item) => (
            <IconThumbnail key={item.id} item={item} />
          ))}
        </IconThumbnails>
      </StyledScrollable>
      <IconPropertyEdit iconBrowserState={editorState.iconBrowserState} />
    </IconBrowserWrap>
  );
});

const FamilySelectArea = styled.div`
  padding: 0 12px 12px 12px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ThemeSelect = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
`;

const ThemeSelctItem = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  font-size: 12px;
  color: ${colors.activeText};
  background: ${(p) =>
    p["aria-selected"] ? colors.active : colors.uiBackground};
  padding: 4px 8px;
  line-height: 12px;
  border-radius: 10px;
`;

const IconThumbnails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 24px);
  gap: 12px;
  padding: 12px;
`;

const StyledScrollable = styled(Scrollable)`
  flex: 1;
  border-bottom: 2px solid ${colors.separator};
`;

const IconBrowserWrap = styled.div`
  display: flex;
  flex-direction: column;
`;
