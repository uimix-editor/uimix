# File Format

The file format of Macaron files (`.macaron`) is based on HTML and CSS. The benefits are:

- Easy to read and modify for humans.
- Easy to parse and emit programmatically.
- Easy to "eject" - since the data is represented in plain HTML/CSS, you can migrate from Macaron to plain HTML/CSS or other frameworks with little effort.

## Edit `.macaron` files in text editor (VS Code)

If you have installed the VS Code extension for Macaron, VS Code opens `.macaron` files in the visual editor by default.

When you want to edit a `.macaron` file by hand in the text editor, right-click on the file and select **Open With...** and select **Text Editor**.

## Example File

```html
<!-- imports to external Web Components: -->
<script type="module" src="./external-web-components.js"></script>

<!-- Global CSS variables --->
<style>
  :root {
    --my-card--color: red;
  }
</style>

<!-- Components --->
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
      font-size: 24px;
      color: var(--my-card--color);
    }
    #image {
      width: 24px;
      width: 24px;
    }
    #text {
      font-size: 14px;
    }

    :host(:hover) {
      background: #f0f0f0;
    }

    :host(:hover) #title {
      color: red;
    }

    @media (max-width: 768px) {
      #title {
        font-size: 18px;
      }
    }
  </style>
</macaron-component>
<macaron-component name="my-other-component"> ... </macaron-component>
```

## Top-level structure

- `<script type="module">` tags
  - links to scripts that register external Web Components
- A `<style>` tag
  - A `:root` rule
    - global CSS variable declarations
- `<macaron-component>` tags: the components

## `<macaron-component>`

### Attributes

- `name`: the tag name of the component

### Children

#### `<macaron-variant>` tags

The variants of the component. A default variant is always present.

#### A `<template>` tag

The DOM structure of the component.

#### A `<style>` tag

The styles of the component.
Supported selector patterns are as follows (other patterns are ignored):

```css
/* styles for the default variant */
:host {
  /* style of the root element */
}
#title {
  /* style of an inner element */
}

/* styles for a variant with a selector */
:host(:hover) {
  /* style of the root element */
}
:host(:hover) #title {
  /* style of an inner element */
}

/* styles for a variant with a media query */
@media (max-width: 768px) {
  :host {
    /* style of the root element */
  }
  #title {
    /* style of an inner element */
  }
}
```

## `<macaron-variant>`

#### Attributes

- `x`: The horizontal position of the variant in the editor.
- `y`: The vertical position of the variant in the editor.
- `width`: The width of the variant in the editor. (optional)
- `height`: The height of the variant in the editor. (optional)
- `background-color`: The background color of the variant in the editor. (optional)
- `selector`: The selector of the variant. (optional)
  - Example: when the `selector` is set to `:hover`, the variant will be applied when the component (`:host`) is hovered.
- `media`: The media query of the variant. (optional)
  - When the `media` is set, the variant will be applied when the media query is satisfied.

A `<macaron-variant>` without both `selector` and `media` becomes the default variant.
