# Assets

You can add assets (images, other components you made, external Web Components etc) to your components from the **Assets** tab in the side bar.

## Components

In the **Components** sub-tab, you can browse the available components.
Drag-drop a component thumbnail onto an element to add it.

The components in the current `.macaron` file will be available by default.

### External Web Components

To make external Web Components available, append `<script>` tags to the `.macaron` file and reopen the editor. (
See [File Format](./file-format) for details.
)

```html
<script type="module" src="./external-web-components.js"></script>
...
```

## Images

In the **Images** sub-tab, all images in the current VS Code workspace will be listed. Drag-drop an image onto an element to add it.
