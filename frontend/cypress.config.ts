import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      ROOT: "http://localhost:3000",
    },
    baseUrl: "https://checkuptest.asta.ir/",
  },
});
