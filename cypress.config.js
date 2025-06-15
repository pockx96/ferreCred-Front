const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      API_URL: "http://localhost:80/ferreCred-Backend/",
      VERSION: "1.0.0",
      USER_NAME: "ana@example.com",
      DEPLOY_URL: "http://localhost:8080",
    },
  },
});
