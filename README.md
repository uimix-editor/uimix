# Macaron

Macaron is an open-source Web design tool to create and maintain components visually
where you can create production components just like in vector design tools.

It primarily emits Web Components, [which can be used in most frameworks](https://custom-elements-everywhere.com/).

Unlike other Web design tools, Macaron is intended to be integrated into your existing codebase and development workflow.

## Goals

<table>
  <thead>
    <tr>
      <th>:pen: Freehand design</th>
      <th>:art: Import from Figma</th>
      <th>:technologist: Run in VS Code</th>
      <th>:spiral_notepad: Clean file format</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Create components in the same experience as popular design tools. <br>
        Draw elements at arbitrary positions and auto-layout them later.
      </td>
      <td>
        :construction: Copy layers in Figma and paste them in Macaron (preserving auto layouts) with our Figma plugin for Macaron.
      </td>
      <td>
        Custom editor extension for Visual Studio Code.<br />
        No need to install another app or open another browser tab.
      </td>
      <td>
        HTML-based clean file format.<br>
        Easy to read and edit for humans, and easy to be parsed in tools.
      </td>
    </tr>
  </tbody>
  <thead>
    <tr>
      <th>:globe_with_meridians: Based on Web standards</th>
      <th>:inbox_tray: Import Web Components</th>
      <th>:outbox_tray: Export to Web Components</th>
      <th>:atom_symbol: React and TypeScript support</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Macaron is a design tool built around Web standards (HTML, CSS, and Web
        Components).
      </td>
      <td>:construction: Import existing Web Components and place them in the editor.</td>
      <td>
        Create future-proof components and use them with any frameworks (or
        without frameworks).
      </td>
      <td>
        :construction: Emit React wrappers and TypeScript definitions for the output Web
        components.
      </td>
    </tr>
  </tbody>
</table>

_:construction: - Not yet implemented_

## Roadmap

- Editing
  - [x] Basic HTML/CSS editing
  - [ ] CSS grids
- Exporting
  - [x] Export Web Components
    - [ ] Expose inner elements' properties and events
  - [ ] Export React wrappers
  - [ ] Export TypeScript definitions
- Importing
  - [x] Use components in the same file
  - [x] Import third-party Web Components
- VS Code integration
  - [x] Macaron as a custom editor
- Figma integration
  - [ ] Import existing designs from Figma
- Loaders for build tools
  - [ ] Webpack
  - [ ] Vite

## File format (`*.macaron`)

```html
<!-- imports to external Web Components: -->
<link rel="stylesheet" href="./external-web-components-styles.css" />
<script type="module" src="./external-web-components.js"></script>

<macaron-component name="my-card">
  <!-- Variants -->

  <macaron-variant x="0" y="0"></macaron-variant>
  <macaron-variant x="200" y="0" selector=":hover"></macaron-variant>
  <macaron-variant x="400" y="0" media="(max-width: 768px)"></macaron-variant>

  <!-- DOM structure -->

  <template>
    <h1 id="title">Hello, world!</h1>
    <img id="image" />
    <p id="text"><slot></slot></p>
  </template>

  <!-- Styles -->

  <style>
    #title {
      /* style */
    }
    #image {
      /* style */
    }
    #text {
      /* style */
    }

    /* styles for variants */
    :host(:hover) #title {
      /* style */
    }

    @media (max-width: 768px) {
      #title {
        /* style */
      }
    }
  </style>
</macaron-component>

<macaron-component>
  <!-- A file can contain multiple components -->
  ...
</macaron-component>
```

## Usage

### Compile

[Detailed instructions](packages/compiler/README.md)

```bash
macaron components.macaron #=> components.js
```

### Import in HTML

```html
<!-- Load the component -->
<script type="module" src="components.js"></script>

<!-- Use the component -->
<my-card>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</my-card>
```

## Development

### Project Structure

- `/packages/editor` - The Macaron Editor
- `/packages/paintkit` - The submodule for the [paintkit](https://github.com/seanchas116/paintkit) library
- `/packages/vscode` - The VS Code extension that provides Macaron as a custom editor
- `/packages/compiler` - The compiler that converts Macaron files to Web Components

This project uses Yarn Workspaces.

### Start devservers

```bash
git submodule update --init

# Install dependencies and build libraries
yarn

# Start watching for changes and launch devservers
yarn dev
```

- http://localhost:8080 : [Demo editor](/packages/editor/src/index.tsx)
- http://localhost:7007 : Storybook for paintkit

### Launch VS Code extension

- Make sure `yarn dev` is running
- Open the root directory in VS Code
- Press `F5` (or menu **Run** → **Start Debugging**)
