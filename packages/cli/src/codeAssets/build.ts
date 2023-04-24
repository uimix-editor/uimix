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

  const result = await build({
    root: rootPath,
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
  if ("on" in result) {
    return new Promise<void>((resolve, reject) => {
      result.on("event", (event) => {
        if (event.code === "BUNDLE_END") {
          resolve();
        }
        if (event.code === "ERROR") {
          reject(event.error);
        }
      });
    });
  }
}
