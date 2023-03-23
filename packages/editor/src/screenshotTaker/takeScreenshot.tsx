import { Project } from "../models/Project";
import { domForSelectable } from "../views/viewport/renderer/NodeRenderer";
import * as htmlToImage from "html-to-image";

export function takeScreenshot(project: Project) {
  const firstPage = project.pages.all[0];
  if (!firstPage) {
    return;
  }

  for (const selectable of firstPage.selectable.children) {
    const dom = domForSelectable.get(selectable);
    if (!dom) {
      return;
    }
    void htmlToImage.toSvg(dom).then((svg) => {
      console.log(svg);
    });
  }
}
