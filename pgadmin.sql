CREATE DATABASE master_sound;

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    modelo VARCHAR(100),
    marca VARCHAR(100),
    preco NUMERIC(10, 2) NOT NULL,
    fk_categoria INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    tipos VARCHAR(100),
    imagem VARCHAR(255)
);

-- Tabela de Usuários (Administradores / Operadores)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    data_nascimento DATE NOT NULL,
    senha VARCHAR(100) NOT NULL
);

-- Categorias iniciais
INSERT INTO categorias (nome, descricao) VALUES
('Vinil Clássico', 'Discos de vinil clássicos nacionais e internacionais'),
('Equipamentos', 'Vitrolas, caixas de som e acessórios de áudio'),
('Instrumentos', 'Instrumentos musicais selecionados');

-- Produtos iniciais do catálogo[cite: 4, 5]
INSERT INTO produtos (nome, descricao, modelo, marca, preco, fk_categoria, tipos, imagem) VALUES
('Rumours - Fleetwood Mac', 'Álbum clássico', 'LP Vinyl', 'Master Sound', 599.00, 1, 'Internacional', 'IMG/81StMTXGhbL._UF1000,1000_QL80_.jpg'),
('Discos Variados', 'Seleção de vinis importados', 'LP', 'Importado', 180.00, 1, 'Internacional', 'IMG/cb0dc409-c66c-45fd-b923-5675c6112a59.jpg'),
('Acessórios de Som', 'Equipamentos de áudio', 'Acessório', 'Master Sound', 250.00, 2, 'Internacional', 'IMG/3787b60c-ab3e-441f-b9f1-1895e134a98a.png'),
('Instrumentos Musicais', 'Instrumentos selecionados', 'Geral', 'Master Sound', 1200.00, 3, 'Internacional', 'IMG/630610bd-cb9d-427c-a3ee-1924b1500f24.png');

-- Usuário Administrador padrão para login no painel
INSERT INTO usuarios (nome, email, cpf, data_nascimento, senha) VALUES
('Administrador', 'admin@mastersound.com', '00000000000', '2000-01-01', '123456');


-- Visualizar todos os registros das tabelas
SELECT * FROM produtos ORDER BY id ASC;
SELECT * FROM categorias ORDER BY id ASC;
SELECT * FROM usuarios ORDER BY id ASC;

-- Atualizar dados de um produto
UPDATE produtos 
SET preco = 550.00 
WHERE id = 7;

-- Excluir um registro específico
DELETE FROM produtos WHERE id = 10;
