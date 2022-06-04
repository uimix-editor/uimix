const {
  NodeGlobalsPolyfillPlugin,
} = require("@esbuild-plugins/node-globals-polyfill");
const {
  NodeModulesPolyfillPlugin,
} = require("@esbuild-plugins/node-modules-polyfill");

const { readFile } = require("fs/promises");

function rawPlugin() {
  return {
    name: "raw",
    setup(build) {
      build.onResolve({ filter: /\?raw$/ }, (args) => {
        const path = require.resolve(args.path.slice(0, -4));
        return {
          path,
          namespace: "raw-loader",
        };
      });
      build.onLoad({ filter: /.*/, namespace: "raw-loader" }, async (args) => {
        return {
          contents: await readFile(args.path),
          loader: "text",
        };
      });
    },
  };
}

require("esbuild")
  .build({
    entryPoints: ["src/vscode/main.tsx", "src/webcomponent/main.tsx"],
    bundle: true,
    outdir: "./dist",

    // Node.js global to browser globalThis
    define: {
      global: "globalThis",
    },
    // Enable esbuild polyfill plugins
    plugins: [
      NodeGlobalsPolyfillPlugin({
        process: true,
        buffer: true,
      }),
      NodeModulesPolyfillPlugin(),
      rawPlugin(),
    ],
  })
  .catch(() => process.exit(1));
