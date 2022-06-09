<h1 align="center"><a href="https://macaron-elements.com">Macaron</a></h1>

![Screenshot](packages/vscode/screenshot.png)

Macaron is an open-source design tool to visually create Web Components, [which can be used in most Web frameworks](https://custom-elements-everywhere.com/), or in vanilla HTML/JavaScript.  
It aims to be integrated directly into your development workflow.

* :pen: Easy-to-use visual editor
* :technologist: Runs in Visual Studio Code
* :globe_with_meridians: Framework-agnostic
* :inbox_tray: Import Web Components
* :spiral_notepad: Clean File Format
* :art: Copy-paste from Figma

## Development

### Setup

```bash
# Clone
git clone --recursive git@github.com:macaron-elements/macaron.git

# Install dependencies
yarn

# Build
yarn build
```

### Project Structure

- `/packages/editor` - The Macaron Editor
- `/packages/paintkit` - The submodule for the [paintkit](https://github.com/seanchas116/paintkit) library
- `/packages/vscode` - The VS Code extension that provides Macaron as a custom editor
- `/packages/figma` - The Figma plugin for Macaron
- `/packages/compiler` - The compiler that converts Macaron files to Web Components
- `/packages/loader-vite` - The Vite plugin to import Macaron files directly from JS/HTML
- `/packages/docs` - The documentation

This project uses Yarn Workspaces.

### Start devservers

```bash
yarn dev
```

- http://localhost:3000 : [Demo editor](/packages/editor/src/index.tsx)
- http://localhost:4000 : [Docs](/packages/docs)
- http://localhost:7007 : Storybook for paintkit
- http://localhost:1234 : [Test Project](/packages/test-project)

### Launch VS Code extension

- Make sure `yarn dev` is running
- Open the root directory in VS Code
- Press `F5` (or menu **Run** → **Start Debugging**)

### Test

```bash
yarn test
```
