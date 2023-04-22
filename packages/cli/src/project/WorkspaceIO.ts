import * as Data from "@uimix/model/src/data/v1";
import { usedImageHashesInProject } from "@uimix/model/src/data/util";
import { isEqual } from "lodash-es";
import { formatTypeScript } from "../format";
import { FileAccess } from "./FileAccess";
import * as path from "path";
import { Project } from "@uimix/model/src/models";
import {
  ProjectEmitter,
  ProjectLoader,
  PageNode,
  loadFromJSXFile,
  stringifyAsJSXFile,
  ProjectManifest,
} from "@uimix/model/src/file";
import { getURLSafeBase64Hash } from "@uimix/foundation/src/utils/Hash";
import sizeOf from "image-size";
import { dataUriToBuffer } from "data-uri-to-buffer";
import * as mime from "mime-types";

interface ProjectData {
  manifest: ProjectManifest;
  project: Project;
  pages: Map<string, PageNode>;
  imagePaths: Map<string, string>; // hash to path
}

interface LoadProblem {
  filePath: string;
  error: unknown;
}

interface LoadResult {
  changed: boolean;
  problems: LoadProblem[];
}

// Important TODO: fix paths in Windows!!
export class WorkspaceIO {
  static async load(fileAccess: FileAccess, rootPath: string) {
    const workspaceIO = new WorkspaceIO(fileAccess, rootPath);
    const result = await workspaceIO.load();
    if (result.problems.length) {
      throw new Error(
        `Problems loading workspace:\n${result.problems
          .map(
            (problem) => `  ${problem.filePath}:\n    ${String(problem.error)}`
          )
          .join("\n")}`
      );
    }
    return workspaceIO;
  }

  constructor(fileAccess: FileAccess, rootPath: string) {
    this.fileAccess = fileAccess;
    this.rootPath = rootPath;
  }

  readonly fileAccess: FileAccess;
  readonly rootPath: string;

  readonly filePattern = "*.uimix";
  readonly imagePatterns = ["*.png", "*.jpg", "*.jpeg"];
  readonly uimixProjectFile = "uimix.json";
  readonly projectBoundary = "package.json"; // TODO: other project boundaries

  project: ProjectData = {
    manifest: {},
    project: new Project(),
    pages: new Map(),
    imagePaths: new Map(),
  };

  async load(): Promise<LoadResult> {
    let filePaths = await this.fileAccess.glob(this.rootPath, [
      this.filePattern,
      ...this.imagePatterns,
      this.projectBoundary,
    ]);
    filePaths.sort();

    const projectBoundaryFilePaths = filePaths.filter((filePath) =>
      filePath.endsWith(this.projectBoundary)
    );
    const projectPaths = projectBoundaryFilePaths
      .map((filePath) => path.dirname(filePath))
      .filter((projectPath) => this.rootPath !== projectPath);

    filePaths = filePaths.filter(
      (filePath) =>
        !projectPaths.some((projectPath) =>
          filePath.startsWith(projectPath + "/")
        )
    );

    return this.loadProject(this.rootPath, filePaths);
  }

