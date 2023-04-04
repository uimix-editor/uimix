import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Icon, IconifyIcon } from "@iconify/react";
import { Input, UnstyledInput } from "./Input";
import { Mixed, sameOrMixed } from "../utils/Mixed";
import { Tooltip } from "@uimix/design-system/src/components/Tooltip";
import { IconButton } from "./IconButton";
import { css } from "@emotion/react";
import clsx from "clsx";
import { ToggleButton } from "./ToggleButton";

const inputClassNames =
  "outline-0 min-w-0 h-7 px-1.5 bg-transparent focus:ring-1 ring-inset ring-macaron-active text-macaron-text text-macaron-base placeholder:text-macaron-disabledText";

export const SeparableInput: React.VFC<{
  title: string;
  values: {
    top: string | Mixed;
    right: string | Mixed;
    bottom: string | Mixed;
    left: string | Mixed;
  };
  onChange: (
    edge: "all" | "top" | "right" | "bottom" | "left",
    value: string
  ) => boolean;
  edgeIcons: {
    all: IconifyIcon;
    top: IconifyIcon;
    right: IconifyIcon;
    bottom: IconifyIcon;
    left: IconifyIcon;
  };
  edgeNames?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  toggleIcon: IconifyIcon;
}> = function SeparableInput({
  title,
  values,
  onChange,
  edgeIcons,
  edgeNames = {
    top: "Top",
    right: "Right",
    bottom: "Bottom",
    left: "Left",
  },
  toggleIcon,
}) {
  const mixedValue = sameOrMixed([
    values.top,
    values.right,
    values.bottom,
    values.left,
  ]);

  const [separate, setSeparate] = useState(mixedValue === Mixed);
  const [currentEdge, setCurrentEdge] = useState<
    "top" | "right" | "bottom" | "left" | undefined
  >(undefined);

  useEffect(() => {
    if (!separate) {
      setCurrentEdge(undefined);
    }
  }, [separate]);

  return (
    <SeparableInputWrap separate={separate}>
      {separate ? (
        <div className="relative bg-macaron-uiBackground rounded grid grid-cols-[repeat(4,1fr)_20px]">
          <UnstyledInput
            className={clsx(inputClassNames, "rounded-l")}
            value={values.top}
            onChangeValue={(value) => onChange("top", value)}
            onFocus={() => setCurrentEdge("top")}
          />
          <UnstyledInput
            className={clsx(
              inputClassNames,
              "border-l border-macaron-separator"
            )}
            value={values.right}
            onChangeValue={(value) => onChange("right", value)}
            onFocus={() => setCurrentEdge("right")}
          />
          <UnstyledInput
            className={clsx(
              inputClassNames,
              "border-l border-macaron-separator"
            )}
            value={values.bottom}
            onChangeValue={(value) => onChange("bottom", value)}
            onFocus={() => setCurrentEdge("bottom")}
          />
          <UnstyledInput
            className={clsx(
              inputClassNames,
              "border-l border-macaron-separator"
            )}
            value={values.left}
            onChangeValue={(value) => onChange("left", value)}
            onFocus={() => setCurrentEdge("left")}
          />
          <Tooltip
            text={
              currentEdge
                ? `${edgeNames[currentEdge]} ${title}`
                : `Separate ${title}`
            }
          >
            <div className="absolute right-1.5 top-0 bottom-0 flex items-center text-macaron-disabledText text-[10px] font-bold">
              <Icon width={12} icon={edgeIcons[currentEdge ?? "all"]} />
            </div>
          </Tooltip>
        </div>
      ) : (
        <Input
          icon={edgeIcons.all}
          tooltip={title}
          // FIXME: strange type error related to Mixed symbol
          // @ts-ignore
          value={mixedValue}
          onChange={(value) => onChange("all", value)}
        />
      )}
      <ToggleButton
        icon={toggleIcon}
        value={separate}
        onChange={(value) => setSeparate(value)}
      />
    </SeparableInputWrap>
  );
};

const SeparableInputWrap = styled.div<{ separate: boolean }>`
  display: grid;
  ${(p) =>
    p.separate
      ? css`
          grid-template-columns: 1fr 20px;
        `
      : css`
          grid-template-columns: 1fr 1fr 1fr;
          > :last-child {
            grid-column: 3/4;
            justify-self: end;
          }
        `}
  gap: 8px;
  align-items: center;
`;
