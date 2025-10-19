const Joi = require('joi');

const servicesSchema = Joi.object({
   title: Joi.string().required(),
   id: Joi.string().required(),
   rules: Joi.string().required(),
   description: Joi.string().required(),
   serviceDuration: Joi.number().integer().positive().required(),
   availability : Joi.array().items(
      Joi.object({
         dayOfWeek: Joi.pattern(/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i),
         startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), // "HH:mm"
         endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required()
      }).required()
   )
});

module.exports = { servicesSchema };