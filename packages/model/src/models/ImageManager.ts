import { blobToDataURL, imageFromURL } from "@uimix/foundation/src/utils/Blob";
import { Project } from "./Project";
import { ObservableYMap } from "@uimix/foundation/src/utils/ObservableYMap";
import { Image, ImageType } from "../data/v1";
import { getURLSafeBase64Hash } from "@uimix/foundation/src/utils/Hash";
import { compact } from "lodash-es";

export class ImageManager {
  constructor(project: Project) {
    this.project = project;
  }

  readonly project: Project;
  get images(): ObservableYMap<Image> {
    return ObservableYMap.get(this.project.data.images);
  }

  uploadImage?: (
    hash: string,
    contentType: string,
    data: Uint8Array
  ) => Promise<string>;

  async insert(blob: Blob): Promise<[string, Image]> {
    const type = ImageType.parse(blob.type);
    const buffer = await blob.arrayBuffer();

    const hash = await getURLSafeBase64Hash(buffer);

    const existing = this.images.get(hash);
    if (existing) {
      return [hash, existing];
    }

    const uploadImage = this.uploadImage;
    if (!uploadImage) {
      throw new Error("No uploadImage function set");
    }

    const url = await uploadImage(hash, blob.type, new Uint8Array(buffer));
    const imgElem = await imageFromURL(url);

    const image: Image = {
      width: imgElem.width,
      height: imgElem.height,
      url,
      type,
    };

    this.images.set(hash, image);
    return [hash, image];
  }

  get(hashBase64: string): Image | undefined {
    return this.images.get(hashBase64);
  }

  async getWithDataURL(hashBase64: string): Promise<Image | undefined> {
    const image = this.get(hashBase64);
    if (!image) {
      return;
    }
    const response = await fetch(image.url);
    const blob = await response.blob();
    const dataURL = await blobToDataURL(blob);
    return {
      ...image,
      url: dataURL,
    };
  }

  has(hashBase64: string): boolean {
    return this.images.has(hashBase64);
  }

  async uploadImages(
    images: Record<string, Image>
  ): Promise<Record<string, Image>> {
    const uploadImage = this.uploadImage;
    if (!uploadImage) {
      throw new Error("No uploadImage function set");
    }

    const entries = compact(
      await Promise.all(
        Object.entries(images).map(async ([hash, image]) => {
          if (this.has(hash)) {
            return;
          }
          const blob = await fetch(image.url).then((res) => res.blob());
          return await this.insert(blob);
        })
      )
    );

    return Object.fromEntries(entries);
  }
}
