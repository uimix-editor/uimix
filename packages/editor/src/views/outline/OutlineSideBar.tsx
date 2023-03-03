import { observer } from "mobx-react-lite";
import {
  SideBarTabsContent,
  SideBarTabsList,
  SideBarTabsRoot,
  SideBarTabsTrigger,
} from "../../components/SideBarTabs";
import { ScrollArea } from "../../components/ScrollArea";
import { NodeTreeView } from "./NodeTreeView";
import { Icon } from "@iconify/react";
import { PageTreeView } from "./DocumentTreeView";
import { InsertPalette } from "./InsertPalette";

export const OutlineSideBar: React.FC = observer(() => {
  return (
    <SideBarTabsRoot
      defaultValue="layers"
      className="w-[256px] flex flex-col contain-strict"
    >
      <SideBarTabsList>
        <SideBarTabsTrigger value="pages">
          <span className="flex gap-1.5 items-center">
            <Icon
              icon="material-symbols:topic-outline"
              className="text-base opacity-60"
            />
            Pages
          </span>
        </SideBarTabsTrigger>
        <SideBarTabsTrigger value="layers">
          <span className="flex gap-1.5 items-center">
            <Icon
              icon="material-symbols:layers-outline"
              className="text-base opacity-60"
            />
            Layers
          </span>
        </SideBarTabsTrigger>
        <SideBarTabsTrigger value="insert">
          <span className="flex gap-1.5 items-center">
            <Icon
              icon="material-symbols:add"
              className="text-base opacity-60"
            />
            Insert
          </span>
        </SideBarTabsTrigger>
      </SideBarTabsList>
      <SideBarTabsContent
        value="pages"
        className="flex-1 relative outline-none"
      >
        <ScrollArea className="absolute left-0 top-0 w-full h-full">
          <PageTreeView />
        </ScrollArea>
      </SideBarTabsContent>
      <SideBarTabsContent
        value="layers"
        className="flex-1 relative outline-none"
      >
        <ScrollArea className="absolute left-0 top-0 w-full h-full">
          <NodeTreeView />
        </ScrollArea>
      </SideBarTabsContent>
      <SideBarTabsContent
        value="insert"
        className="flex-1 relative outline-none"
      >
        <ScrollArea className="absolute left-0 top-0 w-full h-full">
          <InsertPalette />
        </ScrollArea>
      </SideBarTabsContent>
    </SideBarTabsRoot>
  );
});
OutlineSideBar.displayName = "OutlineSideBar";
