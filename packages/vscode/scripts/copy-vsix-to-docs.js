const fs = require("fs");
const path = require("path");
const version = require("../package.json").version;

fs.copyFileSync(
  path.resolve(__dirname, `../macaron-vscode-${version}.vsix`),
  path.resolve(__dirname, "../../docs/public/macaron-vscode.vsix")
);
