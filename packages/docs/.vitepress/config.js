/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: "Macaron",
  description: "Visual editor for Web Components",

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => {
          return tag === "top-page";
        },
      },
    },
  },

  themeConfig: {
    repo: "macaronapp/macaron-next",
    nav: [{ text: "Guide", link: "/guide/", activeMatch: "^/guide/" }],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          children: [
            {
              text: "Getting Started",
              link: "/guide/",
            },
            {
              text: "Interaction & Responsive Design",
              link: "/guide/interaction",
            },
            {
              text: "Assets",
              link: "/guide/assets",
            },
            {
              text: "Create Customizable Components",
              link: "/guide/create-customizable-components",
            },
            {
              text: "File Format",
              link: "/guide/file-format",
            },
            {
              text: "Examples",
              link: "/guide/examples",
            },
          ],
        },
      ],
    },
  },
};

export default config;
