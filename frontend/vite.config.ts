import { defineConfig } from "vite";
import rpr from "rollup-plugin-replace";
import rpc from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    port: 3000,
    proxy: {
      "/": {
        target: "https://checkuptest.asta.ir/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup-test.ts",
  },
  build: {
    rollupOptions: {
      plugins: [
        //@ts-expect-error
        rpr({
          "process.env.NODE_ENV": JSON.stringify("production"),
        }),
        //@ts-expect-error
        rpc(),
        //@ts-expect-error
        terser(),
      ],
    },
  },
});
