/* This is an example schema */

const Joi = require('joi');

const exampleSchema = Joi.object({
   firstName: Joi.string(),
   lastName: Joi.string(),
   email: Joi.string(),
   password : Joi.string(),
   id: Joi.string()
  
});

module.exports = { exampleSchema };