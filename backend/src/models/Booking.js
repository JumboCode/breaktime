/*
 * Booking.js
 * Mongoose model for booking documents
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    serviceID: {
        type: String,
        required: true
    },
    bookingID: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending'
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    duration: [{
        day: {
            type: String,
            enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            required: true
        },
        startTime: {
            type: String,
            required: true,
            match: /^\d{2}:\d{2}$/  // HH:mm format
        },
        endTime: {
            type: String,
            required: true,
            match: /^\d{2}:\d{2}$/  // HH:mm format
        }
    }]
}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

const Booking = mongoose.connection.useDb('services').model('Booking', bookingSchema, 'bookings');

module.exports = Booking;
