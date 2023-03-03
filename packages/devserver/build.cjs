// Your bundler file
const esbuild = require("esbuild");

const externals = Object.keys(require("./package.json").dependencies);

esbuild.build({
  entryPoints: ["./src/cli.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: "dist/cli.js",
  external: externals,
});
