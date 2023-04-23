import * as path from "path";
import react from "@vitejs/plugin-react";
import { build } from "vite";
import { codeAssetsDestination } from "./constants";
import { ProjectManifest } from "@uimix/model/src/file";

export async function buildCodeAssets(
  rootPath: string,
  manifest: ProjectManifest,
  options: {
    watch?: boolean;
  }
): Promise<void> {
  if (!manifest.assets) {
    return;
  }

  // TODO: make build options configurable

  await build({
    configFile: false,
    root: rootPath,
    plugins: [react()],
    build: {
      lib: {
        entry: path.resolve(rootPath, manifest.assets),
        name: "bundle",
        fileName: "bundle",
        formats: ["es"],
      },
      outDir: path.resolve(rootPath, codeAssetsDestination.directory),
      watch: options.watch ? {} : undefined,
    },
  });
}
