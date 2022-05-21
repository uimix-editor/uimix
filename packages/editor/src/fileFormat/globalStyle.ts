import * as postcss from "postcss";
import { Document } from "../models/Document";

export function dumpGlobalStyle(document: Document): postcss.Rule {
  const root = new postcss.Rule({
    selector: ":root",
  });

  for (const variable of document.cssVariables.children) {
    root.append(
      new postcss.Declaration({
        prop: "--" + variable.name,
        value: variable.color.toString(),
      })
    );
  }

  return root;
}
