import { IconifyIcon } from "@iconify/react";

export function toIconifyIcon(svg: string): IconifyIcon {
  const body = svg.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "");
  const width = svg.match(/width="(\d+)"/)?.[1];
  const height = svg.match(/height="(\d+)"/)?.[1];

  return {
    body: `<g fill="currentColor">${body}</g>`,
    width: width ? Number.parseInt(width) : undefined,
    height: height ? Number.parseInt(height) : undefined,
  };
}
