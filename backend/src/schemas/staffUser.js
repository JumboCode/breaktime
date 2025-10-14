const Joi = require('joi');

const staffUser = Joi.object({
   firstName: Joi.string(),
   lastName: Joi.string(),
   email: Joi.string(),
   username : Joi.string(),
   password: Joi.string()
  
});

module.exports = { staffUser };