# INÍCIO RÁPIDO - CYPRESS

## 1. PREPARAR AMBIENTE
cd finance-app
npm install

## 2. INICIAR APLICAÇÃO
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend  
npm run dev

## 3. EXECUTAR TESTES
# Terminal 3 - Testes

# Dar permissão ao script
chmod +x scripts/run-cypress.sh

# Executar todos os testes
./scripts/run-cypress.sh

# OU usar npm diretamente
npm run cypress:run

## 4. COMANDOS MAIS USADOS

# Ver testes rodando (com interface)
./scripts/run-cypress.sh headed

# Testar arquivo específico
./scripts/run-cypress.sh spec cypress/e2e/01-authentication.cy.js

# Usar Firefox
./scripts/run-cypress.sh firefox

## 5. VERIFICAR RESULTADOS
# Screenshots: cypress/screenshots/
# Vídeos: cypress/videos/
# Console: Saída do terminal
