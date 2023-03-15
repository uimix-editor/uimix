// Your bundler file
const esbuild = require("esbuild");

const externals = [
  ...Object.keys(require("./package.json").dependencies),
  "electron",
];

/** @type import('esbuild').BuildOptions */
const options = {
  entryPoints: ["./src/index.ts", "./src/preload.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  outdir: "dist",
  outbase: "src",
  external: externals,
};

if (process.argv.includes("--watch")) {
  esbuild.context(options).then((ctx) => ctx.watch());
} else {
  esbuild.build(options);
}
