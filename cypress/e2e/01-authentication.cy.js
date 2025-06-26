describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  describe("User Registration", () => {
    it("should register a new user successfully", () => {
      const timestamp = Date.now()
      const testEmail = `cypress-${timestamp}@test.com`

      cy.visit("/register")
      cy.get("#name").type("Cypress Test User")
      cy.get("#email").type(testEmail)
      cy.get("#password").type("cypress123")
      cy.get("#confirmPassword").type("cypress123")
      cy.get("button[type='submit']").click()

      cy.url().should("include", "/dashboard")
      cy.contains("Dashboard").should("be.visible")
      cy.contains("Cypress Test User").should("be.visible")
    })

    it("should show validation errors for invalid registration data", () => {
      cy.visit("/register")

      // Test empty form
      cy.get("button[type='submit']").click()
      cy.get("#name:invalid").should("exist")
      cy.get("#email:invalid").should("exist")
      cy.get("#password:invalid").should("exist")

      // Test password mismatch
      cy.get("#name").type("Test User")
      cy.get("#email").type("test@example.com")
      cy.get("#password").type("password123")
      cy.get("#confirmPassword").type("different123")
      cy.get("button[type='submit']").click()

      cy.contains("senhas não coincidem").should("be.visible")
    })

    it("should prevent registration with existing email", () => {
      cy.visit("/register")
      cy.get("#name").type("Test User")
      cy.get("#email").type("joao@email.com") // Existing user
      cy.get("#password").type("password123")
      cy.get("#confirmPassword").type("password123")
      cy.get("button[type='submit']").click()

      cy.contains("Email já cadastrado").should("be.visible")
    })
  })

  describe("User Login", () => {
    it("should login with valid credentials", () => {
      cy.visit("/")
      cy.get("#email").type("joao@email.com")
      cy.get("#password").type("123456")
      cy.get("button[type='submit']").click()

      cy.url().should("include", "/dashboard")
      cy.contains("Dashboard").should("be.visible")
      cy.contains("João").should("be.visible")
    })

    it("should show error for invalid credentials", () => {
      cy.visit("/")
      cy.get("#email").type("invalid@email.com")
      cy.get("#password").type("wrongpassword")
      cy.get("button[type='submit']").click()

      cy.contains("Usuário não encontrado").should("be.visible")
    })

    it("should show error for wrong password", () => {
      cy.visit("/")
      cy.get("#email").type("joao@email.com")
      cy.get("#password").type("wrongpassword")
      cy.get("button[type='submit']").click()

      cy.contains("Senha incorreta").should("be.visible")
    })

    it("should validate required fields", () => {
      cy.visit("/")
      cy.get("button[type='submit']").click()

      cy.get("#email:invalid").should("exist")
      cy.get("#password:invalid").should("exist")
    })
  })

  describe("User Logout", () => {
    it("should logout successfully", () => {
      cy.visit("/dashboard")

      cy.get('button').find('svg[class*="lucide-log-out"]').parent().click()

      cy.url().should("eq", "http://localhost:3000/")
      cy.get("form").should("be.visible")
    })
  })

})