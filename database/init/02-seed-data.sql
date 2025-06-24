-- Dados iniciais para teste

-- Inserir usuário de teste (senha: 123456)
INSERT INTO usuarios (nome, email, senha) VALUES 
('João Silva', 'joao@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye7VFnjZcbnvGJQ3d.RrSIS.K.W.vQm8u'),
('Maria Santos', 'maria@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye7VFnjZcbnvGJQ3d.RrSIS.K.W.vQm8u');

-- Inserir categorias padrão para usuário 1
INSERT INTO categorias (nome, cor, icone, usuario_id) VALUES 
('Alimentação', '#FF6B6B', 'utensils', 1),
('Transporte', '#4ECDC4', 'car', 1),
('Moradia', '#45B7D1', 'home', 1),
('Saúde', '#96CEB4', 'heart', 1),
('Educação', '#FFEAA7', 'book', 1),
('Lazer', '#DDA0DD', 'gamepad-2', 1),
('Salário', '#98D8C8', 'dollar-sign', 1),
('Investimentos', '#F7DC6F', 'trending-up', 1);

-- Inserir contas padrão para usuário 1
INSERT INTO contas (nome, tipo, saldo, usuario_id) VALUES 
('Conta Corrente', 'CORRENTE', 2500.00, 1),
('Poupança', 'POUPANCA', 5000.00, 1),
('Carteira', 'CARTEIRA', 150.00, 1);

-- Inserir transações de exemplo para usuário 1
INSERT INTO transacoes (data, valor, descricao, tipo, categoria_id, conta_id, usuario_id) VALUES 
('2024-01-15', 3500.00, 'Salário Janeiro', 'ENTRADA', 7, 1, 1),
('2024-01-16', -250.00, 'Supermercado', 'SAIDA', 1, 1, 1),
('2024-01-17', -80.00, 'Combustível', 'SAIDA', 2, 1, 1),
('2024-01-18', -1200.00, 'Aluguel', 'SAIDA', 3, 1, 1),
('2024-01-20', -150.00, 'Consulta médica', 'SAIDA', 4, 1, 1),
('2024-01-22', 500.00, 'Freelance', 'ENTRADA', 7, 1, 1),
('2024-02-15', 3500.00, 'Salário Fevereiro', 'ENTRADA', 7, 1, 1),
('2024-02-16', -300.00, 'Supermercado', 'SAIDA', 1, 1, 1),
('2024-02-17', -90.00, 'Combustível', 'SAIDA', 2, 1, 1),
('2024-02-18', -1200.00, 'Aluguel', 'SAIDA', 3, 1, 1);

-- Inserir metas de exemplo para usuário 1
INSERT INTO metas (titulo, valor_alvo, valor_atual, data_inicio, data_fim, categoria_id, usuario_id) VALUES 
('Reserva de Emergência', 10000.00, 5000.00, '2024-01-01', '2024-12-31', 8, 1),
('Viagem de Férias', 3000.00, 800.00, '2024-01-01', '2024-07-01', 6, 1),
('Novo Carro', 25000.00, 2500.00, '2024-01-01', '2025-01-01', 2, 1);
