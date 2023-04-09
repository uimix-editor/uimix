interface ViewOptions {
  embed: boolean;
  titleBarPadding: number;
  uiScaling: number;
  fontSize: number;
  narrowMode: boolean;
}

function getViewOptions(): ViewOptions {
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
  };
}

export const viewOptions = getViewOptions();
