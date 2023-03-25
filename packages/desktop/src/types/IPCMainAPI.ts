import { ProjectJSON } from "../../../dashboard/src/types/DesktopAPI";

export interface IPCMainAPI {
  getDocumentData(): ProjectJSON;
  setDocumentData(data: ProjectJSON): void;
}
