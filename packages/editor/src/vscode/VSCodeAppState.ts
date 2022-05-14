import * as Comlink from "comlink";
import { action, makeObservable, observable } from "mobx";
import { IExtensionAPI, IWebviewAPI } from "../../../vscode/src/APIInterface";
import { VSCodeFile } from "./VSCodeFile";

const vscode = acquireVsCodeApi();

export class VSCodeAppState {
  constructor() {
    const file = (this.file = new VSCodeFile());
    makeObservable(this);

    const comlinkEndpoint: Comlink.Endpoint = {
      addEventListener: window.addEventListener.bind(window),
      removeEventListener: window.removeEventListener.bind(window),
      postMessage: (message: unknown) => {
        vscode.postMessage(message);
      },
    };

    const webviewAPI: IWebviewAPI = {
      setContent(content: string, url: string | undefined): void {
        file.setContent(content, url);
      },
      getContent(): string {
        return file.getContent();
      },
      updateSavePoint(): void {
        file.updateSavePoint();
      },
      setImageAssets: action((assets: string[]) => {
        assets.sort((a, b) => a.localeCompare(b));
        this.imageAssets = assets;
      }),
    };

    Comlink.expose(webviewAPI, comlinkEndpoint);

    const extensionAPI = Comlink.wrap<IExtensionAPI>(comlinkEndpoint);
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
