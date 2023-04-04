import { observer } from "mobx-react-lite";
import { FontLoadLink } from "@uimix/foundation/src/components/FontLoadLink";
import { projectState } from "../../../state/ProjectState";

export const FontLoader = observer(function FontLoader() {
  return (
    <FontLoadLink
      fonts={[...projectState.project.node.selectable.usedFontFamilies]}
    />
  );
});
