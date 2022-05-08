import * as Comlink from "comlink";
import {
  IExtensionAPI,
  ImageAsset,
  IWebviewAPI,
} from "../../../vscode/src/APIInterface";
import { VSCodeFile } from "./VSCodeFile";

const vscode = acquireVsCodeApi();

export class VSCodeAppState {
  constructor() {
    const file = (this.file = new VSCodeFile());

    const comlinkEndpoint: Comlink.Endpoint = {
      addEventListener: window.addEventListener.bind(window),
      removeEventListener: window.removeEventListener.bind(window),
      postMessage: (message: unknown) => {
        console.log(message);
        vscode.postMessage(message);
      },
    };

    const webviewAPI: IWebviewAPI = {
      setContent(content: string): void {
        file.setContent(content);
      },
      getContent(): string {
        return file.getContent();
      },
      updateSavePoint(): void {
        file.updateSavePoint();
      },
      setImageAssets(assets: readonly ImageAsset[]): void {
        // TODO
      },
    };

    Comlink.expose(webviewAPI, comlinkEndpoint);

    const extensionAPI = Comlink.wrap<IExtensionAPI>(comlinkEndpoint);
    file.onDirtyChange((dirty) => extensionAPI.onDirtyChange(dirty));

    vscode.postMessage("ready");
  }

  readonly file: VSCodeFile;
}
