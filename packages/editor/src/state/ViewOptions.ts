interface ViewOptions {
  embed: boolean;
  titleBarPadding: number;
  uiScaling: number;
  fontSize: number;
  narrowMode: boolean;
  vscode: boolean;
}

declare global {
  interface Window {
    uimixViewOptions?: Partial<ViewOptions>;
  }
}

function getViewOptions(): ViewOptions {
  if (window.uimixViewOptions) {
    return {
      embed: false,
      titleBarPadding: 0,
      uiScaling: 1,
      fontSize: 12,
      narrowMode: false,
      vscode: false,
      ...window.uimixViewOptions,
    };
  }

  const searchParams = new URLSearchParams(window.location.search);

  const embed = searchParams.get("embed") === "true";
  const titleBarPadding = Number.parseInt(
    searchParams.get("titleBarPadding") ?? "0"
  );
  const uiScaling = Number.parseFloat(searchParams.get("uiScaling") ?? "1");
  const fontSize = Number.parseFloat(searchParams.get("fontSize") ?? "12");
  const narrowMode = searchParams.get("narrowMode") === "true";

  return {
    embed,
    titleBarPadding,
    uiScaling,
    fontSize,
    narrowMode,
    vscode: false,
  };
}

export const viewOptions = getViewOptions();
