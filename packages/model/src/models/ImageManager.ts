import { dataURLFromURL, imageFromURL } from "@uimix/foundation/src/utils/Blob";
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
        hash: "",
        width: 0,
        height: 0,
        url: "",
        type: "image/png",
      }
    );
  }

  get hash(): string {
    return this.data.hash;
  }

  get width(): number {
    return this.data.width;
  }

  get height(): number {
    return this.data.height;
  }

  get url(): string {
    return this.data.url;
  }

  get type(): Data.ImageType {
    return this.data.type;
  }

  async getDataURL(): Promise<string> {
    return await dataURLFromURL(this.url);
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

  async insertDataURL(dataURL: string): Promise<Image> {
    return this.insert(await (await fetch(dataURL)).blob());
  }

  async insert(blob: Blob): Promise<Image> {
    const type = Data.ImageType.parse(blob.type);
    const buffer = await blob.arrayBuffer();

    const hash = await getURLSafeBase64Hash(buffer);

    // TODO: index hash
    const existing = this.images.find((image) => image.data.hash === hash);
    if (existing) {
      return existing;
    }

    const uploadImage = this.uploadImage;
    if (!uploadImage) {
      throw new Error("No uploadImage function set");
    }

    const url = await uploadImage(hash, blob.type, new Uint8Array(buffer));
    const imgElem = await imageFromURL(url);

    const image: Data.Image = {
      hash,
      width: imgElem.width,
      height: imgElem.height,
      url,
      type,
    };

    const filePath = `images/${hash}.png`;
    this.data.set(filePath, image);
    return new Image(this, filePath);
  }

  get(filePath: string): Image | undefined {
    const data = this.data.get(filePath);
    if (data) {
      return new Image(this, filePath);
    }
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
          return [hash, (await this.insert(blob)).data] as [string, Data.Image];
        })
      )
    );

    return Object.fromEntries(entries);
  }
}
