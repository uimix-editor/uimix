/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: "Macaron",
  description: "Visual editor for Web Components",

  themeConfig: {
    nav: [{ text: "Guide", link: "/", activeMatch: "^/$|^/guide/" }],
  },
};

export default config;
