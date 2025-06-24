describe("Account Management", () => {
  beforeEach(() => {
    cy.login()
    cy.visit("/dashboard/accounts")
  })

  afterEach(() => {
    cy.cleanupTestData()
  })
// jafoi também
  describe("Account Creation", () => {
    it("should create a new checking account", () => {
      cy.get("button").contains("Nova Conta").click()

      cy.get("#name").type("Cypress Test - Checking")
      cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Conta Corrente").click()
      cy.get("#balance").type("1000")

      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Checking").should("be.visible")
      cy.contains("R$ 1.000,00").should("be.visible")
    })

    it("should create a savings account", () => {
      cy.get("button").contains("Nova Conta").click()

      cy.get("#name").type("Cypress Test - Savings")
      cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Poupança").click()
      cy.get("#balance").type("5000")

      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Savings").should("be.visible")
      cy.contains("R$ 5.000,00").should("be.visible")
    })

    it("should validate required fields", () => {
      cy.get("button").contains("Nova Conta").click()
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.get("#name:invalid").should("exist")
    })

  })


//foi também
  describe("Account Editing", () => {
    it("should edit an existing account", () => {
      // Create account first
      cy.get("button").contains("Nova Conta").click()
      cy.get("#name").type("Cypress Test - Original")
      cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Conta Corrente").click()
      cy.get("#balance").type("1000")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Original").should("be.visible")

      cy.contains("Cypress Test - Original")
          .closest('[class*="space-x-3"]')
          .parent()
          .find("button#update")
          .click()


      cy.get("#name").clear().type("Cypress Test - Updated")
      cy.get("#balance").clear().type("2000")
      cy.get('button[type="submit"]').contains("Atualizar").click()

      cy.contains("Cypress Test - Updated").should("be.visible")
      cy.contains("R$ 2.000,00").should("be.visible")
    })
   })

  //ja foi
  describe("Account Deletion", () => {
    it("should delete an account", () => {
      cy.get("button").contains("Nova Conta").click()
      cy.get("#name").type("Cypress Test - To Delete")
      cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Carteira").click()
      cy.get("#balance").type("100")
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - To Delete").should("be.visible")

      cy.contains('Cypress Test - To Delete')
          .closest('[class*="space-x-3"]')
          .parent()
          .find('button#delete')
          .click()
      cy.on("window:confirm", () => true)

      cy.contains("Cypress Test - To Delete").should("not.exist")
    })
  })

  describe("Account Balance Display", () => {
    it("should display total balance correctly", () => {

      cy.contains("Saldo Total").should("be.visible")
      cy.contains("R$").should("be.visible")
    })

    it("should update total balance when account is created", () => {
      cy.get("body")
          .invoke("text")
          .then((initialContent) => {

            cy.get("button").contains("Nova Conta").click()
            cy.get("#name").type("Cypress Test - Balance")
            cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
            cy.get('[role="listbox"]').contains("Conta Corrente").click()
            cy.get("#balance").type("1000")
            cy.get('button[type="submit"]').contains("Criar").click()

            cy.contains("Cypress Test - Balance").should("be.visible")

            cy.get("body").invoke("text").should("not.eq", initialContent)
          })
    })
  })
 })