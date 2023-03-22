import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./ui-src",
  plugins: [viteSingleFile()],
  // build: {
  //   target: "esnext",
  //   assetsInlineLimit: 100000000,
  //   chunkSizeWarningLimit: 100000000,
  //   cssCodeSplit: false,
  //   brotliSize: false,
  //   outDir: "../dist",
  //   rollupOptions: {
  //     inlineDynamicImports: true,
  //     output: {
  //       manualChunks: () => "everything.js",
  //     },
  //   },
  // },
  build: {
    outDir: "../dist",
  },
  server: {
    port: 3002,
  },
});
