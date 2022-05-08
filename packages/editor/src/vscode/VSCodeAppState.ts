import * as Comlink from "comlink";
import { action, computed, makeObservable, observable } from "mobx";
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
    makeObservable(this);

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
      setImageAssets: action((assets: readonly ImageAsset[]) => {
        const newMap = new Map<string, string>();
        for (const asset of assets) {
          newMap.set(asset.relativePath, asset.url);
        }
        this.imageAssetMap.replace(newMap);
      }),
    };

    Comlink.expose(webviewAPI, comlinkEndpoint);

    const extensionAPI = Comlink.wrap<IExtensionAPI>(comlinkEndpoint);
    file.onDirtyChange((dirty) => extensionAPI.onDirtyChange(dirty));

    vscode.postMessage("ready");
  }

  readonly file: VSCodeFile;
  private readonly imageAssetMap = observable.map<string, string>();

  @computed get imageAssets(): readonly string[] {
    return Array.from(this.imageAssetMap.keys());
  }

  resolveImageAssetURL(assetPath: string): string {
    return this.imageAssetMap.get(assetPath) ?? assetPath;
  }
}
