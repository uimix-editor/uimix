import http from "http";
import path from "path";
import { AddressInfo } from "net";
import handler from "serve-handler";
import * as vscode from "vscode";

export class FileServer {
  constructor(rootUri: vscode.Uri) {
    this.rootUri = rootUri;
    this._server = http.createServer((request, response) => {
      return handler(request, response, {
        public: rootUri.path,
      });
    });
  }

  readonly rootUri: vscode.Uri;
  private _server: http.Server;
  private _port = 0;

  get port(): number {
    return this._port;
  }

  listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._server.listen(0, () => {
        this._port = (this._server.address() as AddressInfo).port;
        resolve();
      });
    });
  }

  toServerUri(uri: vscode.Uri): vscode.Uri {
    const relativePath = path.posix.relative(this.rootUri.path, uri.path);
    if (relativePath.startsWith("..")) {
      throw new Error("Invalid path");
    }
    if (relativePath === ".") {
      return vscode.Uri.parse(`http://localhost:${this.port}`);
    }
    return vscode.Uri.parse(`http://localhost:${this.port}/${relativePath}`);
  }
}
