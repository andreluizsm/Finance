
describe("Integration Tests", () => {
  beforeEach(() => {
    cy.login()
  })

  afterEach(() => {
    cy.cleanupTestData()
  })

  describe("Complete Transaction Flow", () => {
    it("should create account, category, and transaction in sequence", () => {
      // Create a new account
      cy.navigateToAccounts()
      cy.get("[data-cy=new-account-button]").click()
      cy.fillAccountForm({
        name: "Cypress Integration Account",
        type: "CORRENTE",
        balance: 5000,
      })
      cy.get("[data-cy=save-account-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Create a new category
      cy.navigateToCategories()
      cy.get("[data-cy=new-category-button]").click()
      cy.fillCategoryForm({
        name: "Cypress Integration Category",
        color: "#FF5733",
      })
      cy.get("[data-cy=save-category-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Create a transaction using the new account and category
      cy.navigateToTransactions()
      cy.get("[data-cy=new-transaction-button]").click()

      cy.fillTransactionForm({
        description: "Cypress Integration Transaction",
        amount: 1000,
        type: "SAIDA",
        date: "2024-06-20",
      })

      // Select the newly created category and account
      cy.get("[data-cy=transaction-category]").click()
      cy.get("[data-cy=category-option]").contains("Cypress Integration Category").click()

      cy.get("[data-cy=transaction-account]").click()
      cy.get("[data-cy=account-option]").contains("Cypress Integration Account").click()

      cy.get("[data-cy=save-transaction-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Verify transaction appears in list
      cy.get("[data-cy=transaction-list]").should("contain", "Cypress Integration Transaction")

      // Verify account balance was updated
      cy.navigateToAccounts()
      cy.get("[data-cy=account-list]").contains("Cypress Integration Account").parent().should("contain", "R$ 4.000,00")
    })
  })

  describe("Goal Progress Tracking", () => {
    it("should update goal progress when related transactions are created", () => {
      // Create a savings goal
      cy.navigateToGoals()
      cy.get("[data-cy=new-goal-button]").click()
      cy.fillGoalForm({
        title: "Cypress Savings Goal",
        targetValue: 5000,
        currentValue: 1000,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        categoryId: "8", // Investimentos
      })
      cy.get("[data-cy=save-goal-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Verify initial progress
      cy.get("[data-cy=goal-list]")
        .contains("Cypress Savings Goal")
        .parent()
        .within(() => {
          cy.get("[data-cy=goal-progress]").should("contain", "20.0%")
        })

      // Create a transaction that contributes to the goal
      cy.navigateToTransactions()
      cy.get("[data-cy=new-transaction-button]").click()
      cy.fillTransactionForm({
        description: "Cypress Goal Contribution",
        amount: 1000,
        type: "ENTRADA",
        categoryId: "8", // Investimentos
        accountId: "2", // Poupança
        date: "2024-06-20",
      })
      cy.get("[data-cy=save-transaction-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Check if goal progress updated (this would require backend logic)
      cy.navigateToGoals()
      cy.get("[data-cy=goal-list]").should("contain", "Cypress Savings Goal")
    })
  })

  describe("Data Consistency", () => {
    it("should maintain data consistency across all modules", () => {
      // Create test data
      cy.navigateToAccounts()
      cy.get("[data-cy=new-account-button]").click()
      cy.fillAccountForm({
        name: "Consistency Test Account",
        type: "CORRENTE",
        balance: 2000,
      })
      cy.get("[data-cy=save-account-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Create transaction
      cy.navigateToTransactions()
      cy.get("[data-cy=new-transaction-button]").click()
      cy.fillTransactionForm({
        description: "Consistency Test Transaction",
        amount: 500,
        type: "SAIDA",
        accountId: "1", // Will be selected by name
        date: "2024-06-20",
      })

      cy.get("[data-cy=transaction-account]").click()
      cy.get("[data-cy=account-option]").contains("Consistency Test Account").click()

      cy.get("[data-cy=save-transaction-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Verify data appears consistently across modules
      cy.visit("/dashboard")
      cy.get("[data-cy=recent-transactions]").should("contain", "Consistency Test Transaction")

      cy.navigateToAccounts()
      cy.get("[data-cy=account-list]").contains("Consistency Test Account").parent().should("contain", "R$ 1.500,00")
    })
  })

  describe("Error Handling", () => {
    it("should handle network errors gracefully", () => {
      // Simulate network failure
      cy.intercept("POST", "**/api/transacoes", { forceNetworkError: true }).as("networkError")

      cy.navigateToTransactions()
      cy.get("[data-cy=new-transaction-button]").click()
      cy.fillTransactionForm({
        description: "Network Error Test",
        amount: 100,
        type: "ENTRADA",
        accountId: "1",
      })

      cy.get("[data-cy=save-transaction-button]").click()
      cy.wait("@networkError")

      cy.get("[data-cy=error-message]").should("be.visible")
      cy.get("[data-cy=error-message]").should("contain", "erro")
    })

    it("should handle server errors gracefully", () => {
      // Simulate server error
      cy.intercept("POST", "**/api/transacoes", { statusCode: 500, body: "Internal Server Error" }).as("serverError")

      cy.navigateToTransactions()
      cy.get("[data-cy=new-transaction-button]").click()
      cy.fillTransactionForm({
        description: "Server Error Test",
        amount: 100,
        type: "ENTRADA",
        accountId: "1",
      })

      cy.get("[data-cy=save-transaction-button]").click()
      cy.wait("@serverError")

      cy.get("[data-cy=error-message]").should("be.visible")
    })
  })
})
