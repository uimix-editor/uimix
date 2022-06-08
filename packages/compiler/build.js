const dev = process.argv.includes("--dev");

for (const type of ["cjs", "esm"]) {
  require("esbuild")
    .build({
      entryPoints: ["src/index.ts", "src/cli.ts"],
      bundle: true,
      outbase: "./src",
      outdir: "./dist",
      outExtension: { ".js": type === "cjs" ? ".cjs" : ".mjs" },
      format: type,
      platform: "node",
      //target: "node12",
      external: ["chokidar", "prettier"],
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
}
