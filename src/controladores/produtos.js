const knex = require('../conexoes/conexao');
const { uploadImagem, deletarImagem } = require('../servicos/uploads');


const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body;
    const { file } = req;

    try {
        const produtoExistente = await knex('produtos').where({ descricao: descricao }).first()
        if (produtoExistente) {
            return res.json({ mensagem: 'Produto já cadastrado!' });
        }
        const categoriaExistente = await knex('categorias').where({ id: categoria_id }).first();
        if (!categoriaExistente) {
            return res.status(400).json({ mensagem: 'Categoria não encontrada' });
        }
        let produto = await knex('produtos').insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning('*');

        if (!produto) {
            return res.status(400).json({
                mensagem: 'O produto não foi cadastrado'
            });
        }

        const id = produto[0].id;

        if (file !== undefined) {
            const imagem = await uploadImagem(
                `produtos/${id}/${file.originalname}`,
                file.buffer,
                file.mimetype
            )

            produto = await knex('produtos').update({ produto_imagem: imagem.path }).where({ id }).returning('*');

            produto[0].urlImagem = imagem.url;
        }

        return res.status(201).json(produto[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor. ' })
    }
}

const deletarProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produtoExistente = await knex('produtos').where({ id: id }).first();

        if (!produtoExistente) {
            return res.status(404).json({ mensagem: 'Produto não encontrado!' });
        }

        const produtoPedido = await knex('pedido_produtos').where({ produto_id: id }).first();

        if(produtoPedido !== undefined) {
            return res.status(400).json({ mensagem: 'Produto não pode ser excluído, pois está em um pedido!' });
        }

        if(produtoExistente.produto_imagem !== null) {
            const sucesso = await deletarImagem(produtoExistente.produto_imagem);
            if(sucesso) {
               return res.status(500).json({mensagem: "Erro interno"}); 
            }
        }

        const produto = await knex("produtos").where({ id: id }).del();

        return res.status(200).json({ mensagem: 'Produto excluído com sucesso!' });
    } catch (err) {
        return res.status(500).json({ mensagem: 'Erro ao excluir o produto', error: err.message });
    }
};



const editarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body;
    const { id } = req.params;
    const {file} = req;

    try {
        const produtoExistente = await knex('produtos').where({ id: id }).first();
        if (!produtoExistente) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        const categoriaExistente = await knex('categorias').where({ id: categoria_id }).first();
        if (!categoriaExistente) {
            return res.status(400).json({ mensagem: 'Categoria não encontrada' });
        }
       
        
        if (produtoExistente.produto_imagem !== null && produtoExistente.produto_imagem !== undefined){
            await deletarImagem(produtoExistente.produto_imagem);
        }

    let produtoAtualizado = await knex('produtos')
        .where({ id: id })
        .update({ 
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        })
        .returning('*');

            if (file !== undefined) {
                const imagem = await uploadImagem(
                    `produtos/${produtoAtualizado[0].id}/${file.originalname}`,
                    file.buffer,
                    file.mimetype
                )
    
                produtoAtualizado = await knex('produtos').update({ produto_imagem: imagem.path }).where({ id }).returning('*');
    
                produtoAtualizado[0].urlImagem = imagem.url;
            } else {
                produtoAtualizado = await knex('produtos').update({ produto_imagem: null }).where({ id }).returning('*');
            }
    
        return res.status(200).json(produtoAtualizado[0]);

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
};

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;

    try {
        let query = knex('produtos');

        if (categoria_id) {
            const categoriaExistente = await knex('categorias').where({ id: categoria_id }).first();
            if (!categoriaExistente) {
                return res.status(400).json({ mensagem: 'Categoria não encontrada' });
            }

            query = query.where({ categoria_id });
        }

        const produtos = await query.select('*').orderBy('id', 'asc');

        return res.status(200).json(produtos);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
};


const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where({ id }).first();

        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto não encontrado!' });
        }

        return res.status(200).json(produto);
    } catch (err) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
}

module.exports = {
    cadastrarProduto,
    editarProduto,
    deletarProduto,
    listarProdutos,
    detalharProduto
}