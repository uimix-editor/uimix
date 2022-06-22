# Use with webpack

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
        use: ["@macaron-elements/loader-webpack"],
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
