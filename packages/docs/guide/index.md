# Getting Started

## Overview

Macaron is an open-source design tool to visually create Web Components, [which can be used in most frameworks](https://custom-elements-everywhere.com/).

Unlike most Web design tools, Macaron aims to be integrated directly into your development workflow. It runs in VS Code as a custom editor and uses HTML/CSS-based file format that can be stored in a Git repository.

## Install the VS Code Extension

Macaron provides a custom editor extension for Visual Studio Code. It enables you to use the Macaron editor in Visual Studio Code tabs.

<a href="https://marketplace.visualstudio.com/items?itemName=Macaron.macaron-vscode" target="_blank">
<macaron-hero-button>
Get VS Code Extension
</macaron-hero-button>
</a>

## Create a Macaron file

In VS Code, create an empty file with the extension `.macaron` (e.g. `components.macaron`) and open it.

The editor UI of Macaron is shown in a tab instead of the normal text editor of VS Code.

<img srcset="./images/create-macaron-file.png 2x" />

## Create a simple component

Click **Text** button in the top toolbar and draw a frame in the viewport.

It creates a component named `my-component` with some text content.

<img srcset="./images/create-component.png 2x" />

You may want to change the font or the color of the text. Select **Style** tab in the side bar and you can edit the style.

<img srcset="./images/edit-style.png 2x" />

## Compile to JS

`@macaron-elements/compiler` provides a CLI that compiles Macaron files to JavaScript.

Install it and compile the component:

```bash
npm install -g @macaron-elements/compiler
macaron components.macaron #=> emits components.js
```

It emits a zero-dependency JavaScript module that registers the component.

Then, you can load the component in HTML:

```html
<script type="module" src="components.js"></script>
<my-component></my-component>
```

## Import `.macaron` file directly (Vite / webpack)

If you are using Vite or webpack, you can import `.macaron` files directly by installing loaders for Macaron.

### Vite

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

### webpack

> [Example Project](https://github.com/macaron-elements/macaron-examples/tree/main/webpack)

Install the loader for Webpack:

```bash
npm install --save-dev @macaron-elements/loader-webpack
```

Configure `webpack.config.js`:

```js
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      {
        test: /\.macaron/,
        use: ["macaron-loader"],
      },
    ],
  },
};
```

Use in JS:

```js
import "./components.macaron";
const element = document.createElement("my-component");
```
