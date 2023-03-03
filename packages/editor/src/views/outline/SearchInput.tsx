import { Icon } from "@iconify/react";
import React from "react";

export const SearchInput: React.FC<{
  placeholder: string;
  value: string;
  onChangeValue: (value: string) => void;
}> = ({ value, onChangeValue, placeholder }) => {
  return (
    <div className="relative h-10 border-b border-macaron-uiBackground">
      <input
        type="text"
        placeholder={placeholder}
        className="absolute inset-0 px-4 py-3 pl-9 bg-transparent placeholder:text-macaron-disabledText outline-none font-medium text-macaron-text"
        autoFocus
        value={value}
        onChange={(event) => onChangeValue(event.currentTarget.value)}
      />
      <Icon
        icon="material-symbols:search"
        className="text-base absolute left-4 top-3 text-macaron-disabledText"
      />
      {value !== "" && (
        <button
          className="absolute right-0 top-0 p-3"
          onClick={() => onChangeValue("")}
        >
          <Icon
            icon="material-symbols:close"
            className="text-base text-macaron-disabledText"
          />
        </button>
      )}
    </div>
  );
};
