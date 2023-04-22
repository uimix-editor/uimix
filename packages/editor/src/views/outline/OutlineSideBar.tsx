import { observer } from "mobx-react-lite";
import {
  SideBarTabsContent,
  SideBarTabsList,
  SideBarTabsRoot,
  SideBarTabsTrigger,
  ScrollArea,
} from "@uimix/foundation/src/components";
import { NodeTreeView } from "./NodeTreeView";
import { Icon } from "@iconify/react";
import { PageTreeView } from "./PageTreeView";
import { ImageTreeView } from "./ImageTreeView";

export const OutlineSideBar: React.FC = observer(() => {
  return (
    <SideBarTabsRoot
      defaultValue="layers"
      className="w-64 flex flex-col contain-strict"
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
        <SideBarTabsTrigger value="images">
          <span className="flex gap-1.5 items-center">
            <Icon
              icon="material-symbols:layers-outline"
              className="text-base opacity-60"
            />
            Images
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
        value="images"
        className="flex-1 relative outline-none"
      >
        <ScrollArea className="absolute left-0 top-0 w-full h-full">
          <ImageTreeView />
        </ScrollArea>
      </SideBarTabsContent>
    </SideBarTabsRoot>
  );
});
OutlineSideBar.displayName = "OutlineSideBar";
