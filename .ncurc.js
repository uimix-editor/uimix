module.exports = {
  target: (dependencyName, parsedVersion) => {
    if (!parsedVersion[0]) {
      return "latest";
    }
    let { semver, version, operator, major, minor, patch, release, build } =
      parsedVersion[0];

    if (major === "0") return "latest";
    return "minor";
  },
};
