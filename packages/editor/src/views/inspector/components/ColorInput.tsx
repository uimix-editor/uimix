import styled from "@emotion/styled";
import * as RadixPopover from "@radix-ui/react-popover";
import { checkPattern } from "../../../components/checkPattern";
import { ColorPicker } from "../../../components/color/ColorPicker";
import { Input } from "../../../components/Input";
import { Color } from "../../../utils/Color";
import { twMerge } from "tailwind-merge";
import { ColorToken } from "../../../models/ColorToken";
import { ColorTokenPopover } from "./ColorTokenPopover";
import { IconButton } from "../../../components/IconButton";
import { Tooltip } from "../../../components/Tooltip";

const ColorLabelBackground = styled.div`
  ${checkPattern("white", "#aaa", "8px")}
`;

export const ColorButton: React.FC<
  {
    value?: Color;
  } & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>
> = ({ className, value, ...props }) => {
  return (
    <div
      {...props}
      className={twMerge(
        "w-7 h-7 rounded p-0.5 bg-macaron-uiBackground",
        className
      )}
    >
      <ColorLabelBackground className="w-full h-full rounded-sm overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            backgroundColor: value?.toHex() ?? "transparent",
          }}
        />
      </ColorLabelBackground>
    </div>
  );
};

export function ColorPopover({
  value,
  onChange,
  onChangeEnd,
  children = <ColorButton value={value} />,
}: {
  value: Color;
  onChange?: (value: Color) => void;
  onChangeEnd?: () => void;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger>{children}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align="start"
          className="bg-macaron-background z-10 border border-macaron-separator rounded-lg shadow-xl overflow-hidden"
        >
          <ColorPicker
            color={value}
            onChange={onChange}
            onChangeEnd={onChangeEnd}
          />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}

export function ColorInput({
  value,
  onChange,
  onChangeEnd,
}: {
  value?: Color | ColorToken;
  onChange?: (value: Color | ColorToken) => void;
  onChangeEnd?: () => void;
}): JSX.Element {
  const color =
    (value instanceof ColorToken ? value.value : value) ?? Color.black;

  const colorWithAlpha = color.withAlpha(1);
  const alpha = color.a;

  const hex = colorWithAlpha.toHex6().slice(1);

  return (
    <div className="flex gap-2 items-center h-7">
      <ColorPopover
        value={color}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
      />
      {value instanceof ColorToken ? (
        <>
          <ColorTokenPopover
            onSelect={(token) => {
              onChange?.(token);
              onChangeEnd?.();
            }}
          >
            <button
              className="flex-1 text-left
              h-7 bg-macaron-uiBackground rounded px-1.5
            "
            >
              {value.name}
            </button>
          </ColorTokenPopover>
          <Tooltip text="Unlink from token">
            <IconButton
              icon="material-symbols:link-off"
              onClick={() => {
                onChange?.(color);
                onChangeEnd?.();
              }}
            />
          </Tooltip>
        </>
      ) : (
        <>
          <Input
            className="flex-1"
            value={hex}
            onChange={(text) => {
              const color = Color.from(text);
              if (color) {
                onChange?.(color);
                onChangeEnd?.();
              }
            }}
          />
          <Input
            className="w-16"
            icon="%"
            value={
              alpha !== undefined
                ? Math.round(alpha * 100).toString()
                : undefined
            }
            onChange={(text) => {
              let alpha = Number.parseInt(text) / 100;
              if (isNaN(alpha)) {
                alpha = 1;
              }
              onChange?.(color.withAlpha(alpha));
              onChangeEnd?.();
            }}
          />
          <ColorTokenPopover
            onSelect={(token) => {
              onChange?.(token);
              onChangeEnd?.();
            }}
          >
            <IconButton icon="material-symbols:palette-outline" />
          </ColorTokenPopover>
        </>
      )}
    </div>
  );
}
