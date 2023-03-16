# UIMix local editor server

This is a local editor server for [UIMix](https://github.com/seanchas116/uimix).
Launch it with `uimix` in your project directory.

```sh
npm install -g uimix
uimix
```

## Usage

```sh
uimix [root directory] --port [port]
```

### [root directory] (optional)

The root directory the editor should open. Defaults to the current directory.

### --port (optional)

The port to listen on. Defaults to 4000.

## Roadmap

- [ ] Add a compiler command that just compiles UIMix code to JS.
- [ ] Add a scaffolding command that creates a new project.

## Develop

### Build

- `pnpm dev` - Start the dev server.
- `pnpm build` - Build the project.
