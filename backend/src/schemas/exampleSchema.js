/* This is an example schema */

const Joi = require('joi');

const baseExampleSchema = Joi.object({
   firstName: Joi.string(),
   lastName: Joi.string(),
   email: Joi.string(),
   password : Joi.string(),
   id: Joi.string()
});

const exampleForkedSchema = baseExampleSchema.fork(
   ['firstName', 'lastName', 'email', 'password'],
   (schema) => schema.required()
);

module.exports = { baseExampleSchema, exampleForkedSchema };