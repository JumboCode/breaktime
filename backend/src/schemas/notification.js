const Joi = require('joi');

const notificationSchema = Joi.object({
   userID: Joi.string().required(),
   notificationID: Joi.number(),
   type : Joi.string()
         .valid('BOOKING_CREATED', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'BOOKING_REMINDER', 'ALERT')
         .required(),
   title: Joi.string().required(),
   message: Joi.string().required(),
   timestamp: Joi.date().required()
});

module.exports = { notificationSchema };