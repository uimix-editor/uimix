# Create Customizable Components

You might want to create a component that can be customized. Macaron follows the widely used ways of customizing Web Components.

## Slots

`<slot>` elements are used to customize the partial content of a Web Component. They are placeholders for contents inserted by component instances.

([The MDN Reference](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots) is a good resource for Web Components slots.)

Macaron has a shortcut way to create a `<slot>` element. Select an element and right-click, select **Wrap Contents in Slot** to wrap the children of the selected element in a `<slot>` element.

<img srcset="./images/wrap-contents-in-slots.png 2x" />

(Alternatively, you can instead create a `<slot>` element manually. Create an element and change the tag name to `slot`.)

When you add a child to an instance of the component, it will be shown in place of the `<slot>` children.

<img srcset="./images/slotted-content.png 2x" />

## CSS variables

CSS variables are used to customize the appearance of a component (in addition to providing global design tokens).

### Add a CSS variable (global)

First, deselect everything in the editor. The **Document** tab will be appear in the side bar.
Then click the **+** button of the **CSS Variables** pane.

Please be aware that the CSS variables are global and will affect the whole web page.

<img srcset="./images/add-cssvariable.png 2x" />

### Use the variable in a component

Then use the CSS variable in the component. Click the down arrow on a color input (`color`, `background`, `border-color` etc).

<img srcset="./images/use-cssvariable.png 2x" />

### Override the variable in a instance

The CSS variables used in a component will be overridable in each instance.

Select an instance of the component, choose **Style** tab and scroll to bottom. The input box for the CSS variable will appear.

<img srcset="./images/override-cssvariable.png 2x" />

## Variants with attribute selectors

TODO
