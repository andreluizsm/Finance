describe("Goals Management", () => {
  afterEach(() => {
    cy.cleanupTestData()
  })

  beforeEach(() => {
    cy.login()
    cy.visit("/dashboard/goals")
  })

  describe("Goal Creation", () => {

    it("should create a new goal", () => {
      cy.get("button").contains("Nova Meta").click()


      cy.get("#title").type("Cypress Test Goal")
      cy.get("#targetValue").type("10000")
      cy.get("#currentValue").clear().type("2000")
      cy.get("#startDate").type("2024-01-01")
      cy.get("#endDate").type("2024-12-31")

      cy.get("button[role='combobox']").click()
      cy.get("div[role='option']").first().click()

      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test Goal").should("be.visible")
      cy.contains("R$ 10.000,00").should("be.visible")
    })

    it("should validate required fields", () => {
      cy.get("button").contains("Nova Meta").click()
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.get("#title:invalid").should("exist")
      cy.get("#targetValue:invalid").should("exist")
      cy.get("#endDate:invalid").should("exist")
    })



    it("should set default current value to 0", () => {
      cy.get("button").contains("Nova Meta").click()

      cy.get("#currentValue").should("have.value", "0")
    })
  })
//aqui foi
  describe("Goal Progress Display", () => {
    it("should display goal progress correctly", () => {
      // Create a goal with 50% progress
      cy.get("button").contains("Nova Meta").click()
      cy.get("#title").type("Cypress Test - 50% Progress")
      cy.get("#targetValue").type("2000")
      cy.get("#currentValue").clear().type("1000")
      cy.get("#startDate").type("2024-01-01")
      cy.get("#endDate").type("2024-12-31")
      cy.get('button[type="submit"]').contains("Criar").click()


      cy.contains("Cypress Test - 50% Progress")
          .closest('.space-y-6 > div')
          .within(() => {
            cy.contains("50.0%").should("be.visible")
            cy.get('[role="progressbar"]').should("be.visible")
          })
    })
  //
    it("should show completed goals", () => {
      // Create a completed goal
      cy.get("button").contains("Nova Meta").click()
      cy.get("#title").type("Cypress Test - Completed")
      cy.get("#targetValue").type("1000")
      cy.get("#currentValue").clear().type("1000")
      cy.get("#startDate").type("2024-01-01")
      cy.get("#endDate").type("2024-12-31")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Completed")
          .closest('.space-y-6 > div')
          .within(() => {
            cy.contains("100.0%").should("be.visible")
            cy.contains("Meta Concluída! 🎉").should("be.visible")
          })
    })

    it("should show deadline warnings for goals ending within 30 days", () => {

      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split("T")[0]

      cy.get("button").contains("Nova Meta").click()
      cy.get("#title").type("Cypress Test - Near Deadline")
      cy.get("#targetValue").type("2000")
      cy.get("#currentValue").clear().type("500")
      cy.get("#startDate").type("2024-01-01")
      cy.get("#endDate").type(tomorrowStr)
      cy.get('button[type="submit"]').contains("Criar").click()


      cy.contains("Cypress Test - Near Deadline")
          .closest('.space-y-6 > div')
          .within(() => {
            cy.contains("Prazo próximo!").should("be.visible")
          })
    })

    it("should display goal values in Brazilian currency format", () => {
      cy.get("button").contains("Nova Meta").click()
      cy.get("#title").type("Cypress Test - Currency Format")
      cy.get("#targetValue").type("12345.67")
      cy.get("#currentValue").clear().type("5432.10")
      cy.get("#startDate").type("2024-01-01")
      cy.get("#endDate").type("2024-12-31")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Currency Format")
          .closest('.space-y-6 > div')
          .within(() => {
            cy.contains("R$ 12.345,67").should("be.visible")
            cy.contains("R$ 5.432,10").should("be.visible")
          })
    })
  })
//foi tb
  describe("Goal Editing", () => {
    it("should edit an existing goal", () => {

      cy.get("button").contains("Nova Meta").click()
      cy.get("#title").type("Cypress Test - Original")
      cy.get("#targetValue").type("5000")
      cy.get("#currentValue").clear().type("1000")
      cy.get("#startDate").type("2024-01-01")
      cy.get("#endDate").type("2024-12-31")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Original").should("be.visible")

      cy.contains("Cypress Test - Original")
          .closest('[class*="space-y"]')
          .parent()
          .find("button#update")
          .click()

      cy.get("#title").clear().type("Cypress Test - Updated")
      cy.get("#targetValue").clear().type("8000")
      cy.get("#currentValue").clear().type("2000")
      cy.get('button[type="submit"]').contains("Atualizar").click()

      cy.contains("Cypress Test - Updated").should("be.visible")
      cy.contains("R$ 8.000,00").should("be.visible")
      cy.contains("Cypress Test - Original").should("not.exist")
    })
  })

  describe("Goal Deletion", () => {
    it("should delete a goal", () => {

      cy.get("button").contains("Nova Meta").click()
      cy.get("#title").type("Cypress Test - To Delete")
      cy.get("#targetValue").type("1000")
      cy.get("#currentValue").clear().type("0")
      cy.get("#startDate").type("2024-01-01")
      cy.get("#endDate").type("2024-12-31")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - To Delete").should("be.visible")

      cy.contains("Cypress Test - To Delete")
          .closest('[class*="space-y"]')
          .parent()
          .find("button#delete")
          .click()

      cy.on("window:confirm", () => true)

      cy.contains("Cypress Test - To Delete").should("not.exist")
    })

    it("should cancel goal deletion", () => {

      cy.get("button").contains("Nova Meta").click()
      cy.get("#title").type("Cypress Test - Cancel Delete")
      cy.get("#targetValue").type("1000")
      cy.get("#currentValue").clear().type("0")
      cy.get("#startDate").type("2024-01-01")
      cy.get("#endDate").type("2024-12-31")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Cancel Delete").should("be.visible")

      cy.contains("Cypress Test - Cancel Delete")
              .closest('[class*="space-y"]')
              .parent()
              .find("button#delete")
              .click()


      cy.on("window:confirm", () => false)

      cy.contains("Cypress Test - Cancel Delete").should("be.visible")
    })
  })

  describe("Dialog Behavior", () => {
    it("should close dialog when clicking cancel", () => {
      cy.get("button").contains("Nova Meta").click()

      cy.get("button").contains("Cancelar").click()

      cy.get("#title").should("not.exist")
    })

    it("should reset form when creating new goal after editing", () => {

      cy.get("button").contains("Nova Meta").click()
      cy.get("#title").type("First Goal")
      cy.get("#targetValue").type("1000")
      cy.get("#endDate").type("2024-12-31")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("First Goal")
          .closest('[class*="space-y"]')
          .parent()
          .find("button#update")
          .click()

      cy.get("button").contains("Cancelar").click()

      cy.get("button").contains("Nova Meta").click()

      cy.get("#title").should("have.value", "")
      cy.get("#targetValue").should("have.value", "")
      cy.get("#currentValue").should("have.value", "0")
    })
  })
})