import * as path from "path";
import { UserConfig } from "vite";
import commonConfig from "./vite.config.common";

const config: UserConfig = { ...commonConfig };

config.build.lib = {
  entry: path.resolve(__dirname, "src/webcomponent/main.tsx"),
  name: "webcomponent",
  formats: ["es"],
  fileName: (format) => `webcomponent.${format}.js`,
};

export default config;
