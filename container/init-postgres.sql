-- init-postgres.sql

-- Criação da base "payments"
CREATE DATABASE payments;
\c payments;

-- Criação da base "customers"
CREATE DATABASE customers;

\c customers;
-- Criação da tabela "customers"
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  cpf VARCHAR(255),
  cnpj VARCHAR(255),
  issuer VARCHAR(255),
  numberAccount VARCHAR(255),
  accountType VARCHAR(255),
  amount VARCHAR(255)
);

INSERT INTO customers (name, email, cpf, cnpj, issuer, numberAccount, accountType, amount) VALUES
  ('joao', 'joao@example.com', '12345678901', '', '0001', '12345678', 'CC', '100'),
  ('maria', 'maria@example.com', '12345678902', '', '0001', '12345678', 'CC', '1000'),
  ('zezinho', 'zezinho@example.com', '12345678903', '50685362000135', '0001', '3333333', 'CC', '10000');
