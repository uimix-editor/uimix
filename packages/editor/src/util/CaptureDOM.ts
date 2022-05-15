import type * as hast from "hast";
import { h, s } from "hastscript";
import { compact } from "lodash-es";
import { toHtml } from "hast-util-to-html";
import { svgToDataURL } from "@seanchas116/paintkit/src/util/Image";

// TODO: use https://github.com/bubkoo/html-to-image
export async function captureDOM(
  element: HTMLElement,
  size: number
): Promise<string> {
  const ast = getRenderableAST(element);

  const width = element.offsetWidth;
  const height = element.offsetHeight;

  const svg = s(
    "svg",
    {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      xmlns: "http://www.w3.org/2000/svg",
    },
    s(
      "foreignObject",
      {
        x: 0,
        y: 0,
        width,
        height,
      },
      h(
        "div",
        {
          xmlns: "http://www.w3.org/1999/xhtml",
        },
        ast
      )
    )
  );

  const svgText = toHtml(svg);

  const img = new Image();

  img.src = svgToDataURL(svgText);

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const scale = size / Math.max(width, height);
  const offsetX = (size - width * scale) / 2;
  const offsetY = (size - height * scale) / 2;

  const ctx = canvas.getContext("2d")!;
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL("image/png");
}

function getRenderableAST(node: Node): hast.Element | hast.Text | undefined {
  if (node.nodeType === Node.TEXT_NODE) {
    return {
      type: "text",
      value: (node as Text).textContent ?? "",
    };
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;

    const attributes = Object.fromEntries(
      Array.from(element.attributes).map((attr) => [attr.name, attr.value])
    );

    const computedStyle = getComputedStyle(element);
    // TODO: ::before/::after

    const styleLines: string[] = [];
    for (let i = 0; i < computedStyle.length; i++) {
      const name = computedStyle.item(i);
      if (name) {
        styleLines.push(
          name + ":" + computedStyle.getPropertyValue(name) + ";"
        );
      }
    }
    attributes.style = styleLines.join("");

    const childNodes = element.shadowRoot
      ? element.shadowRoot.childNodes
      : element.tagName === "SLOT"
      ? (element as HTMLSlotElement).assignedNodes()
      : element.childNodes;

    const children = compact(Array.from(childNodes).map(getRenderableAST));
    const isSVG = element.namespaceURI === "http://www.w3.org/2000/svg";

    return (isSVG ? s : h)(element.tagName.toLowerCase(), attributes, children);
  }
}
