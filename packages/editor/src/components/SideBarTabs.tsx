import * as RadixTabs from "@radix-ui/react-tabs";
import tw from "tailwind-styled-components";

export const SideBarTabsRoot = RadixTabs.Root;

export const SideBarTabsList: typeof RadixTabs.List = tw(
  RadixTabs.List
)`px-2 box-content h-10 border-b border-macaron-uiBackground flex items-center`;

export const SideBarTabsTrigger: typeof RadixTabs.Trigger = tw(
  RadixTabs.Trigger
)`
h-10 px-2 relative flex items-center
font-medium
text-macaron-disabledText
border-macaron-active
hover:text-macaron-label
aria-selected:text-macaron-text 
aria-selected:before:content-[""]
aria-selected:before:absolute
aria-selected:before:bottom-0
aria-selected:before:left-0
aria-selected:before:right-0
aria-selected:before:h-[2px]
aria-selected:before:bg-macaron-active
aria-selected:before:rounded-[1px]
`;

export const SideBarTabsContent = RadixTabs.Content;
