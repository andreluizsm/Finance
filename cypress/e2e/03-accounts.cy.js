describe("Account Management", () => {
  beforeEach(() => {
    cy.login()
    cy.visit("/dashboard/accounts")
  })

  afterEach(() => {
    cy.cleanupTestData()
  })

  // describe("Account Creation", () => {
  //   it("should create a new checking account", () => {
  //     cy.get("button").contains("Nova Conta").click()
  //
  //     cy.get("#name").type("Cypress Test - Checking")
  //     cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
  //     cy.get('[role="listbox"]').contains("Conta Corrente").click()
  //     cy.get("#balance").type("1000")
  //
  //     cy.get('button[type="submit"]').contains("Criar").click()
  //
  //     cy.contains("Cypress Test - Checking").should("be.visible")
  //     cy.contains("R$ 1.000,00").should("be.visible")
  //   })
  //
  //   it("should create a savings account", () => {
  //     cy.get("button").contains("Nova Conta").click()
  //
  //     cy.get("#name").type("Cypress Test - Savings")
  //     cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
  //     cy.get('[role="listbox"]').contains("Poupança").click()
  //     cy.get("#balance").type("5000")
  //
  //     cy.get('button[type="submit"]').contains("Criar").click()
  //
  //     cy.contains("Cypress Test - Savings").should("be.visible")
  //     cy.contains("R$ 5.000,00").should("be.visible")
  //   })
  //
  //   it("should validate required fields", () => {
  //     cy.get("button").contains("Nova Conta").click()
  //     cy.get('button[type="submit"]').contains("Criar").click()
  //
  //     cy.get("#name:invalid").should("exist")
  //   })
  //
  //   it("should validate positive balance", () => {
  //     cy.get("button").contains("Nova Conta").click()
  //
  //     cy.get("#name").type("Test Account")
  //     cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
  //     cy.get('[role="listbox"]').contains("Conta Corrente").click()
  //     cy.get("#balance").type("-100")
  //
  //     cy.get('button[type="submit"]').contains("Criar").click()
  //
  //     // Assumindo que existe uma mensagem de erro visível
  //     cy.contains("erro", { matchCase: false }).should("be.visible")
  //   })
  // })
  //
  // describe("Account Editing", () => {
  //   it("should edit an existing account", () => {
  //     // Create account first
  //     cy.get("button").contains("Nova Conta").click()
  //     cy.get("#name").type("Cypress Test - Original")
  //     cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
  //     cy.get('[role="listbox"]').contains("Conta Corrente").click()
  //     cy.get("#balance").type("1000")
  //     cy.get('button[type="submit"]').contains("Criar").click()
  //
  //     // Wait for account to be created
  //     cy.contains("Cypress Test - Original").should("be.visible")
  //
  //     // Edit account - assumindo que existe um botão de editar próximo ao nome da conta
  //     cy.contains("Cypress Test - Original")
  //         .parent()
  //         .find("button")
  //         .contains("Editar")
  //         .click()
  //
  //     // Update form
  //     cy.get("#name").clear().type("Cypress Test - Updated")
  //     cy.get("#balance").clear().type("2000")
  //     cy.get('button[type="submit"]').contains("Atualizar").click()
  //
  //     cy.contains("Cypress Test - Updated").should("be.visible")
  //     cy.contains("R$ 2.000,00").should("be.visible")
  //   })
  // })

  describe("Account Deletion", () => {
    it("should delete an account", () => {
      // Create account first
      cy.get("button").contains("Nova Conta").click()
      cy.get("#name").type("Cypress Test - To Delete")
      cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Carteira").click()
      cy.get("#balance").type("100")
      cy.get('button[type="submit"]').contains("Criar").click()

      // Wait for account to be created
      cy.contains("Cypress Test - To Delete").should("be.visible")

      // Delete account - assumindo que existe um botão de deletar
      cy.contains('Cypress Test - To Delete')
          .closest('[class*="space-x-3"]') // Vai até a div que contém o ícone e texto
          .parent() // Sobe para a div com justify-between
          .find('button#delete')
          .click()
      cy.on("window:confirm", () => true)

      cy.contains("Cypress Test - To Delete").should("not.exist")
    })
  })

  // describe("Account Balance Display", () => {
  //   it("should display total balance correctly", () => {
  //     // Assumindo que existe um elemento que mostra o saldo total
  //     cy.contains("Saldo Total").should("be.visible")
  //     cy.contains("R$").should("be.visible")
  //   })
  //
  //   it("should update total balance when account is created", () => {
  //     // Get initial total - assumindo que existe um elemento específico para o saldo total
  //     cy.get("body")
  //         .invoke("text")
  //         .then((initialContent) => {
  //           // Create new account
  //           cy.get("button").contains("Nova Conta").click()
  //           cy.get("#name").type("Cypress Test - Balance")
  //           cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
  //           cy.get('[role="listbox"]').contains("Conta Corrente").click()
  //           cy.get("#balance").type("1000")
  //           cy.get('button[type="submit"]').contains("Criar").click()
  //
  //           // Wait for account to be created
  //           cy.contains("Cypress Test - Balance").should("be.visible")
  //
  //           // Check that the page content has changed (indicating balance update)
  //           cy.get("body").invoke("text").should("not.eq", initialContent)
  //         })
  //   })
  // })
})