import { runInAction } from "mobx";
import * as Data from "@uimix/model/src/data/v1";
import { formatJSON } from "@uimix/foundation/src/utils/Format";
import { projectState } from "./ProjectState";
import { Buffer } from "buffer";

export async function embedImages(
  images: Record<string, Data.Image>
): Promise<Record<string, Data.Image>> {
  const ret: Record<string, Data.Image> = {};
  for (const [hash, image] of Object.entries(images)) {
    if (!image.url.startsWith("data:")) {
      const buffer = await fetch(image.url).then((res) => res.arrayBuffer());
      const url = `data:${image.type};base64,${Buffer.from(buffer).toString(
        "base64"
      )}`;
      ret[hash] = {
        ...image,
        url,
      };
    } else {
      ret[hash] = image;
    }
  }

  return ret;
}

export async function exportToJSON() {
  const projectJSON = projectState.project.toJSON();
  projectJSON.images = await embedImages(projectJSON.images ?? {});

  const projectJSONText = formatJSON(JSON.stringify(projectJSON));

  // download file
  const blob = new Blob([projectJSONText], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "project.uimixproject";
  a.click();
  URL.revokeObjectURL(url);
}

export async function importJSON() {
  // select file via input element

  const file = await new Promise<File | undefined>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".uimixproject";
    input.onchange = () => {
      resolve(input.files?.[0]);
    };
    input.click();
  });

  if (!file) return;
  const data = await file.text();
  const projectJSON = Data.Project.parse(JSON.parse(data));
  projectJSON.images = await projectState.project.imageManager.uploadImages(
    projectJSON.images ?? {}
  );

  runInAction(() => {
    projectState.loadJSON(projectJSON);
  });
}
