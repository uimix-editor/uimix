# Vite Macaron loader

A Vite plugin to load Macaron files as JavaScript modules.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <component-created-in-macaron></component-created-in-macaron>
    <script type="module" src="test.macaron"></script>
  </body>
</html>
```

```js
import "./test.macaron";

const element = document.createElement("component-created-in-macaron");
```

## Install

```bash
npm install @macaron-app/loader-vite --save-dev
```

## Setup

#### `vite.config.js`

```js
import macaronLoader from "@macaron-app/loader-vite";

export default defineConfig({
  plugins: [macaronLoader()],
});
```
