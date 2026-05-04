import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import path from "path";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: ".",
    base: "",
    plugins: [zaloMiniApp(), react()],
    build: {
      assetsInlineLimit: 0,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, './src/shared'),
      },
    },
  });
};
