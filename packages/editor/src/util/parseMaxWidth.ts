export function parseMaxWidth(mediaQuery: string): number {
  if (mediaQuery === "") {
    return Infinity;
  }

  const match = mediaQuery.match(/max-width:\s*(\d+)px/);
  if (match) {
    return Number.parseInt(match[1], 10);
  }

  return Infinity;
}
