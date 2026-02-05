DROP DATABASE IF EXISTS ong_estoque;
CREATE DATABASE ong_estoque
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ong_estoque;

CREATE TABLE tb_pessoas (
  id_pessoa BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome_razao_social VARCHAR(150) NOT NULL,
  tipo_pessoa ENUM('FISICA', 'JURIDICA') NOT NULL,
  cpf CHAR(11) UNIQUE,
  cnpj CHAR(14) UNIQUE,
  telefone VARCHAR(20),
  email VARCHAR(120),
  ativo BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT chk_cpf_cnpj
    CHECK (
      (tipo_pessoa = 'FISICA' AND cpf IS NOT NULL AND cnpj IS NULL)
      OR
      (tipo_pessoa = 'JURIDICA' AND cnpj IS NOT NULL AND cpf IS NULL)
    )
);

CREATE TABLE tb_enderecos (
  id_endereco BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_pessoa BIGINT NOT NULL,
  logradouro VARCHAR(150) NOT NULL,
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado CHAR(2),
  cep CHAR(8),
  tipo_endereco ENUM('RESIDENCIAL', 'COMERCIAL', 'DOACAO') NOT NULL,

  FOREIGN KEY (id_pessoa) REFERENCES tb_pessoas(id_pessoa)
);

CREATE TABLE tb_voluntarios (
  id_voluntario BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_pessoa BIGINT NOT NULL UNIQUE,
  ativo BOOLEAN DEFAULT TRUE,
  observacoes VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (id_pessoa) REFERENCES tb_pessoas(id_pessoa)
);

CREATE TABLE tb_perfis (
  id_perfil BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(30) NOT NULL UNIQUE,
  descricao VARCHAR(100)
);

INSERT INTO tb_perfis (nome, descricao) VALUES
('ADMIN', 'Administrador do sistema'),
('USER', 'Usuário padrão');

CREATE TABLE tb_usuarios (
  id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  password_salt VARCHAR(100) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  last_login_at DATETIME,
  id_voluntario BIGINT NOT NULL UNIQUE,
  id_perfil BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (id_voluntario) REFERENCES tb_voluntarios(id_voluntario),
  FOREIGN KEY (id_perfil) REFERENCES tb_perfis(id_perfil)
);

CREATE TABLE tb_unidades_medida (
  id_unidade BIGINT AUTO_INCREMENT PRIMARY KEY,
  sigla VARCHAR(10) NOT NULL UNIQUE,
  descricao VARCHAR(50),
  ativo BOOLEAN DEFAULT TRUE
);

INSERT INTO tb_unidades_medida (sigla, descricao) VALUES
('KG', 'Quilograma'),
('G',  'Grama'),
('L',  'Litro'),
('ML', 'Mililitro');

CREATE TABLE tb_produtos (
  id_produto BIGINT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(150) NOT NULL,
  id_unidade BIGINT NOT NULL,
  peso_padrao DECIMAL(10,2),
  ativo BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (id_unidade) REFERENCES tb_unidades_medida(id_unidade)
);

CREATE TABLE tb_origens_doacao (
  id_origem BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_pessoa BIGINT NOT NULL UNIQUE,
  tipo_origem ENUM('DOADOR', 'EMPRESA', 'MERCADO') NOT NULL,
  observacoes VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,

  FOREIGN KEY (id_pessoa) REFERENCES tb_pessoas(id_pessoa)
);

CREATE TABLE tb_lotes (
  id_lote BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_produto BIGINT NOT NULL,
  id_origem BIGINT NOT NULL,
  data_entrada DATE NOT NULL,
  data_validade DATE,
  data_limite_saida DATE,
  quantidade_inicial INT NOT NULL,
  quantidade_atual INT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  id_usuario_responsavel BIGINT NOT NULL,

  FOREIGN KEY (id_produto) REFERENCES tb_produtos(id_produto),
  FOREIGN KEY (id_origem) REFERENCES tb_origens_doacao(id_origem),
  FOREIGN KEY (id_usuario_responsavel) REFERENCES tb_usuarios(id_usuario),

  CONSTRAINT chk_quantidade_lote
    CHECK (quantidade_atual >= 0)
);

