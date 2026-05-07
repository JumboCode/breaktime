const Joi = require('joi');

/**
 * Booking Schema
 *
 * Validates booking data before storing in MongoDB.
 *
 * Fields:
 * - userID: The authenticated user's ID (e.g., "YA_1")
 * - serviceID: Type of service booked (e.g., "services", "laundry", "meeting")
 * - bookingID: Auto-generated unique identifier (incrementing integer)
 * - status: Current booking status - "pending", "confirmed", or "canceled"
 * - timestamp: When the booking was created/last modified
 * - duration: Array containing day and time information
 *     - day: Day of week (lowercase, e.g., "monday")
 *     - startTime: Start time in 24-hour format (e.g., "09:00")
 *     - endTime: End time in 24-hour format (e.g., "10:00")
 * - clientName: Display name for the client (optional, e.g., "John Doe")
 *
 * Example valid booking:
 * {
 *   userID: "YA_1",
 *   serviceID: "services",
 *   bookingID: 12,
 *   status: "pending",
 *   timestamp: new Date(),
 *   duration: [{ day: "monday", startTime: "09:00", endTime: "10:00" }],
 *   clientName: "John Doe"
 * }
 */
const bookingSchema = Joi.object({
   userID: Joi.string().required(),
   serviceID: Joi.string().required(),
   bookingID: Joi.string().required(),
   status: Joi.string().valid('confirmed', 'canceled').default('confirmed').required(),
   timestamp: Joi.string().required(),
   duration: Joi.object({
      day: Joi.string()
         .valid('sunday', 'monday', 'tuesday','wednesday','thursday','friday', 'saturday')
         .required(),

      startTime: Joi.string() // Formatted HH:MM
         .pattern(/^\d{2}:\d{2}$/)
         .required(),

      endTime: Joi.string() // Formatted HH:MM
         .pattern(/^\d{2}:\d{2}$/)
         .required()
   }).required(),
   clientName: Joi.string().allow('').optional(), 
   activity: Joi.array().items(
      Joi.array().ordered(
         Joi.string().valid('created', 'canceled', 'modified', 'time', 'note'),
         Joi.string()
      ).length(2)
   ).min(1).required(),
   notes: Joi.string().allow('').optional()

});

/**
 * Get Bookings Validation Schema
 *
 * Validates query parameters for fetching bookings by service and date.
 */
const getBookingsValidate = Joi.object({
   serviceID: Joi.string().required(),
   date: Joi.string()
        .pattern(/^(0[1-9]|1[0-2])\/\d{4}$/) // MM/YYYY format
        .required()
});

const bookingCreationSchema = Joi.object({
   userID: bookingSchema.extract('userID'),
   serviceID: bookingSchema.extract('serviceID'),
   duration: bookingSchema.extract('duration'),
   clientName: bookingSchema.extract('clientName'),
   timestamp: bookingSchema.extract('timestamp'),
   notes: bookingSchema.extract('notes')
});

module.exports = { bookingSchema, getBookingsValidate, bookingCreationSchema };
