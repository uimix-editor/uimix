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
    logo: "/logo.svg",
    nav: [{ text: "Guide", link: "/guide/", activeMatch: "^/guide/" }],
    socialLinks: [
      { icon: "github", link: "https://github.com/macaronapp/macaron-next" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
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
