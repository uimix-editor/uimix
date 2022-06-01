/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: "Macaron",
  description: "Visual editor for Web Components",

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
              text: "Create Customizable Components",
              link: "/guide/create-customizable-components",
            },
            {
              text: "File Format",
              link: "/guide/file-format",
            },
          ],
        },
      ],
    },
  },
};

export default config;
