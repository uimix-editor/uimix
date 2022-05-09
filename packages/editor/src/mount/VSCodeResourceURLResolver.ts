import { observable, runInAction } from "mobx";

// VS Code resource URLs are not accessible from the iframe, so we need to fetch them manually and generate object URLs.
// TODO: revoke the object URL when the resource is no longer used
export class VSCodeResourceURLResolver {
  private readonly urls = observable.map<string, string>();
  private readonly pending = new Map<string, Promise<string>>();

  resolve(src: string): string | undefined {
    if (!src.startsWith("https://file%2B.vscode-resource.vscode-cdn.net/")) {
      return src;
    }

    const cached = this.urls.get(src);
    if (cached) {
      return cached;
    }
    const pending = this.pending.get(src);
    if (pending) {
      return;
    }

    const promise = (async () => {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      runInAction(() => {
        this.urls.set(src, url);
      });
      this.pending.delete(src);
      return url;
    })();
    this.pending.set(src, promise);
  }

  static readonly instance = new VSCodeResourceURLResolver();
}
