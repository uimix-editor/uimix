# Use with React

> [Example Project](https://github.com/macaron-elements/macaron-examples/tree/main/vite-react-ts)

```jsx
import "./components.macaron"; // contains <my-component>

const App = () => {
  return (
    <my-component onClick={() => console.log("clicked")}>Content</my-component>
  );
};
```

### With TypeScript

```tsx
import "./components.macaron"; // contains <my-component>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["my-component"]: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const App = () => {
  return (
    <my-component onClick={() => console.log("clicked")}>Content</my-component>
  );
};
```
