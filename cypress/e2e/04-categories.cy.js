describe("Category Management", () => {
  beforeEach(() => {
    cy.login()
    cy.navigateToCategories()
  })

  afterEach(() => {
    cy.cleanupTestData()
  })

  describe("Category Creation", () => {
    it("should create a new category", () => {
      cy.get("[data-cy=new-category-button]").click()

      cy.fillCategoryForm({
        name: "Cypress Test Category",
        color: "#FF5733",
      })

      cy.get("[data-cy=save-category-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      cy.get("[data-cy=category-list]").should("contain", "Cypress Test Category")
    })

    it("should validate required fields", () => {
      cy.get("[data-cy=new-category-button]").click()
      cy.get("[data-cy=save-category-button]").click()

      cy.get("[data-cy=category-name]:invalid").should("exist")
    })

    it("should allow color selection", () => {
      cy.get("[data-cy=new-category-button]").click()

      cy.get("[data-cy=category-name]").type("Test Color Category")

      // Test predefined color selection
      cy.get("[data-cy=color-option]").first().click()

      cy.get("[data-cy=save-category-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      cy.get("[data-cy=category-list]").should("contain", "Test Color Category")
    })
  })

  describe("Category Editing", () => {
    it("should edit an existing category", () => {
      // Create category first
      cy.get("[data-cy=new-category-button]").click()
      cy.fillCategoryForm({
        name: "Cypress Test - Original",
        color: "#FF5733",
      })
      cy.get("[data-cy=save-category-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Edit category
      cy.get("[data-cy=category-list]")
        .contains("Cypress Test - Original")
        .parent()
        .find("[data-cy=edit-category-button]")
        .click()

      cy.fillCategoryForm({
        name: "Cypress Test - Updated",
        color: "#33FF57",
      })

      cy.get("[data-cy=save-category-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      cy.get("[data-cy=category-list]").should("contain", "Cypress Test - Updated")
      cy.get("[data-cy=category-list]").should("not.contain", "Cypress Test - Original")
    })
  })

  describe("Category Deletion", () => {
    it("should delete a category", () => {
      // Create category first
      cy.get("[data-cy=new-category-button]").click()
      cy.fillCategoryForm({
        name: "Cypress Test - To Delete",
        color: "#FF5733",
      })
      cy.get("[data-cy=save-category-button]").click()
      cy.get("[data-cy=success-message]").should("be.visible")

      // Delete category
      cy.get("[data-cy=category-list]")
        .contains("Cypress Test - To Delete")
        .parent()
        .find("[data-cy=delete-category-button]")
        .click()
      cy.get("[data-cy=confirm-delete-button]").click()

      cy.get("[data-cy=success-message]").should("be.visible")
      cy.get("[data-cy=category-list]").should("not.contain", "Cypress Test - To Delete")
    })
  })

  describe("Category Display", () => {
    it("should display categories with colors", () => {
      cy.get("[data-cy=category-list]").should("be.visible")
      cy.get("[data-cy=category-item]").should("have.length.greaterThan", 0)

      // Check that categories have color indicators
      cy.get("[data-cy=category-color-indicator]").should("be.visible")
    })
  })
})
