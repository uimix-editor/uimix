const { execSync } = require("child_process");

module.exports = {
  hooks: {
    prePackage: async () => {
      execSync("npm run build", { stdio: "inherit" });
    },
  },
  packagerConfig: {},
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
