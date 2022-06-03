import * as path from "path";
import * as fs from "fs";

async function generateCSSStrings(cwd: string): Promise<void> {
  const files = [
    "codemirror/lib/codemirror.css",
    "codemirror/theme/material-darker.css",
  ];

  const contents = Object.fromEntries(
    Object.entries(files).map(([name, importPath]) => {
      const filePath = require.resolve(importPath);
      const content = fs.readFileSync(filePath, { encoding: "utf-8" });
      return [name, content];
    })
  );

  fs.writeFileSync(
    `${path.resolve(cwd, "src/views/styles")}.json`,
    JSON.stringify(contents, null, 2)
  );
}

const packageDir = path.dirname(__dirname);

async function run() {
  await generateCSSStrings(packageDir);
}

run().finally(() => {});
