// Your bundler file
const esbuild = require("esbuild");

const externals = Object.keys(require("./package.json").dependencies);

/** @type import('esbuild').BuildOptions */
const options = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: "dist/index.js",
  external: externals,
};

if (process.argv.includes("--watch")) {
  esbuild.context(options).then((ctx) => ctx.watch());
} else {
  esbuild.build(options);
}
