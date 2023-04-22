import {
  Image,
  ProjectManifestJSON,
  ImageType,
} from "@uimix/model/src/data/v1";
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
} from "@uimix/model/src/file";
import { getURLSafeBase64Hash } from "@uimix/foundation/src/utils/Hash";
import sizeOf from "image-size";
import { dataUriToBuffer } from "data-uri-to-buffer";
import * as mime from "mime-types";

interface ProjectData {
  manifest: ProjectManifestJSON;
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
export class WorkspaceLoader {
  static async load(fileAccess: FileAccess) {
    const loader = new WorkspaceLoader(fileAccess);
    const result = await loader.load();
    if (result.problems.length) {
      throw new Error(
        `Problems loading workspace:\n${result.problems
          .map(
            (problem) => `  ${problem.filePath}:\n    ${String(problem.error)}`
          )
          .join("\n")}`
      );
    }
    return loader;
  }

  constructor(fileAccess: FileAccess) {
    this.fileAccess = fileAccess;
  }

  readonly fileAccess: FileAccess;

  get rootPath(): string {
    return this.fileAccess.rootPath;
  }

  readonly filePattern = "**/*.uimix";
  readonly imagePatterns = ["**/*.png", "**/*.jpg", "**/*.jpeg"];
  readonly uimixProjectFile = "uimix.json";
  readonly projectBoundary = "package.json"; // TODO: other project boundaries
  projects = new Map<string, ProjectData>(); // project path -> project json

  get rootProject(): ProjectData {
    return this.getOrCreateProject(this.rootPath);
  }

  getOrCreateProject(projectPath: string): ProjectData {
    let project = this.projects.get(projectPath);
    if (!project) {
      project = {
        manifest: {},
        project: new Project(),
        pages: new Map(),
        imagePaths: new Map(),
      };
      this.projects.set(projectPath, project);
    }
    return project;
  }

  projectPathForFile(pagePath: string): string {
    return (
      [...this.projects.keys()]
        .sort((a, b) => b.length - a.length)
        .find((projectPath) => pagePath.startsWith(projectPath + path.sep)) ??
      this.rootPath
    );
  }

  async load(): Promise<LoadResult> {
    const filePaths = await this.fileAccess.glob(
      `{${this.filePattern},${this.imagePatterns.join(",")},**/${
        this.projectBoundary
      }}`
    );
    filePaths.sort();

    const filePathsForProject = new Map<string, string[]>([
      [this.rootPath, []],
    ]);

    for (const manifestPaths of filePaths.filter((filePath) =>
      filePath.endsWith(this.projectBoundary)
    )) {
      const parentPath = path.dirname(manifestPaths);
      filePathsForProject.set(parentPath, []);
    }

    for (const filePath of filePaths) {
      if (filePath.endsWith(this.projectBoundary)) {
        continue;
      }

      const projectPath = [...filePathsForProject.keys()]
        .sort((a, b) => b.length - a.length)
        .find((projectPath) => filePath.startsWith(projectPath + path.sep));
      if (!projectPath) {
        throw new Error("not supposed to happen");
      }
      filePathsForProject.get(projectPath)?.push(filePath);
    }

    let changed = false;
    const problems: LoadProblem[] = [];
    for (const [projectPath, filePaths] of filePathsForProject) {
      const result = await this.loadProject(projectPath, filePaths);
      changed = changed || result.changed;
      problems.push(...result.problems);
    }
    return {
      changed,
      problems,
    };
  }

  private async loadProject(
    projectPath: string,
    filePaths: string[]
  ): Promise<LoadResult> {
    const problems: LoadProblem[] = [];

    try {
      let manifest: ProjectManifestJSON = {};

      const manifestPath = path.join(projectPath, this.uimixProjectFile);
      if ((await this.fileAccess.stat(manifestPath))?.type === "file") {
        try {
          manifest = ProjectManifestJSON.parse(
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

      const images = new Map<string, Image>();
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

            const image: Image = {
              width: size.width ?? 0,
              height: size.height ?? 0,
              type: mimeType as ImageType,
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

      const existingProject = this.projects.get(projectPath);

      const loader = new ProjectLoader(existingProject?.project);
      loader.load(pages);
      for (const [key, image] of images) {
        loader.project.imageManager.images.set(key, image);
      }

      if (isEqual(pages, existingProject?.pages ?? new Map())) {
        return {
          changed: false,
          problems,
        };
      }

      this.projects.set(projectPath, {
        manifest,
        project: loader.project,
        pages,
        imagePaths,
      });

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

  async save(projectPathToSave?: string): Promise<void> {
    try {
      this.isSaving = true;

      const pagePathsToDelete = new Set(
        await this.fileAccess.glob(this.filePattern)
      );

      for (const [projectPath, project] of this.projects) {
        if (projectPathToSave && projectPath !== projectPathToSave) {
          continue;
        }

        const projectEmitter = new ProjectEmitter(project.project);
        const pages = projectEmitter.emit();

        for (const [pageName, pageNode] of pages) {
          const pagePath = path.join(projectPath, pageName + ".uimix");
          await this.fileAccess.writeFile(
            pagePath,
            Buffer.from(formatTypeScript(stringifyAsJSXFile(pageNode)))
          );
          pagePathsToDelete.delete(pagePath);
        }

        const usedImageHashes = usedImageHashesInProject(
          project.project.toJSON()
        );

        for (const [hash, image] of project.project.imageManager.images) {
          if (!usedImageHashes.has(hash)) {
            continue;
          }

          const decoded = dataUriToBuffer(image.url);
          const suffix = mime.extension(decoded.type) || "bin";
          await this.fileAccess.writeFile(
            path.join(projectPath, "src/images", `${hash}.${suffix}`),
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

        project.pages = pages;
      }

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
      `{${this.filePattern},**/${this.projectBoundary}}`,
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
