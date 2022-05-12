# The Macaron compiler library and command-line interface

This library / CLI is the compiler that converts Macaron files to Web Components.

## Installation

    $ npm install -g @macaron-app/compiler

## Usage

```bash
# generates src/*.macaron.js
macaron src/*.macaron

# generates src/*.macaron.js and watches for changes
macaron --watch src/*.macaron

# Image paths in the output will be relative to ./public
# (the default value of publicPath is ".")
macaron --publicPath=./public src/*.macaron
```

### `publicPath` option

`.macaron` files stores image paths (`<img src="...">` and CSS `url(...)`) relative to the containing directory.

If you want the image paths in the output to be relative to some other directory, use the `publicPath` option.

#### src/test.macaron

```html
...
<!-- relative from the directory (same as in import statements of ES modules) -->
<img src="../public/image.png" />
...
```

#### Command

```bash
macaron --publicPath=./public src/test.macaron
```

#### The output

```js
const template = `
...
<!-- relative from publicPath -->
<img src="image.png" />
...
`;
```

## Help

```bash
macaron help
```

### API

TBD