CREATE TABLE tb_movimentacoes_estoque (
  id_movimentacao BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_lote BIGINT NOT NULL,
  tipo_movimentacao ENUM('ENTRADA', 'SAIDA', 'AJUSTE') NOT NULL,
  quantidade INT NOT NULL,
  data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  motivo VARCHAR(150),
  id_usuario BIGINT NOT NULL,

  FOREIGN KEY (id_lote) REFERENCES tb_lotes(id_lote),
  FOREIGN KEY (id_usuario) REFERENCES tb_usuarios(id_usuario)
);
  
CREATE INDEX idx_tb_lotes_produto ON tb_lotes(id_produto);
CREATE INDEX idx_tb_lotes_validade ON tb_lotes(data_validade);
CREATE INDEX idx_movimentacoes_lote ON tb_movimentacoes_estoque(id_lote);
CREATE INDEX idx_movimentacoes_data ON tb_movimentacoes_estoque(data_movimentacao);

-- inserts de teste
INSERT INTO tb_pessoas
(nome_razao_social, tipo_pessoa, cpf, cnpj, telefone, email)
VALUES
-- Voluntário 1 (Admin)
('João da Silva', 'FISICA', '12345678901', NULL, '11999990001', 'joao@ong.org'),

-- Voluntário 2 (User)
('Maria Oliveira', 'FISICA', '98765432100', NULL, '11999990002', 'maria@ong.org'),

-- Doador Pessoa Física
('Carlos Pereira', 'FISICA', '11122233344', NULL, '11988887777', 'carlos@gmail.com'),

-- Doador Pessoa Jurídica
('Mercado Bom Preço LTDA', 'JURIDICA', NULL, '12345678000199', '1133334444', 'contato@bopreco.com.br');

INSERT INTO tb_enderecos
(id_pessoa, logradouro, numero, bairro, cidade, estado, cep, tipo_endereco)
VALUES
(1, 'Rua das Flores', '100', 'Centro', 'São Paulo', 'SP', '01001000', 'RESIDENCIAL'),
(2, 'Av. Brasil', '200', 'Centro', 'São Paulo', 'SP', '01002000', 'RESIDENCIAL'),
(3, 'Rua do Doador', '50', 'Vila Nova', 'São Paulo', 'SP', '02002000', 'DOACAO'),
(4, 'Av. Comercial', '999', 'Industrial', 'São Paulo', 'SP', '03003000', 'COMERCIAL');

INSERT INTO tb_voluntarios
(id_pessoa, observacoes)
VALUES
(1, 'Coordenador geral'),
(2, 'Auxiliar administrativo');

INSERT INTO tb_usuarios
(username, password_hash, password_salt, id_voluntario, id_perfil)
VALUES
('admin', 'hash_admin_123', 'salt_admin', 1, 1), -- ADMIN
('usuario', 'hash_user_123', 'salt_user', 2, 2); -- USER

INSERT INTO tb_origens_doacao(id_pessoa, tipo_origem, observacoes)
VALUES
(3, 'DOADOR', 'Doador recorrente'),
(4, 'MERCADO', 'Parceria mensal com mercado');

INSERT INTO tb_produtos(descricao, id_unidade, peso_padrao)
VALUES
('Arroz Branco Tipo 1', 1, 5.00),
('Feijão Carioca', 1, 1.00);

INSERT INTO tb_lotes(id_produto, id_origem, data_entrada, data_validade, data_limite_saida, quantidade_inicial, quantidade_atual, id_usuario_responsavel)
VALUES
-- Lote de arroz do mercado
(1, 2, '2025-01-10', '2025-12-31', '2025-11-30', 50, 50, 1),

-- Lote de feijão do doador PF
(2, 1, '2025-01-15', '2025-10-30', '2025-09-30', 30, 30, 2);

INSERT INTO tb_movimentacoes_estoque(id_lote, tipo_movimentacao, quantidade, motivo, id_usuario)
VALUES
-- Entrada inicial (opcional, se quiser registrar)
(1, 'ENTRADA', 50, 'Entrada inicial do lote', 1),
(2, 'ENTRADA', 30, 'Entrada inicial do lote', 2),

-- Saída de arroz
(1, 'SAIDA', 10, 'Distribuição de cestas básicas', 2),

-- Ajuste de feijão
(2, 'AJUSTE', -2, 'Avaria no transporte', 1);
