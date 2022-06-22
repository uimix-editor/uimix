<h1 align="center"><a href="https://macaron-elements.com">Macaron</a></h1>

![Screenshot](packages/vscode/screenshot.png)

[![](https://vsmarketplacebadge.apphb.com/version/Macaron.macaron-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=Macaron.macaron-vscode) 
![example workflow](https://github.com/macaron-elements/macaron/actions/workflows/node.js.yml/badge.svg)
[![Pulls](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/macaron-elements/macaron/pulls)
[![Chat on Discord](https://img.shields.io/badge/chat-Discord-7289DA?logo=discord)](https://discord.gg/WGk6Mx8qTK)
[![Twitter Follow](https://img.shields.io/twitter/follow/macaron_editor?style=social)](https://twitter.com/macaron_editor)

Macaron is an open-source design tool to visually create Web Components, [which can be used in most Web frameworks](https://custom-elements-everywhere.com/), or in vanilla HTML/JavaScript.

Its goal is to allow you to create and continuously maintain components visually, and make Web frontend development easier and more fun.

- :pen: Easy-to-use visual editor
- :technologist: Runs in Visual Studio Code
- :globe_with_meridians: Framework-agnostic
- :inbox_tray: Import Web Components
- :spiral_notepad: Clean File Format
- :art: Copy-paste from Figma (WIP)

## Demo

- See [the Website](https://macaron-elements.com).

## Usage

- See [the guide](https://macaron-elements.com/guide).

## Development

### Setup

```bash
# Clone
git clone --recursive git@github.com:macaron-elements/macaron.git

cd macaron

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
- `/packages/docs` - The Website and documentation

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
- Press <kbd>F5</kbd> (or menu **Run** → **Start Debugging**)

### Test

```bash
yarn test

# Update snapshots
yarn test -u
```

### Release a new version

#### Version bump

```bash
yarn run version # this runs `lerna version --conventional-commits`
```

#### Publish NPM packages

```bash
yarn build
cd packages/compiler
yarn publish
cd ../..
cd packages/loader-vite
yarn publish
```

#### Publish the VS Code extension

> [Log in to vsce](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) before publish

```bash
yarn build
cd packages/vscode
yarn vsce publish
```
## Analytics

Macaron uses [Plausible](https://plausible.io/) to collect anonymous analytics data.

### Dashboards

- [Website](https://plausible.io/macaron-elements.com)
- [VS Code custom editor](https://plausible.io/vscode.macaron-elements.com)
