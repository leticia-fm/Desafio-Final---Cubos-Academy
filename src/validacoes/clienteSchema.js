const joi = require('joi');

const clienteSchema = joi.object({
    nome: joi.string().required().messages({
        'string.base': 'O campo nome deve ser string.',
        'any.required': 'O campo nome é obrigatório.',
        'string.empty': 'O campo nome é obrigatório.'
    }),
    email: joi.string().email().required().messages({
        'string.email': 'O campo email precisa ter um formato válido.',
        'any.required': 'O campo email é obrigatório.',
        'string.empty': 'O campo email é obrigatório.',
    }),
    cpf: joi.string().length(11).required().messages({
        'string.base': 'O campo cpf deve ser string.',
        'any.required': 'O campo cpf é obrigatório.',
        'string.empty': 'O campo cpf é obrigatório.',
        'string.length': 'O cpf deve ter exatamente 11 dígitos.'
    }),
    cep: joi.optional(),
    rua: joi.optional(),
    numero: joi.optional(),
    bairro: joi.optional(),
    cidade: joi.optional(),
    estado: joi.optional()
})

module.exports = clienteSchema;