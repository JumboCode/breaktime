const Joi = require('joi');

const bookingSchema = Joi.object({
   userID: Joi.string().required(),
   serviceID: Joi.string().required(),
   bookingID: Joi.string().required(),
   status: Joi.pattern(/^(pending|confirmed|canceled)$/i).default('pending'),
   timestamp: Joi.date().required(), // Last modified/
   duration : Joi.array().items(
      Joi.object({
         day: Joi.pattern(/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i),
         startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), // "HH:mm"
         endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required()
      }).required()
   )
});

module.exports = { bookingSchema };
