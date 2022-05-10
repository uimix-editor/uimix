# The Macaron compiler library and command-line interface

Macaron is a visual React component editor, which is now in [beta testing](https://twitter.com/seanchas_t/status/1486980041674469380).

This library / CLI is the compiler that converts Macaron files to React components.

## Installation

    $ npm install -g @macaron-app/tools

## Usage

### Compile Macaron files to React components

    $ macaron compile src/*.macaron
    # => generates src/*.macaron.js

### Help

    $ macaron help

### API

```js
import { compileFile, compilePage } from "@macaron-app/tools";

compileFile("src/components.macaron");

const contents = fs.readFileSync("src/components.macaron", "utf8");
const json = JSON.parse(contents) as unknown;
compilePage(json); // => { ".macaron.js": ..., ".macaron.d.ts": ... }
```
