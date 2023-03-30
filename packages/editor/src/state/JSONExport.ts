import { runInAction } from "mobx";
import { ProjectJSON } from "@uimix/node-data";
import { formatJSON } from "../utils/Format";
import { projectState } from "./ProjectState";

export async function exportToJSON() {
  const projectJSON = projectState.project.toJSON();
  const projectJSONText = formatJSON(JSON.stringify(projectJSON));

  // download file
  const blob = new Blob([projectJSONText], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "project.uimix";
  a.click();
  URL.revokeObjectURL(url);
}

export async function importJSON() {
  // select file via input element

  const file = await new Promise<File | undefined>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".uimix";
    input.onchange = () => {
      resolve(input.files?.[0]);
    };
    input.click();
  });

  if (!file) return;
  const data = await file.text();
  const projectJSON = ProjectJSON.parse(JSON.parse(data));

  runInAction(() => {
    projectState.loadJSON(projectJSON);
  });
}
