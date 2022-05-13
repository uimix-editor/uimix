# The Macaron compiler library and command-line interface

This library / CLI is the compiler that converts Macaron files to Web Components.

## Installation

```bash
npm install -g @macaron-app/compiler
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

TBD
