const Joi = require('joi');

const notificationSchema = Joi.object({
   userID: Joi.string().required(),
   notificationID: Joi.int().required(),
   type : Joi.string(
      Joi.object({
         values: Joi.pattern(/^(BOOKING_CREATED|BOOKING_CONFIRMED|BOOKING_CANCELLED|BOOKING_REMINDER|ALERT)$/),
      }).required()
   ),
   title: Joi.string().required(),
   message: Joi.string().required(),
   timestamp: Joi.date().required()
});

module.exports = { notificationSchema };