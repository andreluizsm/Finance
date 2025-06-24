describe("Transaction Management", () => {
  beforeEach(() => {
    cy.login()
    cy.visit("/dashboard/transactions")
  })

  afterEach(() => {
    cy.cleanupTestData()
  })

  describe("Transaction Creation", () => {
    it("should create a new income transaction", () => {
      cy.get("button").contains("Nova Transação").click()

      cy.get("#description").type("Cypress Test - Salary")
      cy.get("#amount").type("5000")
      cy.get("#date").type("2024-06-20")

      cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Entrada").click()

      cy.contains("label", "Categoria").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Salário").click()

      cy.contains("label", "Conta").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Carteira").click()

      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Salary").should("be.visible")
      cy.contains("R$ 5.000,00").should("be.visible")
    })

    it("should create a new expense transaction", () => {
      cy.get("button").contains("Nova Transação").click()

      cy.get("#description").type("Cypress Test - Groceries")
      cy.get("#amount").type("250")
      cy.get("#date").type("2024-06-20")

      cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Saída").click()

      cy.contains("label", "Categoria").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Alimentação").click()

      cy.contains("label", "Conta").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Carteira").click()

      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains("Cypress Test - Groceries").should("be.visible")
      cy.contains("-R$ 250,00").should("be.visible")
    })

  })

  describe("Transaction Deletion", () => {
    it("should delete a transaction", () => {
      cy.get("button").contains("Nova Transação").click()
      cy.get("#description").type("Cypress Test - To Delete")
      cy.get("#amount").type("100")
      cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Entrada").click()
      cy.contains("label", "Conta").parent().find('button[role="combobox"]').click()
      cy.get('[role="listbox"]').contains("Carteira").click()
      cy.get('button[type="submit"]').contains("Criar").click()

      cy.contains('Cypress Test - To Delete')
          .closest('div.flex.items-center.justify-between') // O container principal da transação
          .find('button#delete')
          .click()
      cy.on("window:confirm", () => true)

      cy.contains("Cypress Test - To Delete").should("not.exist")
    })
  })

  describe("Transaction Filtering", () => {
    beforeEach(() => {
      const transactions = [
        { description: "Cypress Test - Income", amount: "1000", type: "Entrada" },
        { description: "Cypress Test - Expense", amount: "10", type: "Saída" },
      ]

      transactions.forEach((transaction) => {
        cy.get("button").contains("Nova Transação").click()
        cy.get("#description").type(transaction.description)
        cy.get("#amount").type(transaction.amount)
        cy.contains("label", "Tipo").parent().find('button[role="combobox"]').click()
        cy.get('[role="listbox"]').contains(transaction.type).click()
        cy.contains("label", "Categoria").parent().find('button[role="combobox"]').click()
        cy.get('[role="listbox"]').contains("Alimentaçãoo").click()
        cy.contains("label", "Conta").parent().find('button[role="combobox"]').click()
        cy.get('[role="listbox"]').contains("Carteira").click()
        cy.get('button[type="submit"]').contains("Criar").click()
        cy.wait(1000) // Wait for the transaction to be processed
      })
    })

    it("should filter transactions by type", () => {
      cy.get('button[role="combobox"]').eq(0).click()

      cy.get('[role="listbox"]').contains("Entrada").click()

      cy.contains("Cypress Test - Income").should("be.visible")
      cy.contains("Cypress Test - Expense").should("not.exist")
      cy.contains("Cypress Test - Transfer").should("not.exist")
    })

    it("should filter transactions by category", () => {
      cy.get('button[role="combobox"]').eq(1).click()

      cy.get('[role="listbox"]').contains("Alimentaçãoo").click()

      cy.contains("Cypress Test - Expense").should("be.visible")
      cy.contains("Cypress Test - Income").should("be.visible")
    })

    it("should search transactions by description", () => {
      cy.get("input[placeholder*='Buscar descrição']").type("Income")

      cy.contains("Cypress Test - Income").should("be.visible")
      cy.contains("Cypress Test - Expense").should("not.exist")
    })

    it("should filter by date range", () => {
      cy.get("input[type='date']").first().type("2025-06-22")
      cy.get("input[type='date']").last().type("2025-06-26")

      cy.contains("Cypress Test - Income").should("be.visible")
    })

  })
})