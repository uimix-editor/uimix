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
import { VerticalToolBar } from "./toolbar/VerticalToolBar";
import { InstancePaletteOverlay } from "./viewport/InstancePaletteOverlay";
import { ForeignComponentListDialog } from "./dialog/ForeignComponentListDialog";

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

export const App = observer(function App() {
  useKeyHandling();
  //useWindowTitle();

  return (
    <TooltipProvider>
      <FontLoader />
      <div className="flex flex-col fixed inset-0 top-10 text-macaron-base bg-macaron-background text-macaron-text select-none">
        <div className="flex flex-1">
          <OutlineSideBar />
          <div className="bg-macaron-separator w-px" />
          <VerticalToolBar />
          <div className="flex flex-1 border-l border-r border-macaron-separator relative">
            <Viewport />
            <InstancePaletteOverlay />
          </div>
          <InspectorSideBar />
        </div>
      </div>
      <ContextMenu />
      <ForeignComponentListDialog />
    </TooltipProvider>
  );
});
