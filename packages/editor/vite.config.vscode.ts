import * as path from "path";
import { UserConfig } from "vite";
import commonConfig from "./vite.config.common";

const config: UserConfig = { ...commonConfig };

config.build.lib = {
  entry: path.resolve(__dirname, "src/vscode/main.tsx"),
  name: "vscode",
  formats: ["es"],
  fileName: (format) => `vscode.${format}.js`,
};

export default config;
