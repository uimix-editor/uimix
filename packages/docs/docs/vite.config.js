import { defineConfig } from "vite";
import macaronLoader from "@macaron-app/loader-vite";

console.log("vite config");

export default defineConfig({
  plugins: [macaronLoader()],
});
