
describe("Dashboard", () => {
  beforeEach(() => {
    cy.login()
    cy.url().should("include", "/dashboard")
  })

  describe("Dashboard Overview", () => {
    it("should display overview cards", () => {
      cy.get("[data-cy=total-balance-card]").should("be.visible")
      cy.get("[data-cy=monthly-income-card]").should("be.visible")
      cy.get("[data-cy=monthly-expenses-card]").should("be.visible")
      cy.get("[data-cy=active-goals-card]").should("be.visible")
    })

    it("should display correct balance format", () => {
      cy.get("[data-cy=total-balance-card]").within(() => {
        cy.get("[data-cy=card-value]").should("contain", "R$")
      })
    })

    it("should display recent transactions", () => {
      cy.get("[data-cy=recent-transactions]").should("be.visible")
      cy.get("[data-cy=recent-transactions-title]").should("contain", "Transações Recentes")
    })

    it("should display goals progress", () => {
      cy.get("[data-cy=goals-progress]").should("be.visible")
      cy.get("[data-cy=goals-progress-title]").should("contain", "Progresso das Metas")
    })

    it("should display financial charts", () => {
      cy.get("[data-cy=financial-charts]").should("be.visible")
      cy.get("[data-cy=expenses-chart]").should("be.visible")
      cy.get("[data-cy=income-expenses-chart]").should("be.visible")
    })
  })

  describe("Navigation", () => {
    it("should navigate to transactions page", () => {
      cy.get("[data-cy=nav-transactions]").click()
      cy.url().should("include", "/dashboard/transactions")
    })

    it("should navigate to accounts page", () => {
      cy.get("[data-cy=nav-accounts]").click()
      cy.url().should("include", "/dashboard/accounts")
    })

    it("should navigate to categories page", () => {
      cy.get("[data-cy=nav-categories]").click()
      cy.url().should("include", "/dashboard/categories")
    })

    it("should navigate to goals page", () => {
      cy.get("[data-cy=nav-goals]").click()
      cy.url().should("include", "/dashboard/goals")
    })
  })

  describe("Notifications", () => {
    it("should display notification center", () => {
      cy.get("[data-cy=notification-center]").should("be.visible")
    })

    it("should show notification count when there are notifications", () => {
      cy.get("[data-cy=notification-center]").click()
      cy.get("[data-cy=notification-list]").should("be.visible")
    })
  })

  describe("Responsive Design", () => {
    it("should work on mobile viewport", () => {
      cy.viewport("iphone-x")

      cy.get("[data-cy=mobile-menu-button]").should("be.visible")
      cy.get("[data-cy=mobile-menu-button]").click()
      cy.get("[data-cy=mobile-nav]").should("be.visible")
    })

    it("should work on tablet viewport", () => {
      cy.viewport("ipad-2")

      cy.get("[data-cy=dashboard-overview]").should("be.visible")
      cy.get("[data-cy=recent-transactions]").should("be.visible")
    })
  })
})
