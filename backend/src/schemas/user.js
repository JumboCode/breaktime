const Joi = require('joi');

const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    age: Joi.number().integer().positive().required(),
    gender: Joi.string().required(),
    race: Joi.string().required(),
    zone: Joi.string().required()
});

module.exports = { userSchema };