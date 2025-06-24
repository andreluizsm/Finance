describe("Goals Management", () => {
  beforeEach(() => {
    cy.login()
    cy.navigateToGoals()
  })

  afterEach(() => {
    cy.cleanupTestData()
  })

  describe("Goal Creation", () => {
    it("should create a new goal", () => {
      cy.get("[data-cy=new-goal-button]").click()

      cy.fillGoalForm({
        title: "Cypress Test Goal",
        targetValue: 10000,
        currentValue: 2000,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        categoryId: "8", // Investimentos
      })

      cy.get("[data-cy=save-goal-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      cy.get("[data-cy=goal-list]").should("contain", "Cypress Test Goal")
      cy.get("[data-cy=goal-list]").should("contain", "R$ 10.000,00")
    })

    it("should validate required fields", () => {
      cy.get("[data-cy=new-goal-button]").click()
      cy.get("[data-cy=save-goal-button]").click()

      cy.get("[data-cy=goal-title]:invalid").should("exist")
      cy.get("[data-cy=goal-target-value]:invalid").should("exist")
      cy.get("[data-cy=goal-start-date]:invalid").should("exist")
      cy.get("[data-cy=goal-end-date]:invalid").should("exist")
    })

    it("should validate date range", () => {
      cy.get("[data-cy=new-goal-button]").click()

      cy.fillGoalForm({
        title: "Test Goal",
        targetValue: 5000,
        currentValue: 0,
        startDate: "2024-12-31",
        endDate: "2024-01-01", // End before start
      })

      cy.get("[data-cy=save-goal-button]").click()
      cy.get("[data-cy=error-message]").should("be.visible")
    })

    it("should validate positive values", () => {
      cy.get("[data-cy=new-goal-button]").click()

      cy.fillGoalForm({
        title: "Test Goal",
        targetValue: -1000,
        currentValue: 0,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      })

      cy.get("[data-cy=save-goal-button]").click()
      cy.get("[data-cy=error-message]").should("contain", "maior que zero")
    })
  })

  describe("Goal Progress Display", () => {
    it("should display goal progress correctly", () => {
      // Create a goal with 50% progress
      cy.get("[data-cy=new-goal-button]").click()
      cy.fillGoalForm({
        title: "Cypress Test - 50% Progress",
        targetValue: 2000,
        currentValue: 1000,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      })
      cy.get("[data-cy=save-goal-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Check progress display
      cy.get("[data-cy=goal-list]")
        .contains("Cypress Test - 50% Progress")
        .parent()
        .within(() => {
          cy.get("[data-cy=goal-progress]").should("contain", "50.0%")
          cy.get("[data-cy=progress-bar]").should("be.visible")
        })
    })

    it("should show completed goals", () => {
      // Create a completed goal
      cy.get("[data-cy=new-goal-button]").click()
      cy.fillGoalForm({
        title: "Cypress Test - Completed",
        targetValue: 1000,
        currentValue: 1000,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      })
      cy.get("[data-cy=save-goal-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Check completion indicator
      cy.get("[data-cy=goal-list]")
        .contains("Cypress Test - Completed")
        .parent()
        .within(() => {
          cy.get("[data-cy=goal-completed-badge]").should("be.visible")
          cy.get("[data-cy=goal-progress]").should("contain", "100.0%")
        })
    })

    it("should show deadline warnings", () => {
      // Create a goal with near deadline
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split("T")[0]

      cy.get("[data-cy=new-goal-button]").click()
      cy.fillGoalForm({
        title: "Cypress Test - Near Deadline",
        targetValue: 2000,
        currentValue: 500,
        startDate: "2024-01-01",
        endDate: tomorrowStr,
      })
      cy.get("[data-cy=save-goal-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Check deadline warning
      cy.get("[data-cy=goal-list]")
        .contains("Cypress Test - Near Deadline")
        .parent()
        .within(() => {
          cy.get("[data-cy=deadline-warning]").should("be.visible")
        })
    })
  })

  describe("Goal Editing", () => {
    it("should edit an existing goal", () => {
      // Create goal first
      cy.get("[data-cy=new-goal-button]").click()
      cy.fillGoalForm({
        title: "Cypress Test - Original",
        targetValue: 5000,
        currentValue: 1000,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      })
      cy.get("[data-cy=save-goal-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Edit goal
      cy.get("[data-cy=goal-list]")
        .contains("Cypress Test - Original")
        .parent()
        .find("[data-cy=edit-goal-button]")
        .click()

      cy.fillGoalForm({
        title: "Cypress Test - Updated",
        targetValue: 8000,
        currentValue: 2000,
      })

      cy.get("[data-cy=save-goal-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      cy.get("[data-cy=goal-list]").should("contain", "Cypress Test - Updated")
      cy.get("[data-cy=goal-list]").should("contain", "R$ 8.000,00")
    })
  })

  describe("Goal Deletion", () => {
    it("should delete a goal", () => {
      // Create goal first
      cy.get("[data-cy=new-goal-button]").click()
      cy.fillGoalForm({
        title: "Cypress Test - To Delete",
        targetValue: 1000,
        currentValue: 0,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      })
      cy.get("[data-cy=save-goal-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Delete goal
      cy.get("[data-cy=goal-list]")
        .contains("Cypress Test - To Delete")
        .parent()
        .find("[data-cy=delete-goal-button]")
        .click()
      cy.get("[data-cy=confirm-delete-button]").click()

      cy.get("[data-cy=success-message]").should("be.visible")
      cy.get("[data-cy=goal-list]").should("not.contain", "Cypress Test - To Delete")
    })
  })
})
