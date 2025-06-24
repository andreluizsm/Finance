// Setup script for test data
const axios = require("axios")

const API_BASE_URL = "http://localhost:8080/api"
const TEST_USER = {
  nome: "Cypress Test User",
  email: "cypress@test.com",
  senha: "cypress123",
}

async function setupTestData() {
  try {
    console.log("Setting up test data...")

    // Register test user
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, TEST_USER)
    const token = registerResponse.data.token

    console.log("Test user created successfully")

    // Create test categories
    const categories = [
      { nome: "Test Food", cor: "#FF6B6B", icone: "utensils" },
      { nome: "Test Transport", cor: "#4ECDC4", icone: "car" },
      { nome: "Test Income", cor: "#98D8C8", icone: "dollar-sign" },
    ]

    for (const category of categories) {
      await axios.post(`${API_BASE_URL}/categorias`, category, {
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    console.log("Test categories created")

    // Create test accounts
    const accounts = [
      { nome: "Test Checking", tipo: "CORRENTE", saldo: 5000 },
      { nome: "Test Savings", tipo: "POUPANCA", saldo: 10000 },
    ]

    for (const account of accounts) {
      await axios.post(`${API_BASE_URL}/contas`, account, {
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    console.log("Test accounts created")
    console.log("Test data setup completed successfully!")
  } catch (error) {
    console.error("Error setting up test data:", error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  setupTestData()
}

module.exports = { setupTestData }
