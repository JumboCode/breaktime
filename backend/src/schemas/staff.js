const Joi = require('joi');

const staffUser = Joi.object({
   firstName: Joi.string().required(),
   lastName: Joi.string().required(),
   email: Joi.string().required(),
   username : Joi.string().required(),
   password: Joi.string().required()
  
});

module.exports = { staffUser };