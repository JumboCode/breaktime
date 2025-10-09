const Joi = require('joi');

const servicesSchema = Joi.object({
   Rules: Joi.string(),
   Description: Joi.string(),
   Title: Joi.string(),
   Availability : Joi.string(),
   id: Joi.string()
  
});

module.exports = { servicesSchema };