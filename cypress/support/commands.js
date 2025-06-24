// Comando para login
Cypress.Commands.add("login", (email, password) => {
  cy.visit("/")
  cy.get('#email').type(email || Cypress.env("TEST_USER_EMAIL"))
  cy.get('#password').type(password || Cypress.env("TEST_USER_PASSWORD"))
  cy.get("button[type='submit']").click()
  cy.url().should("include", "/dashboard")
})

// Comando para logout
Cypress.Commands.add("logout", () => {
  cy.get('[data-cy="user-menu"]').click()
  cy.get('[data-cy="logout-button"]').click()
  cy.url().should("include", "/login")
})

// Comando para criar usuário de teste
Cypress.Commands.add("createTestUser", () => {
  cy.visit("/register")
  cy.get('[data-cy="name-input"]').type(Cypress.env("TEST_USER_NAME"))
  cy.get('[data-cy="email-input"]').type(Cypress.env("TEST_USER_EMAIL"))
  cy.get('[data-cy="password-input"]').type(Cypress.env("TEST_USER_PASSWORD"))
  cy.get('[data-cy="register-button"]').click()
})

// Comando para limpar dados de teste
Cypress.Commands.add("cleanupTestData", () => {
  cy.request({
    method: "DELETE",
    url: `${Cypress.env("API_URL")}/test/cleanup`,
    failOnStatusCode: false,
  })
})

// Comando para aguardar carregamento
Cypress.Commands.add("waitForLoad", () => {
  cy.get('[data-cy="loading"]', { timeout: 10000 }).should("not.exist")
})
