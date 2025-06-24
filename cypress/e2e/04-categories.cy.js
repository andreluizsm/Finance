describe("Category Management", () => {
  beforeEach(() => {
    cy.login()
    cy.visit("/dashboard/categories")
  })

  afterEach(() => {
    cy.cleanupTestData()
  })

  describe("Category Creation", () => {
    it("should create a new category", () => {
      cy.get("button").contains("Nova Categoria").click()

      cy.get("#name").type("Cypress Test Category")


      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test Category").should("be.visible")
    })

    it("should validate required fields", () => {
      cy.get("button").contains("Nova Categoria").click()
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.get("#name:invalid").should("exist")
    })

    it("should allow predefined color selection", () => {
      cy.get("button").contains("Nova Categoria").click()

      cy.get("#name").type("Predefined Color Category")
      cy.get('button[type="button"]').eq(2).click() // Select third color option

      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Predefined Color Category").should("be.visible")
    })
  })

  describe("Category Editing", () => {
    it("should edit an existing category", () => {
      // Create category first
      cy.get("button").contains("Nova Categoria").click()
      cy.get("#name").type("Cypress Test - Original")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Original").should("be.visible")

      cy.contains("Cypress Test - Original")
          .closest('[class*="space-x-3"]')
          .parent()
          .find("button#update")
          .click()

      cy.get("#name").clear().type("Cypress Test - Updated")
      cy.get('button[type="submit"]').contains("Atualizar").click()

      cy.contains("Cypress Test - Updated").should("be.visible")
      cy.contains("Cypress Test - Original").should("not.exist")
    })
  })


  describe("Category Deletion", () => {
    it("should delete a category", () => {
      cy.get("button").contains("Nova Categoria").click()
      cy.get("#name").type("Cypress Test - To Delete")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - To Delete").should("be.visible")

      cy.contains("Cypress Test - To Delete")
            .closest('[class*="space-x-3"]')
            .parent()
            .find("button#delete")
            .click()
      cy.on("window:confirm", () => true)

      cy.contains("Cypress Test - To Delete").should("not.exist")
    })

    it("should cancel category deletion", () => {
      cy.get("button").contains("Nova Categoria").click()
      cy.get("#name").type("Cypress Test - Cancel Delete")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Cancel Delete").should("be.visible")

      cy.contains("Cypress Test - Cancel Delete")
          .closest('[class*="space-x-3"]')
          .parent()
          .find("button#delete")
          .click()
      cy.on("window:confirm", () => false)

      cy.contains("Cypress Test - Cancel Delete").should("be.visible")
    })
  })

})