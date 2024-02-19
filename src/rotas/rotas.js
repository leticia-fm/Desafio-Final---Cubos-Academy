const express = require('express');
const login = require('../controladores/login');
const { listarCategorias } = require('../controladores/categorias');
const { cadastrarUsuario, atualizarUsuario, detalharPerfil } = require('../controladores/usuarios');
const { cadastrarCliente, listarClientes, detalharCliente, atualizarCliente } = require('../controladores/clientes');
const { cadastrarProduto, editarProduto, deletarProduto, listarProdutos, detalharProduto } = require('../controladores/produtos');
const validarRequisicao = require('../intermediarios/validarRequisicao');
const validarLogin = require('../intermediarios/validarLogin');
const usuarioSchema = require('../validacoes/usuarioSchema');
const loginSchema = require('../validacoes/loginSchema');
const clienteSchema = require('../validacoes/clienteSchema');
const produtoSchema = require('../validacoes/produtoSchema');
const pedidoSchema = require('../validacoes/pedidoSchema');
const { cadastrarPedido, enviarEmail, listarPedidos } = require('../controladores/pedidos');


const multer = require('../intermediarios/multer')

const rotas = express();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', validarRequisicao(usuarioSchema), cadastrarUsuario);
rotas.post('/login', validarRequisicao(loginSchema), login);

rotas.use(validarLogin);

rotas.get('/usuario', detalharPerfil);
rotas.put('/usuario', validarRequisicao(usuarioSchema), atualizarUsuario);

rotas.post('/produto', multer.single('produto_imagem'), validarRequisicao(produtoSchema), cadastrarProduto);
rotas.put('/produto/:id', multer.single('produto_imagem'), validarRequisicao(produtoSchema), editarProduto);
rotas.get('/produto', listarProdutos);
rotas.get('/produto/:id', detalharProduto);
rotas.delete('/produto/:id', multer.single('produto_imagem'), deletarProduto);

rotas.post('/cliente', validarRequisicao(clienteSchema), cadastrarCliente);
rotas.put('/cliente/:id', validarRequisicao(clienteSchema), atualizarCliente);
rotas.get('/cliente', listarClientes);
rotas.get('/cliente/:id', detalharCliente);

rotas.post('/pedido', validarRequisicao(pedidoSchema), cadastrarPedido, enviarEmail)
rotas.get('/pedido', listarPedidos);

module.exports = rotas;