import { action, makeObservable, observable } from "mobx";
import { setupMessageRPC } from "@seanchas116/paintkit/src/util/MessageRPC";
import { IExtensionAPI, IWebviewAPI } from "../../../vscode/src/APIInterface";
import { VSCodeFile } from "./VSCodeFile";

const vscode = acquireVsCodeApi();

export class VSCodeAppState {
  constructor() {
    const file = (this.file = new VSCodeFile());
    makeObservable(this);

    const webviewAPI: IWebviewAPI = {
      setContent(content: string, url: string | undefined) {
        file.setContent(content, url);
      },
      getContent() {
        return file.getContent();
      },
      updateSavePoint() {
        file.updateSavePoint();
      },
      setImageAssets: action((assets: string[]) => {
        assets.sort((a, b) => a.localeCompare(b));
        this.imageAssets = assets;
      }),
    };

    const extensionAPI = setupMessageRPC<IExtensionAPI>(webviewAPI, {
      addEventListener: (listener: (data: any) => void) => {
        const cb = (e: MessageEvent) => {
          listener(e.data);
        };

        window.addEventListener("message", cb);
        return () => {
          window.removeEventListener("message", cb);
        };
      },
      postMessage: (data: any) => {
        vscode.postMessage(data);
      },
    });

    file.onDirtyChange((dirty) => extensionAPI.onDirtyChange(dirty));

    vscode.postMessage("ready");
  }

  readonly file: VSCodeFile;
  private readonly imageAssetMap = observable.map<string, string>();

  @observable.ref imageAssets: readonly string[] = [];

  resolveImageAssetURL(assetPath: string): string {
    const base = this.file.url;
    if (!base) {
      return assetPath;
    }
    return new URL(assetPath, base).toString();
  }
}
