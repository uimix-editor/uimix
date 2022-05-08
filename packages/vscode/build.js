const dev = process.argv.includes("--dev");

require("esbuild")
  .build({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    outfile: "out/extension.js",
    external: ["vscode"],
    format: "cjs",
    platform: "node",
    target: "node12",
    watch: dev
      ? {
          onRebuild(error, result) {
            if (error) console.error("watch build failed:", error);
            else console.log("watch build succeeded:", result);
          },
        }
      : undefined,
    sourcemap: dev,
    minify: !dev,
  })
  .catch(() => process.exit(1));