  private async loadProject(
    projectPath: string,
    filePaths: string[]
  ): Promise<LoadResult> {
    const problems: LoadProblem[] = [];

    try {
      let manifest: ProjectManifest = {};

      const manifestPath = path.join(projectPath, this.uimixProjectFile);
      if ((await this.fileAccess.stat(manifestPath))?.type === "file") {
        try {
          manifest = ProjectManifest.parse(
            JSON.parse(
              (
                await this.fileAccess.readFile(
                  path.join(projectPath, this.uimixProjectFile)
                )
              ).toString()
            )
          );
        } catch (error) {
          problems.push({
            filePath: manifestPath,
            error,
          });
        }
      }

      const images = new Map<string, Data.Image>();
      const pages = new Map<string, PageNode>();
      const imagePaths = new Map<string, string>();

      for (const filePath of filePaths) {
        // TODO: reload changed files only

        if (filePath.endsWith(".uimix")) {
          try {
            const pageText = (
              await this.fileAccess.readFile(filePath)
            ).toString();
            const pageNode = loadFromJSXFile(pageText);
            const pageName = path
              .relative(projectPath, filePath)
              .replace(/\.uimix$/, "");
            pages.set(pageName, pageNode);
          } catch (error) {
            problems.push({
              filePath,
              error,
            });
          }
        } else {
          try {
            // TODO: lookup specific directories only
            const imageData = await this.fileAccess.readFile(filePath);
            const hash = await getURLSafeBase64Hash(imageData);
            const mimeType = mime.lookup(filePath) || "image/png";
            const size = sizeOf(imageData);

            const image: Data.Image = {
              width: size.width ?? 0,
              height: size.height ?? 0,
              type: mimeType as Data.ImageType,
              url: `data:${mimeType};base64,${imageData.toString("base64")}`,
            };
            images.set(hash, image);
            imagePaths.set(hash, filePath);
          } catch (error) {
            problems.push({
              filePath,
              error,
            });
          }
        }
      }

      const loader = new ProjectLoader(this.project.project);
      loader.load(pages);
      for (const [key, image] of images) {
        loader.project.imageManager.images.set(key, image);
      }

      if (isEqual(pages, this.project.pages)) {
        return {
          changed: false,
          problems,
        };
      }

      this.project.manifest = manifest;
      this.project.pages = pages;
      this.project.imagePaths = imagePaths;

      return {
        changed: true,
        problems,
      };
    } catch (error) {
      problems.push({
        filePath: projectPath,
        error,
      });

      return {
        changed: false,
        problems,
      };
    }
  }

  private isSaving = false;

  async save(): Promise<void> {
    try {
      this.isSaving = true;

      const pagePathsToDelete = new Set(
        await this.fileAccess.glob(this.rootPath, [this.filePattern])
      );

      const projectEmitter = new ProjectEmitter(this.project.project);
      const pages = projectEmitter.emit();

      for (const [pageName, pageNode] of pages) {
        const pagePath = path.join(this.rootPath, pageName + ".uimix");
        await this.fileAccess.writeFile(
          pagePath,
          Buffer.from(formatTypeScript(stringifyAsJSXFile(pageNode)))
        );
        pagePathsToDelete.delete(pagePath);
      }

      const usedImageHashes = usedImageHashesInProject(
        this.project.project.toJSON()
      );

      for (const [hash, image] of this.project.project.imageManager.images) {
        if (!usedImageHashes.has(hash)) {
          continue;
        }

        const decoded = dataUriToBuffer(image.url);
        const suffix = mime.extension(decoded.type) || "bin";
        await this.fileAccess.writeFile(
          path.join(this.rootPath, "src/images", `${hash}.${suffix}`),
          decoded
        );
      }

      // TODO: save manifest

      // const manifestPath = path.join(projectPath, this.uimixProjectFile);

      // let parsed: ProjectManifestJSON;
      // try {
      //   parsed = JSON.parse(
      //     (await this.fileAccess.readFile(manifestPath)).toString()
      //   ) as ProjectManifestJSON;
      // } catch (e) {
      //   parsed = {};
      // }
      // parsed.prebuiltAssets = project.manifest.prebuiltAssets;

      // TODO: avoid overwriting malformed uimix.json
      // await this.fileAccess.writeFile(
      //   manifestPath,
      //   Buffer.from(formatJSON(JSON.stringify(parsed)))
      // );

      this.project.pages = pages;

      for (const pagePath of pagePathsToDelete) {
        await this.fileAccess.remove(pagePath);
      }
    } finally {
      this.isSaving = false;
    }
  }

  watch(onChange: () => void): () => void {
    console.log("start watching...");

    return this.fileAccess.watch(
      this.rootPath,
      [this.filePattern, this.projectBoundary],
      async () => {
        try {
          if (this.isSaving) {
            return;
          }
          if ((await this.load()).changed) {
            onChange();
          }
        } catch (e) {
          console.error(e);
        }
      }
    );
  }
}
