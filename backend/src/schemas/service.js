const Joi = require('joi');

const servicesSchema = Joi.object({
   title: Joi.string().required(),
   id: Joi.string().required(),
   rules: Joi.string().required(),
   description: Joi.string().required(),
   serviceDurationInterval: Joi.number().integer().positive().required(),
   availability : Joi.array().items(
      Joi.object({
         day: Joi.string().pattern(/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i),
         startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), // "HH:mm"
         endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required()
      }).required()
   )
});

const serviceExtensionSchema = Joi.object({
   extensionID: Joi.string().required(),
   bookingID: Joi.string().required(),
   userID: Joi.string().required(),
   originalDuration: Joi.array().items(
      Joi.object({
         day: Joi.string().pattern(/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i),
         startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), // "HH:mm"
         endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required()
      }).required()
   ),
   newDuration: Joi.array().items(
      Joi.object({
         day: Joi.string().pattern(/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i),
         startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), // "HH:mm"
         endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required()
      }).required()
   ),
   status: Joi.string().pattern(/^(pending|approved|denied)$/i).default('pending'),
   submittedTime: Joi.date().required()
});

const serviceExtensionValidate = Joi.object({
   extensionID: Joi.string().required()
});

module.exports = { 
   servicesSchema, 
   serviceExtensionSchema, 
   serviceExtensionValidate 
};
