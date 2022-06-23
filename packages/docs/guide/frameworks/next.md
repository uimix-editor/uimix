# Use with Next.js

> [Example Project](https://github.com/macaron-elements/macaron-examples/tree/main/next)

See also: [Use With React](react.html)

Macaron components can be used with the [Next.js](https://nextjs.org/) framework.

### Configure `next.config.js`

Macaron has [a webpack loader](/guide/build-tools/webpack) to load its files as JavaScript modules.

Configure `next.config.js` to use the loader:

```js
const nextConfig = {
  // ...

  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.macaron/,
      use: [options.defaultLoaders.babel, "@macaron-elements/loader-webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;
```

### Use Macaron components in Next.js pages

```jsx
import "../components/components.macaron";

export default function Home() {
  return (
    <div>
      <my-component onClick={() => console.log("clicked")}>
        Content
      </my-component>
    </div>
  );
}
```
