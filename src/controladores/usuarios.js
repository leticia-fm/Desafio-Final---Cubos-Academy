const knex = require('../conexoes/conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const usuarioEncontrado = await knex('usuarios').where({ email }).first();

        if (usuarioEncontrado) {
            return res.status(400).json({ menssagem: "O e-mail já existe" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios')
            .insert({
                nome,
                email,
                senha: senhaCriptografada
            }).returning(['id', 'nome', 'email']);

        return res.status(201).send(usuario);
    } catch (error) {
        return res.status(500).json({ menssagem: 'Erro interno do servidor' });
      
    }
};

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    const { id } = req.usuario;

    try {
        const usuarioEncontrado = await knex('usuarios').where({ id }).first();

        const emailExiste = await knex('usuarios').where({ email }).first();

        if (!usuarioEncontrado) {
            return res.status(404).json({ menssagem: "Usuário não encontrado" });
        }
        if (emailExiste) {
            return res.status(400).json({ menssagem: "O e-mail já existe" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios')
            .where({ id })
            .update({
                nome,
                email,
                senha: senhaCriptografada
            }).returning(['id', 'nome', 'email']);

        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ menssagem: 'Erro interno do servidor' });
    }
};

const detalharPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
};

module.exports = {
    cadastrarUsuario,
    atualizarUsuario,
    detalharPerfil
}