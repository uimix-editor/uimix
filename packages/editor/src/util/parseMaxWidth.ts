export function parseMaxWidth(mediaQuery: string): number {
  if (mediaQuery === "") {
    return NaN;
  }

  const match = mediaQuery.match(/max-width:\s*(\d+)px/);
  if (match) {
    return Number.parseInt(match[1]);
  }

  return NaN;
}
