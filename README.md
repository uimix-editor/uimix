# Macaron

Macaron is an open-source Web design tool to create and maintain components visually
where you can create production components just like in vector design tools.

It primarily emits Web Components (which can be used from most frameworks) and generates React wrappers.

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
        Draw elements at arbitrary positions on the canvas and add layout later.
      </td>
      <td>
        Import existing designs from Figma by copy-paste using the Macaron
        plugin for Figma.
      </td>
      <td>
        Custom editor extension for Visual Studio
        Code.<br />
        No need to install another app or open another browser tab.
      </td>
      <td>
        HTML-based clean file format (easy to read, modify, parse).
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
      <td>Import existing Web Components and place them in the editor.</td>
      <td>
        Create future-proof components and use them with any frameworks (or
        without frameworks).
      </td>
      <td>
        Emit React wrappers and TypeScript definitions for the output Web
        components.
      </td>
    </tr>
  </tbody>
</table>

## Roadmap

- [Roadmap](https://github.com/macaronapp/macaron-next/projects/1)

## File format (`*.macaron`)

```html
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

## Load `.macaron` file

```bash
macaron compile components.macaron #=> components.js
```

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

The project uses the Yarn workspaces.

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
