// Your bundler file
const esbuild = require("esbuild");

const externals = [
  ...Object.keys(require("./package.json").dependencies ?? {}),
  "vscode",
];

/** @type import('esbuild').BuildOptions */
const options = {
  entryPoints: ["./src/extension.ts", "./src/test/runTest.ts"],
  bundle: true,
  format: "cjs",
  platform: "node",
  outdir: "out",
  outbase: "src",
  external: externals,
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "production"
    ),
  },
};

if (process.argv.includes("--watch")) {
  esbuild.context(options).then((ctx) => ctx.watch());
} else {
  esbuild.build(options);
}
