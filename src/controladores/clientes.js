const knex = require('../conexoes/conexao');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        const emailExiste = await knex('clientes').where({ email }).first();

        if (emailExiste) {
            return res.status(400).json({
                mensagem: 'Já existe um cliente cadastrado com esse email.'
            });
        }

        const cpfExiste = await knex('clientes').where({ cpf }).first();

        if (cpfExiste) {
            return res.status(400).json({
                mensagem: 'Já existe um cliente cadastrado com esse cpf.'
            });
        }

        const clienteCadastrado = await knex('clientes').insert({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado }).returning('*');

        if (!clienteCadastrado) {
            return res.status(400).json({
                mensagem: 'O cliente não foi cadastrado.'
            });
        }

        return res.status(201).json(clienteCadastrado);

    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor.'
        });
    }
};


const listarClientes = async (req, res) => {

    try {
        const clientes = await knex('clientes').orderBy('id', 'asc');

        return res.status(200).json(clientes);

    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor.'
        });
    }
}

const detalharCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const clienteExistente = await knex('clientes').where({ id: id }).first();

        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado!' });
        }

        return res.status(200).json({ cliente: clienteExistente });

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' })
    }
};

const atualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        const clienteExistente = await knex('clientes').where({ id: id }).first();

        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado!' });
        }

        const emailExiste = await knex('clientes').where({ email }).first();

        if (emailExiste && emailExiste.id !== clienteExistente.id) {
            return res.status(400).json({
                mensagem: 'Já existe um cliente cadastrado com esse email.'
            });
        }

        const cpfExiste = await knex('clientes').where({ cpf }).first();

        if (cpfExiste && cpfExiste.id !== clienteExistente.id) {
            return res.status(400).json({
                mensagem: 'Já existe um cliente cadastrado com esse cpf.'
            });
        }

        const clienteAtualizado = await knex('clientes').where({ id }).update({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado }).returning('*');

        return res.status(200).json(clienteAtualizado);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' })
    }
}


module.exports = {
    cadastrarCliente,
    listarClientes,
    detalharCliente,
    atualizarCliente
};