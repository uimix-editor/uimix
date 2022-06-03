import * as path from "path";
import * as fs from "fs";

async function generateCSSStrings(cwd: string): Promise<void> {
  const files = [
    "codemirror/lib/codemirror.css",
    "codemirror/theme/material-darker.css",
  ];

  const contents = Object.fromEntries(
    files.map((importPath) => {
      const filePath = require.resolve(importPath);
      const content = fs.readFileSync(filePath, { encoding: "utf-8" });
      return [importPath, content];
    })
  );

  fs.writeFileSync(
    `${path.resolve(cwd, "src/cssFiles")}.json`,
    JSON.stringify(contents, null, 2)
  );
}

const packageDir = path.dirname(__dirname);

async function run() {
  await generateCSSStrings(packageDir);
}

run().finally(() => {});
