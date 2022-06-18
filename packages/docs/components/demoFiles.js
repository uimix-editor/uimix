import dedent from "dedent";
import basicMacaronFile from "../examples/basic.macaron?raw";
import interactionsMacaronFile from "../examples/interactions.macaron?raw";
import responsiveMacaronFile from "../examples/responsive.macaron?raw";

export const demoFiles = [
  {
    name: "Basic",
    content: basicMacaronFile,
    html: dedent`
      <script type="module" src="output.js"></script>
      <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
      <my-component>
        <span slot="heading">
          Design tool to create Web Components visually
        </span>
        <span slot="description">
          Macaron is an open-source UI design tool to create and maintain Web Components.
          Create components visually and use them with or without any framework.
        </span>
      </my-component>`,
  },
  {
    name: "Interactions",
    content: interactionsMacaronFile,
    html: dedent`
      <script type="module" src="output.js"></script>
      <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        my-button {
          margin: 16px;
        }
      </style>
      <my-button>Button</my-button>
      <my-button type="secondary">Button</my-button>
    `,
  },
  {
    name: "Responsive Design",
    content: responsiveMacaronFile, // TODO
    html: dedent`
      <script type="module" src="output.js"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        img {
          max-width: 100%;
          height: auto;
        }
        body {
          font-family: "Inter";
        }
        .splitter-info {
          padding: 1em;
          color: gray;
          font-size: 12px;
        }
      </style>
      <div class="splitter-info">
        ← Move this splitter to see the responsive behavior
      </div>
      <hotel-card>
        <img slot="thumb" src="https://source.unsplash.com/0sSJMTfLXUI"/>
        <span slot="name">Moonlight Hotel & Spa</span>
        <span slot="rating">4</span>
        <span slot="price">$299</span>
      </hotel-card>
      <hotel-card>
        <img slot="thumb" src="https://source.unsplash.com/58ApUELd3Ec"/>
        <span slot="name">Autumn Cottage Hotel</span>
        <span slot="rating">4</span>
        <span slot="price">$199</span>
      </hotel-card>
    `,
  },
];
