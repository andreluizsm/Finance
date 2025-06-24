const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.js",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    env: {
      API_URL: "http://localhost:8080/api",
      TEST_USER_EMAIL: "joao@email.com",
      TEST_USER_PASSWORD: "123456",
      TEST_USER_NAME: "Test User",
    },

    setupNodeEvents(on, config) {
      return config;
    },
  },
});