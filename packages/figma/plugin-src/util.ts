import type * as CSS from "csstype";
import type * as hast from "hast";
import { h } from "hastscript";
import { Buffer } from "buffer";
import * as parse5 from "parse5";
import { fromParse5 } from "hast-util-from-parse5";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import { unified } from "unified";

const lineBreakRegExp = /\r\n|[\n\r\u2028\u2029\u0085]/;

export function processCharacters(characters: string): hast.Content[] {
  const lines = characters.split(lineBreakRegExp);
  const results: hast.Content[] = [];
  for (let i = 0; i < lines.length; ++i) {
    if (i !== 0) {
      results.push(h("br"));
    }
    results.push({
      type: "text",
      value: lines[i],
    });
  }
  return results;
}

export function solidPaintToHex(solidPaint: SolidPaint): string {
  return rgbaToHex({ ...solidPaint.color, a: solidPaint.opacity ?? 1 });
}

export function rgbaToHex(rgba: RGBA): string {
  const { r, g, b, a } = rgba;
  return (
    "#" +
    (a === 1 ? [r, g, b] : [r, g, b, a])
      .map((c) => {
        const str = Math.round(c * 255)
          .toString(16)
          .toUpperCase();
        return str.length === 1 ? "0" + str : str;
      })
      .join("")
  );
}

const vectorLikeTypes: SceneNode["type"][] = [
  "LINE",
  "ELLIPSE",
  "POLYGON",
  "STAR",
  "VECTOR",
  "BOOLEAN_OPERATION",
];

const isVectorLikeNodeMemo = new WeakMap<SceneNode, boolean>();

export function isVectorLikeNode(node: SceneNode): boolean {
  const memo = isVectorLikeNodeMemo.get(node);
  if (memo != null) {
    return memo;
  }

  let result = false;
  if (vectorLikeTypes.includes(node.type)) {
    result = true;
  } else if ("children" in node) {
    result =
      node.children.length !== 0 && node.children.every(isVectorLikeNode);
  }

  isVectorLikeNodeMemo.set(node, result);
  return result;
}

export function svgToDataURL(svgText: string): string {
  const encoded = encodeURIComponent(svgText)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml,${encoded}`;
}

export function imageToDataURL(data: Uint8Array): string | undefined {
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e) {
    const base64 = Buffer.from(data).toString("base64");
    return "data:image/png;base64," + base64;
  } else {
    console.error("TODO: unsupported image data type");
    return undefined;
  }
}

export function generateIDFromText(name: string): string {
  let id = name.replace(/[^a-zA-Z0-9]/g, "");
  if (/^[0-9]/.exec(id)) {
    id = `_${id}`;
  }
  return id.toLowerCase();
}

export function incrementAlphanumeric(str: string): string {
  const numMatches = /[1-9][0-9]*$/.exec(str);
  if (numMatches) {
    const numPart = numMatches[0];
    const strPart = str.slice(0, str.length - numPart.length);

    return `${strPart}${Number.parseInt(numPart) + 1}`;
  }

  return str + "1";
}

export class IDGenerator {
  private ids = new Set<string>();
  maxLength = 20;

  generate(text: string): string {
    let id = generateIDFromText(text).slice(0, this.maxLength);
    while (this.ids.has(id)) {
      id = incrementAlphanumeric(id);
    }
    this.ids.add(id);
    return id;
  }
}

export function parseHTMLFragment(data: string): hast.Root {
  const p5ast = parse5.parseFragment(data);
  //@ts-ignore
  const hast: hast.Root = fromParse5(p5ast);
  return unified().use(rehypeMinifyWhitespace).runSync(hast);
}
