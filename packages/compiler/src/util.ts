import type * as hast from "hast";
import * as parse5 from "parse5";
import { fromParse5 } from "hast-util-from-parse5";

export function parseHTMLFragment(data: string): hast.Root {
  const p5ast = parse5.parseFragment(data);
  //@ts-ignore
  return fromParse5(p5ast) as hast.Root;
}
