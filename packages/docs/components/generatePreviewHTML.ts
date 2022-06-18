import { compile } from "@macaron-elements/compiler";

export function generatePreviewHTML(jsOutput: string, html: string): string {
  const previewHTML = `
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Macaron</title>
      <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          -webkit-font-smoothing: antialiased;
        }
      </style>
    </head>
    <body>
      <script type="module" defer>${jsOutput}</script>
      ${html.replace('<script type="module" src="output.js"></script>', "")}
    </body>
  </html>
  `;

  return previewHTML;
}
