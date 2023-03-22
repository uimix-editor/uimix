import { imageFromURL } from "../utils/Blob";
import { Project } from "./Project";
import { ObservableYMap } from "../utils/ObservableYMap";
import { Image } from "@uimix/node-data";
import { getURLSafeBase64Hash } from "../utils/Hash";

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

    const hash = await getURLSafeBase64Hash(buffer);

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
