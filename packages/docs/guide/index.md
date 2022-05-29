# Getting Started

## Overview

Macaron is an open-source Web design tool to create and maintain components visually
where you can create production components just like in vector design tools.

It primarily emits Web Components, [which can be used in most frameworks](https://custom-elements-everywhere.com/).

Unlike other Web design tools, Macaron aims to be integrated directly into your existing codebase and development workflow.

## Install the VS Code Extension

Macaron provides a custom editor extension for Visual Studio Code. It enables you to use the Macaron editor in Visual Studio Code tabs.

The extension is currently in beta and not yet published to the marketplace. Instead you can install it manually:

<!-- TODO: link -->

- <a href="/artifacts/macaron-vscode-extension-0.2.0.vsix" download>Download the extension</a>
- Install the extension via **Install from VSIX...** menu in the extension workbench

## Create a simple component

TODO

## Compile to JS

`@macaron-app/compiler` provides a CLI that compiles Macaron files to JavaScript.

Install it and compile the component:

```bash
npm install -g @macaron-app/compiler
macaron components.macaron #=> emits components.js
```

Then, you can load the component in HTML:

```html
<script type="module" src="components.js"></script>
<my-component></my-component>
```

## Use with Vite

If you are using Vite, you can configure Vite to use a loader for Macaron (`@macaron-app/loader-vite`) to import `.macaron` files directly from your HTML and JS files.

First, install the loader:

```bash
npm install --save-dev @macaron-app/loader-vite
```

Configure `vite.config.js`:

```js
import { defineConfig } from "vite";
import macaronLoader from "@macaron-app/loader-vite";

export default defineConfig({
  plugins: [macaronLoader()],
});
```

Import the `.macaron` file directly from HTML:

```html
<script type="module" src="components.macaron"></script>
<my-component></my-component>
```

or from JS:

```js
import "./test.macaron";
const element = document.createElement("my-component");
```

## Use with Webpack

The Webpack loader for Macaron is not yet available.
