import React from "react";

function getGoogleFontLink(fontFamilies: string[]): string {
  const query = fontFamilies
    .map((family) => {
      return `family=${family
        .split(/\s/)
        .join("+")}:wght@100;200;300;400;500;600;700;800;900`;
    })
    .join("&");

  return `https://fonts.googleapis.com/css2?${query}`;
}

export const FontLoadLink: React.FC<{
  fonts: string[];
}> = function FontLoadLink({ fonts }) {
  return (
    <link
      href={getGoogleFontLink(fonts)}
      rel="stylesheet"
      crossOrigin="anonymous"
    />
  );
};
