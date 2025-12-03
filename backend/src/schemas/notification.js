const Joi = require('joi');

const notificationSchema = Joi.object({
   userID: Joi.string().required(),
   notificationID: Joi.number(),
   type : Joi.string()
         .valid('BOOKING_CREATED', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'BOOKING_REMINDER', 'ALERT'),
         
   title: Joi.string(),
   message: Joi.string(),
   timestamp: Joi.date()
});

module.exports = { notificationSchema };