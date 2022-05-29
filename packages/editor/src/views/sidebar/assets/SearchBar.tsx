import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import searchIcon from "@iconify-icons/ic/outline-search";
import { Icon } from "@iconify/react/dist/offline";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { inputStyle } from "@seanchas116/paintkit/src/components/Common";

const SearchInput = styled.input`
  ${inputStyle};
  line-height: 20px;
`;

const SearchIcon = styled(Icon)``;

const Search = styled.div`
  position: relative;
  height: 24px;

  ${SearchIcon} {
    pointer-events: none;
    position: absolute;
    left: 4px;
    top: 0;
    bottom: 0;
    margin: auto 0;
    display: block;
    pointer-events: none;
    width: 16px;
    height: 16px;
    color: ${colors.disabledText};
  }

  ${SearchInput} {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding-left: 24px;
  }
`;

const SearchBarWrap = styled.div`
  padding: 12px;
  padding-top: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  ${Search} {
    flex: 1;
  }
  border-bottom: 2px solid ${colors.separator};
`;

export const SearchBar: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
}> = observer(function SearchBar({ value, onChange }) {
  return (
    <SearchBarWrap>
      <Search>
        <SearchInput
          value={value}
          onChange={(e) => onChange?.(e.currentTarget.value)}
          placeholder="Search..."
        />
        <SearchIcon icon={searchIcon} />
      </Search>
    </SearchBarWrap>
  );
});
