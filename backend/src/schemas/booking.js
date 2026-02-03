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
   bookingID: Joi.number().integer().positive().required(),
   status: Joi.string().valid('pending', 'confirmed', 'canceled').default('pending'),
   timestamp: Joi.date().required(),
   duration : Joi.array().items(
      Joi.object({
         day: Joi.string().valid('sunday', 'monday', 'tuesday', 'wednesday', 
            'thursday', 'friday', 'saturday').required(),
         startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), 
         // HH:mm format
         endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required()    
         // HH:mm format
      }).required()
   ).required(),
   clientName: Joi.string().optional() 
   // Display name for the client (added for frontend integration)
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

module.exports = { bookingSchema, getBookingsValidate };
