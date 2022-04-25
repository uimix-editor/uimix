# Macaron

Macaron is a visual component editor for Web development.

## Goals

### Based on Web standards

Macaron is a design tool built around Web standards (HTML, CSS, and Web Components).

### Freehand design

Draw elements at arbitrary positions on the canvas and add auto layout later.

### Clean file format

Macaron uses an HTML-based clean file format, which is easy to read, modify, and parse.  
The files are designed to be stored in Git repositories, along with other source files.

### Import Web Components

Import existing Web Components and place them in the editor.

### Export to Web Components

Create future-proof components and use them in any project.

### First-class support for React and TypeScript

Macaron can also emit React wrappers for the output Web components. It also generates TypeScript definitions.

## File format (`*.macaron`)

```html
<macaron-component name="my-card">
  <!-- Variants -->

  <macaron-variant x="0" y="0"></macaron-variant>
  <macaron-variant x="200" y="0" selector=":hover"></macaron-variant>
  <macaron-variant
    x="400"
    y="0"
    media-query="(max-width:768px)"
  ></macaron-variant>

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

## Project Structure

- `/editor` - The Macaron Editor
- `/paintkit` - The submodule for the [paintkit](https://github.com/seanchas116/paintkit) library

The project uses the Yarn workspaces.

## Start devservers

```bash
git submodule update --init

# Install dependencies and build libraries
yarn

# Start watching for changes and launch devservers
yarn dev
```

- http://localhost:8080 : [Demo editor](/packages/editor/src/index.tsx)
- http://localhost:7007 : Storybook for paintkit
