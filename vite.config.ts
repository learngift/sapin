import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
  // https://vite.dev/config/server-options.html#server-proxy
  // server: {
  //   proxy: {
  //     "/api": "http://127.0.0.1:5001", // Redirect API calls to FastAPI
  //   },
  // },
});
