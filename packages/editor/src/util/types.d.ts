declare module "replace-css-url" {
  function replaceCSSURL(
    css: string,
    urlResolver: (url: string) => string
  ): string;

  export = replaceCSSURL;
}

declare module "validate-element-name" {
  function validateElementName(name: string): {
    isValid: boolean;
    message: string;
  };
  export = validateElementName;
}

declare function plausible(
  event: string,
  options: {
    props: Record<string, string>;
  }
): void;
