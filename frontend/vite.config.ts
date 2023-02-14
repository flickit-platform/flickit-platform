import { defineConfig } from "vite";
import path from "path";
import rpr from "rollup-plugin-replace";
import rpc from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@/",
        replacement: `${path.resolve(__dirname, "src")}/`,
      },
      {
        find: "@components",
        replacement: `${path.resolve(__dirname, "src/components")}/`,
      },
      {
        find: "@shared",
        replacement: `${path.resolve(__dirname, "src/components/shared")}/`,
      },
      {
        find: "@utils",
        replacement: `${path.resolve(__dirname, "src/utils")}/`,
      },
      {
        find: "@service",
        replacement: `${path.resolve(__dirname, "src/service")}/`,
      },
      {
        find: "@providers",
        replacement: `${path.resolve(__dirname, "src/providers")}/`,
      },
      {
        find: "@styles",
        replacement: `${path.resolve(__dirname, "src/config/styles.ts")}/`,
      },
      {
        find: "@constants",
        replacement: `${path.resolve(__dirname, "src/config/constants.ts")}/`,
      },
      {
        find: "@types",
        replacement: `${path.resolve(__dirname, "src/types.ts")}/`,
      },
      {
        find: "@assets",
        replacement: `${path.resolve(__dirname, "src/assets")}/`,
      },
      {
        find: "@config",
        replacement: `${path.resolve(__dirname, "src/config")}/`,
      },
      {
        find: /^@mui\/icons-material\/(.*)/,
        replacement: "@mui/icons-material/esm/$1",
      },
    ],
  },
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
