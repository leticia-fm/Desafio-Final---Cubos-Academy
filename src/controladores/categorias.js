const knex = require('../conexoes/conexao');

const listarCategorias = async (req, res) => {
  try {
    const categorias = await knex('categorias').select('*');
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar categorias' });
  }
};

module.exports = { listarCategorias };