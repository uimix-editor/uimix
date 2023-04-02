import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Viewport } from "./viewport/Viewport";
import { InspectorSideBar } from "./inspector/InspectorSideBar";
import { TooltipProvider } from "../components/Tooltip";
import { ContextMenu } from "./ContextMenu";
import { commands } from "../state/Commands";
import { action } from "mobx";
import { OutlineSideBar } from "./outline/OutlineSideBar";
import { FontLoader } from "./viewport/renderer/FontLoader";
import { ToolBar } from "./toolbar/ToolBar";
import { InstancePaletteOverlay } from "./viewport/InstancePaletteOverlay";
import { ForeignComponentListDialog } from "./dialog/ForeignComponentListDialog";
import { viewportState } from "../state/ViewportState";

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

const titleBarPadding = Number.parseInt(
  new URLSearchParams(window.location.search).get("titleBarPadding") ?? "0"
);

export const App = observer(function App() {
  useKeyHandling();
  //useWindowTitle();

  return (
    <TooltipProvider>
      <FontLoader />
      <div
        className="flex flex-col fixed inset-0 text-macaron-base bg-macaron-background text-macaron-text select-none"
        style={{
          top: `${titleBarPadding}px`,
        }}
      >
        <div className="flex flex-1">
          {viewportState.isSideBarsVisible && (
            <>
              <OutlineSideBar />
              <div className="bg-macaron-separator w-px" />
              <ToolBar />
            </>
          )}
          <div className="flex flex-1 border-l border-r border-macaron-separator relative">
            <Viewport />
            <InstancePaletteOverlay />
          </div>
          {viewportState.isSideBarsVisible && <InspectorSideBar />}
        </div>
      </div>
      <ContextMenu />
      <ForeignComponentListDialog />
    </TooltipProvider>
  );
});
