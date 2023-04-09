interface ViewOptions {
  embed: boolean;
  titleBarPadding: number;
  remSize: number;
  fontSize: number;
  narrowMode: boolean;
}

function getViewOptions(): ViewOptions {
  const searchParams = new URLSearchParams(window.location.search);

  const embed = searchParams.get("embed") === "true";
  const titleBarPadding = Number.parseInt(
    searchParams.get("titleBarPadding") ?? "0"
  );
  const remSize = Number.parseInt(searchParams.get("remSize") ?? "16");
  const fontSize = Number.parseInt(searchParams.get("fontSize") ?? "12");
  const narrowMode = searchParams.get("narrowMode") === "true";

  return {
    embed,
    titleBarPadding,
    remSize,
    fontSize,
    narrowMode,
  };
}

export const viewOptions = getViewOptions();
