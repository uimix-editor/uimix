declare module "replace-css-url" {
  function replaceCSSURL(
    css: string,
    urlResolver: (url: string) => string
  ): string;

  export = replaceCSSURL;
}
