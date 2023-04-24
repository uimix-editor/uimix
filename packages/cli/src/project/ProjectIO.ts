import * as Data from "@uimix/model/src/data/v1";
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

interface ProjectIOContent {
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
export class ProjectIO {
  static readonly projectBoundary = "package.json"; // TODO: other project boundaries

  static async load(fileAccess: FileAccess, rootPath: string) {
    const projectIO = new ProjectIO(fileAccess, rootPath);
    const result = await projectIO.load();
    if (result.problems.length) {
      throw new Error(
        `Problems loading workspace:\n${result.problems
          .map(
            (problem) => `  ${problem.filePath}:\n    ${String(problem.error)}`
          )
          .join("\n")}`
      );
    }
    return projectIO;
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

  content: ProjectIOContent = {
    manifest: {},
    project: new Project(),
    pages: new Map(),
    imagePaths: new Map(),
  };

  private async getFilePaths(): Promise<{
    pages: string[];
    images: string[];
  }> {
    // filter out files in sub-projects

    const projectBoundaryFilePaths = await this.fileAccess.glob(this.rootPath, [
      ProjectIO.projectBoundary,
    ]);

    const subProjectPaths = projectBoundaryFilePaths
      .map((filePath) => path.dirname(filePath))
      .filter((projectPath) => this.rootPath !== projectPath);

    const filePaths = (
      await this.fileAccess.glob(this.rootPath, [
        this.filePattern,
        ...this.imagePatterns,
      ])
    ).filter(
      (filePath) =>
        !subProjectPaths.some((projectPath) =>
          filePath.startsWith(projectPath + "/")
        )
    );
    filePaths.sort();

    const pages = filePaths.filter((filePath) => filePath.endsWith(".uimix"));
    const images = filePaths.filter((filePath) => !filePath.endsWith(".uimix"));

    return {
      pages,
      images,
    };
  }

  async load(): Promise<LoadResult> {
    const problems: LoadProblem[] = [];

    try {
      const filePaths = await this.getFilePaths();

      let manifest: ProjectManifest = {};

      const manifestPath = path.join(this.rootPath, this.uimixProjectFile);
      if ((await this.fileAccess.stat(manifestPath))?.type === "file") {
        try {
          manifest = ProjectManifest.parse(
            JSON.parse(
              (
                await this.fileAccess.readFile(
                  path.join(this.rootPath, this.uimixProjectFile)
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

      // TODO: reload changed files only
      for (const filePath of filePaths.pages) {
        try {
          const pageText = (
            await this.fileAccess.readFile(filePath)
          ).toString();
          const pageNode = loadFromJSXFile(pageText);
          const pageName = path
            .relative(this.rootPath, filePath)
            .replace(/\.uimix$/, "");
          pages.set(pageName, pageNode);
        } catch (error) {
          problems.push({
            filePath,
            error,
          });
        }
      }

      for (const filePath of filePaths.images) {
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

      const imagePathToHash = new Map<string, string>();
      for (const [hash, absPath] of imagePaths) {
        imagePathToHash.set(path.relative(this.rootPath, absPath), hash);
      }

      const loader = new ProjectLoader(this.content.project, imagePathToHash);
      loader.load(pages);
      for (const [key, image] of images) {
        loader.project.imageManager.images.set(key, image);
      }

      if (isEqual(pages, this.content.pages)) {
        return {
          changed: false,
          problems,
        };
      }

      this.content.manifest = manifest;
      this.content.pages = pages;
      this.content.imagePaths = imagePaths;

      return {
        changed: true,
        problems,
      };
    } catch (error) {
      problems.push({
        filePath: this.rootPath,
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
      const project = this.content.project;

      // save images

      const imagePathsInProject = new Map<string, string>();

      for (const imagePath of (await this.getFilePaths()).images) {
        const imageData = await this.fileAccess.readFile(imagePath);
        const hash = await getURLSafeBase64Hash(imageData);
        imagePathsInProject.set(hash, path.relative(this.rootPath, imagePath));
      }

      const usedImageHashes = project.imageManager.usedImageHashes;

      for (const [hash, image] of project.imageManager.images) {
        if (!usedImageHashes.has(hash)) {
          // not used
          continue;
        }
        if (imagePathsInProject.has(hash)) {
          // already saved
          continue;
        }

        const decoded = dataUriToBuffer(image.url);
        const suffix = mime.extension(decoded.type) || "bin";
        await this.fileAccess.writeFile(
          // TODO: make default image directory configurable
          path.join(this.rootPath, "src/images", `${hash}.${suffix}`),
          decoded
        );
      }

      // save pages

      const pagePathsToDelete = new Set(
        await this.fileAccess.glob(this.rootPath, [this.filePattern])
      );

      const projectEmitter = new ProjectEmitter(project, imagePathsInProject);
      const pages = projectEmitter.emit();

      for (const [pageName, pageNode] of pages) {
        const pagePath = path.join(this.rootPath, pageName + ".uimix");
        await this.fileAccess.writeFile(
          pagePath,
          Buffer.from(formatTypeScript(stringifyAsJSXFile(pageNode)))
        );
        pagePathsToDelete.delete(pagePath);
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

      this.content.pages = pages;

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
      [this.filePattern, ProjectIO.projectBoundary],
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
