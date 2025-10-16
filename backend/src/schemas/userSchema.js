const Joi = require('joi');

const userSchema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    age: Joi.int(),
    gender: Joi.string(),
    ethnicity: Joi.string(),
    zone: Joi.string()
});

module.exports = { userSchema };