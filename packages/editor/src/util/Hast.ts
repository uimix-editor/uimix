import type * as hast from "hast";
import * as parse5 from "parse5";
import { fromParse5 } from "hast-util-from-parse5";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import { unified } from "unified";

export function parseHTMLFragment(data: string): hast.Root {
  const p5ast = parse5.parseFragment(data);
  //@ts-ignore
  const hast: hast.Root = fromParse5(p5ast);
  return unified().use(rehypeMinifyWhitespace).runSync(hast);
}
