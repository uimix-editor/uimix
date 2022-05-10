const style = `
  :host {
    display: block;
  }
`;

const template = `
  <h1>Hello World</h1>
`;

export class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${style}</style>${template}`;
  }
}

customElements.define("my-component", MyComponent);
