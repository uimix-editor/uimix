import styled from "@emotion/styled";
import * as RadixPopover from "@radix-ui/react-popover";
import { checkPattern } from "../../../components/checkPattern";
import { ColorPicker } from "../../../components/color/ColorPicker";
import { Input } from "../../../components/Input";
import { Color } from "../../../utils/Color";

const ColorLabelBackground = styled.div`
  ${checkPattern("white", "#aaa", "8px")}
`;

export function ColorPopoverButton({
  value,
  onChange,
  onChangeEnd,
}: {
  value: Color;
  onChange?: (value: Color) => void;
  onChangeEnd?: () => void;
}): JSX.Element {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger>
        <div className="w-6 h-6 rounded p-0.5 bg-macaron-uiBackground">
          <ColorLabelBackground className="w-full h-full rounded-sm overflow-hidden">
            <div
              className="w-full h-full"
              style={{
                backgroundColor: value?.toHex() ?? "transparent",
              }}
            />
          </ColorLabelBackground>
        </div>
      </RadixPopover.Trigger>
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
  value: Color;
  onChange?: (value: Color) => void;
  onChangeEnd?: () => void;
}): JSX.Element {
  const valueWithoutAlpha = value?.withAlpha(1);
  const alpha = value?.a;

  const hex = valueWithoutAlpha.toHex6().slice(1);

  return (
    <div className="flex gap-2">
      <ColorPopoverButton
        value={value}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
      />
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
          alpha !== undefined ? Math.round(alpha * 100).toString() : undefined
        }
        onChange={(text) => {
          let alpha = Number.parseInt(text) / 100;
          if (isNaN(alpha)) {
            alpha = 1;
          }
          onChange?.(value.withAlpha(alpha));
          onChangeEnd?.();
        }}
      />
    </div>
  );
}
