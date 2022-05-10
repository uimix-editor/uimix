const dev = process.argv.includes("--dev");

require("esbuild")
  .build({
    entryPoints: ["src/index.ts", "src/cli.ts"],
    bundle: true,
    outbase: "./src",
    outdir: "./dist",
    format: "cjs",
    platform: "node",
    target: "node12",
    external: ["chokidar"],
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
