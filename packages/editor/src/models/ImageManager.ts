import { imageFromURL } from "../utils/Blob";
import { Buffer } from "buffer";
import { encode } from "url-safe-base64";
import { Project } from "./Project";
import { ObservableYMap } from "../utils/ObservableYMap";
import { Image } from "@uimix/node-data";

export class ImageManager {
  constructor(project: Project) {
    this.project = project;
  }

  readonly project: Project;
  get images(): ObservableYMap<Image> {
    return ObservableYMap.get(this.project.doc.getMap("images"));
  }

  uploadImage?: (
    hash: string,
    contentType: string,
    data: Uint8Array
  ) => Promise<string>;

  async insert(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();

    // get hash of blob
    const hashData = await crypto.subtle.digest("SHA-256", buffer);
    const hash = encode(Buffer.from(hashData).toString("base64"));

    if (this.images.has(hash)) {
      return hash;
    }

    const uploadImage = this.uploadImage;
    if (!uploadImage) {
      throw new Error("No uploadImage function set");
    }

    const url = await uploadImage(hash, blob.type, new Uint8Array(buffer));
    const img = await imageFromURL(url);

    this.images.set(hash, {
      width: img.width,
      height: img.height,
      url,
    });

    return hash;
  }

  get(hashBase64: string): Image | undefined {
    return this.images.get(hashBase64);
  }

  has(hashBase64: string): boolean {
    return this.images.has(hashBase64);
  }
}
