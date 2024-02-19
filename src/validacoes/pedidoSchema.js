const joi = require('joi')

const pedidoProdutoSchema = joi.object({
    produto_id: joi.number().required().messages({
        'any.required': 'O id do produto é obrigatório',
        'number.base': 'O id do produto deve ser um número'
    }),
    quantidade_produto: joi.number().integer().positive().min(1).required().messages({
        'any.required': 'A quantidade do produto é obrigatória',
        'number.base': 'A quantidade deve ser um número',
        'number.integer': 'A quantidade deve ser um número inteiro',
        'number.min': 'A quantidade mínima de produtos deve ser um',
        'number.positive': "A quantidade não pode ser menor que zero"
    })
});

const pedidoSchema = joi.object({
    cliente_id: joi.number().required().messages({
        'any.required': 'O id do cliente é obrigatório',
        'number.base': 'O id do cliente deve ser um número'
    }),
    observacao: joi.string().allow('').messages({
        'string.base': 'A observação precisa ser um texto'
    }),
    pedido_produtos: joi.array().items(pedidoProdutoSchema).min(1).required().messages({
        'any.required': 'Pelo menos um produto deve ser especificado',
        'array.min': 'Pelo menos um produto deve ser especificado'
    })
});

module.exports = pedidoSchema;
