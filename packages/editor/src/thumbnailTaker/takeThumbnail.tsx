import { Project } from "@uimix/model/src/models";
import { domForSelectable } from "../views/viewport/renderer/NodeRenderer";
import * as htmlToImage from "html-to-image";
import { Rect, Vec2 } from "paintvec";
import { assertNonNull } from "@uimix/foundation/src/utils/Assert";

export async function takeThumbnail(
  project: Project
): Promise<ArrayBuffer | undefined> {
  const firstPage = project.pages.all[0];
  if (!firstPage) {
    return;
  }

  const thumbSize = new Vec2(640, 360);
  const canvas = document.createElement("canvas");
  canvas.width = thumbSize.x;
  canvas.height = thumbSize.y;
  const ctx = assertNonNull(canvas.getContext("2d"));

  const selectables = firstPage.selectable.offsetChildren;

  const contentBBox = Rect.union(
    ...selectables.map((child) => child.computedRect)
  );
  if (!contentBBox) {
    return;
  }

  const scale = Math.min(
    thumbSize.x / contentBBox.width,
    thumbSize.y / contentBBox.height
  );

  await Promise.all(
    selectables.map(async (selectable) => {
      const dom = domForSelectable.get(selectable);
      if (!dom) {
        return;
      }

      const domCanvas = await htmlToImage.toCanvas(dom, {
        skipFonts: true,
        style: {
          position: "static",
        },
      });
      if (domCanvas.width === 0 || domCanvas.height === 0) {
        return;
      }

      ctx.drawImage(
        domCanvas,
        (selectable.computedRect.left - contentBBox.center.x) * scale +
          thumbSize.x / 2,
        (selectable.computedRect.top - contentBBox.center.y) * scale +
          thumbSize.y / 2,
        selectable.computedRect.width * scale,
        selectable.computedRect.height * scale
      );
    })
  );

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(assertNonNull(blob));
    });
  });
  return blob.arrayBuffer();
}
