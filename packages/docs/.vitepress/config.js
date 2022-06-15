/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: "Macaron",
  description:
    "Open-source visual editor to create and maintain Web Components",
  head: [
    ["meta", { property: "twitter:card", content: "summary" }],
    [
      "meta",
      { property: "og:image", content: "https://macaron-elements.com/ogp.jpg" },
    ],
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "script",
      {
        defer: "",
        "data-domain": "macaron-elements.com",
        src: "https://plausible.io/js/plausible.js",
      },
    ],
    // [
    //   "script",
    //   {
    //     defer: "",
    //     "data-domain": "macaron-elements.com",
    //     src: "https://plausible.io/js/script.exclusions.local.js",
    //   },
    // ],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;600;700&display=swap",
      },
    ],
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
          text: "Introduction",
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
              text: "Examples",
              link: "/guide/examples",
            },
          ],
        },
        {
          text: "Framework Integration",
          items: [
            {
              text: "Use with React",
              link: "/guide/use-with-react",
            },
            {
              text: "Use with Vue",
              link: "/guide/use-with-vue",
            },
          ],
        },
        {
          text: "Advanced",
          items: [
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
