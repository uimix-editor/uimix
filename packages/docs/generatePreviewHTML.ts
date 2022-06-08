import { compile } from "@macaron-app/compiler";

export function generatePreviewHTML(jsOutput: string, html: string): string {
  const previewHTML = `
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Macaron</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Manrope:wght@200..800&family=Lexend:wght@200..800&family=Inconsolata:wght@500&display=swap">
      <style>
        body {
          margin: 0;
          -webkit-font-smoothing: antialiased;
        }
      </style>
    </head>
    <body>
      <script type="module" defer>${jsOutput}</script>
      ${html}
    </body>
  </html>
  `;

  return previewHTML;
}
