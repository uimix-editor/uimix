import {
  DocumentMetadata,
  ProjectJSON,
} from "../../../dashboard/src/types/DesktopAPI";

export interface IPCMainAPI {
  getDocumentMetadata(): DocumentMetadata;
  getDocumentData(): ProjectJSON;
  setDocumentData(data: ProjectJSON): void;
}
