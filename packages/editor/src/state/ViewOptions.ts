interface ViewOptions {
  type: "demo" | "embed" | "vscode";
  titleBarPadding: number;
  uiScaling: number;
  fontSize: number;
  layout: "twoColumn" | "threeColumn";
}

declare global {
  interface Window {
    uimixViewOptions?: Partial<ViewOptions>;
  }
}

function getViewOptions(): ViewOptions {
  if (window.uimixViewOptions) {
    return {
      titleBarPadding: 0,
      uiScaling: 1,
      fontSize: 12,
      layout: "threeColumn",
      type: "demo",
      ...window.uimixViewOptions,
    };
  }

  const searchParams = new URLSearchParams(window.location.search);

  const type = (searchParams.get("type") ?? "demo") as ViewOptions["type"];
  const titleBarPadding = Number.parseInt(
    searchParams.get("titleBarPadding") ?? "0"
  );
  const uiScaling = Number.parseFloat(searchParams.get("uiScaling") ?? "1");
  const fontSize = Number.parseFloat(searchParams.get("fontSize") ?? "12");
  const layout = (searchParams.get("layout") ??
    "threeColumn") as ViewOptions["layout"];

  return {
    type,
    titleBarPadding,
    uiScaling,
    fontSize,
    layout,
  };
}

export const viewOptions = getViewOptions();
