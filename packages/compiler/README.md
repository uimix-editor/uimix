# The Macaron compiler library and command-line interface

[![npm](https://img.shields.io/npm/v/@macaron-elements/compiler)](https://www.npmjs.com/package/@macaron-elements/compiler)

This library / CLI is the compiler that converts [Macaron](https://macaron-elements.com/) files to Web Components.

## Installation

```bash
npm install -g @macaron-elements/compiler
```

## Usage

```bash
# compile to src/*.js
macaron src/*.macaron

# compile to src/*.js and watches for changes
macaron --watch src/*.macaron

# compile to dist/*.js
macaron --output=dist src/*.macaron
```

```
macaron [options] <file paths or glob pattern>
```

| Option       | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| --watch      | Watch for changes and re-generate the component.                |
| -o, --output | Output directory. Defaults to the parent directory of the input |

## Help

```bash
macaron help
```

## API

```js
import { compile } from "@macaron-elements/compiler";

const data = fs.readFileSync("src/test.macaron", "utf-8");
const out = compile(data);
fs.writeFileSync("src/test.js", out);
```
