const joi = require('joi')

const produtoSchema = joi.object({
    descricao: joi.string().required().messages({
        'any.required': "O campo descrição é obrigatório",
        'string.empty': "O campo descrição é obrigatório"
    }),
    quantidade_estoque: joi.number().positive().integer().required().messages({
        'any.required': "O campo quantidade_estoque é obrigatório",
        'number.empty': "O campo quantidade_estoque é obrigatório",
        'number.base': 'A quantidade deve ser um número',
        'number.positive': "A quantidade não pode ser menor que zero"
    }),
    valor: joi.number().positive().integer().min(1).required().messages({
        'any.required': "O campo valor é obrigatório",
        'number.empty': "O campo valor é obrigatório",
        'number.base': 'O valor deve ser um número',
        'number.positive': "O valor não pode ser menor que zero",
        'number.min': 'O valor mínimo não pode ser menor que 1'
    }),
    categoria_id: joi.number().integer().required().messages({
        'any.required': "O campo categoria_id é obrigatório",
        'number.empty': "O campo categoria_id é obrigatório",
        'number.base': 'A categoria_id deve ser um número'
    })
});

module.exports = produtoSchema;

