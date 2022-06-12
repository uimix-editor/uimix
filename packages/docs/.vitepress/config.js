/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: "Macaron",
  description:
    "Open-source visual editor to create and maintain Web Components",
  head: [
    ["meta", { property: "og:image", content: "/ogp.png" }],
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ],

  appearance: false,

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith("macaron-"),
      },
    },
  },

  themeConfig: {
    logo: "/logo.svg",
    nav: [{ text: "Guide", link: "/guide/", activeMatch: "^/guide/" }],
    socialLinks: [
      { icon: "github", link: "https://github.com/macaron-elements/macaron" },
      { icon: "discord", link: "https://discord.gg/WGk6Mx8qTK" },
      { icon: "twitter", link: "https://twitter.com/macaron_editor" },
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
