// Import commands.js using ES2015 syntax:
import "./commands"

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top
if (!app.document.head.querySelector("[data-hide-command-log-request]")) {
  const style = app.document.createElement("style")
  style.innerHTML = ".command-name-request, .command-name-xhr { display: none }"
  style.setAttribute("data-hide-command-log-request", "")
  app.document.head.appendChild(style)
}

// Global error handling
Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  if (err.message.includes("ResizeObserver loop limit exceeded")) {
    return false
  }
  return true
})
