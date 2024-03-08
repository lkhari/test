import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis", //<-- AWS SDK
      },
    },
    include: [
      "@mui/material/Tooltip",
      "@mui/icons-material",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      src: path.resolve(__dirname, "./src"),
    },
  },
});
