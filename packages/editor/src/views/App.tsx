import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Viewport } from "./viewport/Viewport";
import { InspectorSideBar } from "./inspector/InspectorSideBar";
import { TooltipProvider } from "@uimix/foundation/src/components/Tooltip";
import { ContextMenu } from "./ContextMenu";
import { commands } from "../state/Commands";
import { action } from "mobx";
import { OutlineSideBar } from "./outline/OutlineSideBar";
import { FontLoader } from "./viewport/renderer/FontLoader";
import { ToolBar } from "./toolbar/ToolBar";
import { InstancePaletteOverlay } from "./viewport/InstancePaletteOverlay";
import { ForeignComponentListDialog } from "./dialog/ForeignComponentListDialog";
import { viewportState } from "../state/ViewportState";
import { ScrollArea } from "@uimix/foundation/src/components/ScrollArea";
import { NodeTreeView } from "./outline/NodeTreeView";

function useKeyHandling() {
  useEffect(() => {
    const onKeyDown = action((e: KeyboardEvent) => {
      if (commands.handleKeyDown(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    const onKeyUp = action((e: KeyboardEvent) => {
      commands.handleKeyUp(e);
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);
}

// function useWindowTitle() {
//   useEffect(() => {
//     return reaction(
//       () => projectState.fileName,
//       (fileName) => {
//         document.title = `${fileName} - Site & Component Editor`;
//       },
//       { fireImmediately: true }
//     );
//   }, []);
// }

// get title bar padding from query string

interface ViewOptions {
  titleBarPadding: number;
  remSize: number;
  fontSize: number;
  narrowMode: boolean;
}

function getViewOptions(): ViewOptions {
  const searchParams = new URLSearchParams(window.location.search);

  const titleBarPadding = Number.parseInt(
    searchParams.get("titleBarPadding") ?? "0"
  );
  const remSize = Number.parseInt(searchParams.get("remSize") ?? "16");
  const fontSize = Number.parseInt(searchParams.get("fontSize") ?? "12");
  const narrowMode = searchParams.get("narrowMode") === "true";

  return {
    titleBarPadding,
    remSize,
    fontSize,
    narrowMode,
  };
}

const viewOptions = getViewOptions();

export const App = observer(function App() {
  useKeyHandling();
  //useWindowTitle();

  return (
    <TooltipProvider>
      <FontLoader />
      <style>
        {`
          :root {
            font-size: ${viewOptions.remSize}px;
            --uimix-font-size: ${viewOptions.fontSize}px;
          }
        `}
      </style>
      <div
        className="flex flex-col fixed inset-0 text-macaron-base bg-macaron-background text-macaron-text select-none"
        style={{
          top: `${viewOptions.titleBarPadding}px`,
        }}
      >
        {viewOptions.narrowMode ? (
          <div className="flex flex-1">
            <div className="flex flex-1 flex-col border-r border-macaron-separator">
              <ToolBar position="top" />
              <div className="flex flex-1 border-t border-macaron-separator relative">
                <Viewport />
                <InstancePaletteOverlay />
              </div>
            </div>
            {viewportState.isSideBarsVisible && (
              <div className="flex flex-col w-64">
                <div className="flex-1 border-b border-macaron-separator">
                  <ScrollArea className="absolute left-0 top-0 w-full h-full">
                    <NodeTreeView />
                  </ScrollArea>
                </div>
                <InspectorSideBar className="flex-[2_2_0%]" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1">
            {viewportState.isSideBarsVisible && (
              <>
                <OutlineSideBar />
                <div className="bg-macaron-separator w-px" />
                <ToolBar position="left" />
              </>
            )}
            <div className="flex flex-1 border-l border-r border-macaron-separator relative">
              <Viewport />
              <InstancePaletteOverlay />
            </div>
            {viewportState.isSideBarsVisible && <InspectorSideBar />}
          </div>
        )}
      </div>
      <ContextMenu />
      <ForeignComponentListDialog />
    </TooltipProvider>
  );
});
