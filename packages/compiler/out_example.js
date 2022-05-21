export class MyComponent extends HTMLElement {
  constructor() {
    const style = `
      :host {
        display: block;
        color: var(--my-component--color);
      }
    `;

    const template = `
      <h1>Hello World</h1>
    `;

    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${style}</style>${template}`;
  }

  static register() {
    const globalStyle = `
      :root {
        --my-component--color: #ff0000;
      }
    `;
    document.head.appendChild(document.createElement("style")).textContent =
      globalStyle;

    customElements.define("my-component", MyComponent);
  }
}

MyComponent.register();
