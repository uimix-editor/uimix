# webpack Macaron loader

[![npm](https://img.shields.io/npm/v/@macaron-elements/loader-webpack)](https://www.npmjs.com/package/@macaron-elements/loader-webpack)

A webpack loader to load [Macaron](https://macaron-elements.com/) files as JavaScript modules.

```js
import "./test.macaron";

const element = document.createElement("component-created-in-macaron");
```

## Install

```bash
npm install @macaron-elements/loader-webpack --save-dev
```

## Setup

#### `webpack.config.js`

```js
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      {
        test: /\.macaron/,
        use: ["@macaron-elements/loader-webpack"],
      },
    ],
  },
};
```
