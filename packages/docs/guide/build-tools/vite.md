# Use with Vite

> [Example Project](https://github.com/macaron-elements/macaron-examples/tree/main/vite)

First, install the loader:

```bash
npm install --save-dev @macaron-elements/loader-vite
```

Configure `vite.config.js`:

```js
import { defineConfig } from "vite";
import macaronLoader from "@macaron-elements/loader-vite";

export default defineConfig({
  plugins: [macaronLoader()],
});
```

Import the `.macaron` file directly from HTML:

```html
<script type="module">
  import "./components.macaron";
</script>
<my-component></my-component>
```

or from JS:

```js
import "./components.macaron";
const element = document.createElement("my-component");
```
