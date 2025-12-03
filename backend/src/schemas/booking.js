const Joi = require('joi');

const bookingSchema = Joi.object({
   userID: Joi.string().required(),
   serviceID: Joi.string().required(),
   bookingID: Joi.number().integer().positive().required(),
   status: Joi.string().valid('pending', 'confirmed', 'canceled').default('pending'),
   timestamp: Joi.date().required(), // Last modified/
   duration : Joi.array().items(
      Joi.object({
         day: Joi.string().valid('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday').required(),
         startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), // "HH:mm"
         endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required()
      }).required()
   ).required()
});

module.exports = { bookingSchema };
