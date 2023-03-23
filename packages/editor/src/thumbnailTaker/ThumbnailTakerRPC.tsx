export interface IRootToThumbnailTakerRPC {
  sync(data: Uint8Array): Promise<void>;
}

export interface IThumbnailTakerToRootRPC {
  ready(): Promise<void>;
  sendScreenshot(data: ArrayBuffer): Promise<void>;
}
