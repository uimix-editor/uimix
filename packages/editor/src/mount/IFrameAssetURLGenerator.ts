export class IFrameAssetURLGenerator {
  get(url: string): string | undefined {
    return this.urls.get(url);
  }

  readonly urls = new Map<string, string>();

  async generate(src: string): Promise<string> {
    if (this.urls.has(src)) {
      return this.urls.get(src)!;
    }
    console.log(src);
    const response = await fetch(src);
    const blob = await response.blob();
    console.log(blob);

    const url = URL.createObjectURL(blob);
    this.urls.set(src, url);
    return url;
  }
}
