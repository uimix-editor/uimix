import { blobToDataURL, imageFromURL } from "@uimix/foundation/src/utils/Blob";
import { Project } from "./Project";
import { ObservableYMap } from "@uimix/foundation/src/utils/ObservableYMap";
import * as Data from "../data/v1";
import { getURLSafeBase64Hash } from "@uimix/foundation/src/utils/Hash";
import { compact } from "lodash-es";

export class Image {
  constructor(manager: ImageManager, filePath: string) {
    this.manager = manager;
    this.filePath = filePath;
  }

  get data(): Data.Image {
    return (
      this.manager.project.data.images.get(this.filePath) ?? {
        width: 0,
        height: 0,
        url: "",
        type: "image/png",
      }
    );
  }

  readonly manager: ImageManager;
  readonly filePath: string;
}

export class ImageManager {
  constructor(project: Project) {
    this.project = project;
  }

  readonly project: Project;
  get data(): ObservableYMap<Data.Image> {
    return ObservableYMap.get(this.project.data.images);
  }

  get images(): Image[] {
    const paths = [...this.data.keys()];
    return paths.map((path) => new Image(this, path));
  }

  uploadImage?: (
    hash: string,
    contentType: string,
    data: Uint8Array
  ) => Promise<string>;

  async insertDataURL(dataURL: string): Promise<[string, Data.Image]> {
    return this.insert(await (await fetch(dataURL)).blob());
  }

  async insert(blob: Blob): Promise<[string, Data.Image]> {
    const type = Data.ImageType.parse(blob.type);
    const buffer = await blob.arrayBuffer();

    const hash = await getURLSafeBase64Hash(buffer);

    const existing = this.data.get(hash);
    if (existing) {
      return [hash, existing];
    }

    const uploadImage = this.uploadImage;
    if (!uploadImage) {
      throw new Error("No uploadImage function set");
    }

    const url = await uploadImage(hash, blob.type, new Uint8Array(buffer));
    const imgElem = await imageFromURL(url);

    const image: Data.Image = {
      width: imgElem.width,
      height: imgElem.height,
      url,
      type,
    };

    this.data.set(hash, image);
    return [hash, image];
  }

  get(hashBase64: string): Data.Image | undefined {
    return this.data.get(hashBase64);
  }

  async getWithDataURL(hashBase64: string): Promise<Data.Image | undefined> {
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
    return this.data.has(hashBase64);
  }

  async uploadImages(
    images: Record<string, Data.Image>
  ): Promise<Record<string, Data.Image>> {
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
