import * as fs from "fs";
import { parseHTMLFragment } from "./util";

export function compileFile(filePath: string): void {
  const data = fs.readFileSync(filePath, "utf8");
  const out = compile(data);
  fs.writeFileSync(filePath.replace(/\.macaron$/, ".js"), out);
}

export function compile(data: string): string {
  const ast = parseHTMLFragment(data);
  console.log(ast);
  return "TODO";
}
