const Joi = require('joi');

const notificationSchema = Joi.object({
   senderID: Joi.string().required(),
   receiverID: Joi.string().required(),
   bookingID: Joi.string(),
   conversationID: Joi.string(),
   senderName: Joi.string(),
   type: Joi.string().valid('UPDATE', 'ALERT', 'MESSAGE').required(),
   isRead: Joi.boolean(),
   wasNotified: Joi.boolean(),
   title: Joi.string().required(),
   message: Joi.string().required(),
   timestamp: Joi.date()
});

module.exports = { notificationSchema };