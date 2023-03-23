export interface IRootToScreenshotTakerRPC {
  sync(data: Uint8Array): Promise<void>;
}

export interface IScreenshotTakerToRootRPC {
  ready(): Promise<void>;
  sendScreenshot(data: ArrayBuffer): Promise<void>;
}
