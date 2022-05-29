/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: "Macaron",
  description: "Visual editor for Web Components",

  themeConfig: {
    repo: "macaronapp/macaron-next",
    nav: [{ text: "Guide", link: "/", activeMatch: "^/$|^/guide/" }],

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
