const knex = require('../conexoes/conexao');
const transporter = require('../conexoes/nodemailer')
const compiladorHtml = require('../utils/compiladorHtml');

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao } = req.body;
    const { pedido_produtos } = req.body;
    let valor_total = 0;

    try {
        const clienteExistente = await knex('clientes').where({ id: cliente_id }).first();
        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado!' });
        }
        const verificarProdutos = async () => {
            for (const produto of pedido_produtos) {
                const produtoExistente = await knex('produtos').where({ id: produto.produto_id }).first();
                if (!produtoExistente) {
                    return res.status(404).json({ mensagem: `Produto de ID ${produto.produto_id} não encontrado!` });
                }
                const produtoBanco = await knex('produtos').where({ id: produto.produto_id }).first().select('quantidade_estoque');
                if (produtoBanco.quantidade_estoque < produto.quantidade_produto) {
                    return res.status(400).json({ mensagem: `Quantidade do produto de ID ${produto.produto_id} é insuficiente.` });
                }
                await knex('produtos').where({ id: produto.produto_id }).decrement('quantidade_estoque', produto.quantidade_produto);
                valor_total += produtoExistente.valor * produto.quantidade_produto;
            }
            return true;
        };
        const produtosVerificados = await verificarProdutos();
        if (produtosVerificados !== true) {
            return produtosVerificados;
        }
        const pedido = await knex('pedidos').insert({
            cliente_id,
            observacao,
            valor_total
        }).returning('*');

        const adicionarProdutos = async () => {
            const promises = pedido_produtos.map(produto => {
                return knex('pedido_produtos').insert({
                    pedido_id: pedido[0].id,
                    produto_id: produto.produto_id,
                    quantidade_produto: produto.quantidade_produto
                }).returning('*');
            });
            return Promise.all(promises);
        };

        

        const produtosAdicionados = await adicionarProdutos();

        const sucesso = await enviarEmail(cliente_id);

        if (!sucesso) {
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }

        return res.status(201).json({
            pedido,
            produtosAdicionados
        });

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};
const enviarEmail = async (cliente_id) => {
    try {
        const cliente = await knex('clientes').where({ id: cliente_id }).first();
        if (cliente) {
                const htmlEmail = await compiladorHtml(
                    './src/templates/email.html',
                    {
                        cliente: cliente.nome
                    }
                )
                await transporter.sendMail({
                    from: 'De repente Coders <derepentecoders@email.com>',
                    to: `${cliente.nome} <${cliente.email}>`,
                    subject: 'Confirmação do Pedido',
                    html: htmlEmail
                });
            }
            
        return true;
    } catch (error) {
        return false;
    }
};

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        let query = knex('pedidos');

        if (cliente_id) {
            const clienteExistente = await knex('clientes').where({ id: cliente_id }).first();
            if (!clienteExistente) {
                return res.status(400).json({ mensagem: 'Cliente não encontrado' });
            }

            query = query.where({ cliente_id });
        }

        const pedidos = await query.select('*').orderBy('id', 'asc');

        return res.status(200).json(pedidos);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
};

module.exports = {
    cadastrarPedido,
    enviarEmail,
    listarPedidos
};
