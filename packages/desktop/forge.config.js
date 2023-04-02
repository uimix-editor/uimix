const { execSync } = require("child_process");

module.exports = {
  hooks: {
    prePackage: async () => {
      execSync("npm run build", { stdio: "inherit" });
    },
  },
  packagerConfig: {
    name: process.env.NODE_ENV === "development" ? "UIMix Dev" : "UIMix",
    extendInfo: "Info.plist",
    icon: "./src/icon/icon",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        authToken: require("./forge.secrets.json").githubToken,
        repository: {
          owner: "uimix-editor",
          name: "uimix",
        },
        prerelease: true,
      },
    },
  ],
};
