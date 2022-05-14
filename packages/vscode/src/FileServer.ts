import http from "http";
import { AddressInfo } from "net";
import handler from "serve-handler";
import * as vscode from "vscode";

export class FileServer {
  constructor(rootUri: vscode.Uri) {
    this._server = http.createServer((request, response) => {
      return handler(request, response, {
        public: rootUri.path,
      });
    });
  }

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
}
