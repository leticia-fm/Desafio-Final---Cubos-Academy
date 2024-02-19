CREATE DATABASE pdv;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    descricao TEXT
);


INSERT INTO categorias (descricao) VALUES ('Informática'), ('Celulares'), ('Beleza e Perfumaria'), ('Mercado'),
('Livros e Papelaria'), ('Brinquedos'), ('Moda'), ('Bebê'), ('Games');

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL,
    quantidade_estoque integer NOT NULL,
    valor integer NOT NULL,
    categoria_id integer REFERENCES categorias(id) NOT NULL,
    produto_imagem TEXT
);

ALTER TABLE produtos
ADD COLUMN produto_imagem TEXT;

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    cep TEXT,
    rua TEXT,
    numero TEXT,
    bairro TEXT,
    cidade TEXT,
    estado CHAR(2)
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) NOT NULL,
    observacao TEXT,
    valor_total INTEGER
);

CREATE TABLE pedido_produtos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) NOT NULL,
    produto_id INTEGER REFERENCES produtos(id) NOT NULL,
    quantidade_produto INTEGER,
    valor_produto INTEGER
);

