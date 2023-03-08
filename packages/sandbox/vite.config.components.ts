import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // disable refresh of all components
  // otherwise "Error: @vitejs/plugin-react can't detect preamble. Something is wrong." is thrown
  plugins: [react({ exclude: "**/*" })],
});
