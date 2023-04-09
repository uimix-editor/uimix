// Your bundler file
const esbuild = require("esbuild");

const externals = Object.keys(require("./package.json").dependencies);

/** @type import('esbuild').BuildOptions */
const options = {
  entryPoints: ["./src/cli.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
  outfile: "dist/cli.js",
  external: externals,
};

if (process.argv.includes("--watch")) {
  esbuild.context(options).then((ctx) => ctx.watch());
} else {
  esbuild.build(options);
}
