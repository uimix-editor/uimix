import * as RadixTooltip from "@radix-ui/react-tooltip";

export const TooltipProvider = RadixTooltip.Provider;

export function Tooltip({
  children,
  text,
  side,
}: {
  children: React.ReactNode;
  text: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}) {
  if (!text) {
    return <>{children}</>;
  }

  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          sideOffset={5}
          className="pointer-events-none bg-white text-black rounded shadow text-macaron-base px-2 py-1 z-10"
          side={side}
        >
          {text}
          <RadixTooltip.Arrow className="fill-white" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
