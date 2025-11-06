//made the booking.js file and new branch
// Working with service bookings in mongodb
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { bookingSchema } = require('../schemas/booking');


// WHAT CLIENT PASSES:
// userID
// serviceID
// duration
//      day
//      startTime
//      endTime

// FOR US TO MAKE
// bookingID (auto-generated incrementing number starting from 1)
// status (auto-populated to 'pending')
// timestamp (auto-populated to current date/time)

// POST /create - Create a new booking
router.post('/create', async (req, res) => {
    try {
        // Find the highest bookingID and increment by 1 using Mongoose
        const lastBooking = await Booking.findOne().sort({ bookingID: -1 }).select('bookingID');
        const bookingID = lastBooking ? lastBooking.bookingID + 1 : 1;
        const timestamp = new Date();

        // Build the booking data with auto-generated fields
        const bookingData = {
            userID: req.body.userID,
            serviceID: req.body.serviceID,
            bookingID,
            status: 'pending',
            timestamp,
            duration: req.body.duration
        };

        // Validate the complete booking data against Joi schema
        const { error } = bookingSchema.validate(bookingData);

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.details[0].message
            });
        }

        // Create and save the booking using Mongoose
        const newBooking = new Booking(bookingData);
        const savedBooking = await newBooking.save();

        return res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                _id: savedBooking._id,
                bookingID: savedBooking.bookingID,
                userID: savedBooking.userID,
                serviceID: savedBooking.serviceID,
                status: savedBooking.status,
                timestamp: savedBooking.timestamp,
                duration: savedBooking.duration
            }
        });

    } catch (error) {
        console.log(error);

        // Handle duplicate bookingID error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Booking already exists',
                error: 'Duplicate bookingID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

// router.post('/edit', async (req, res) => {
//     try {
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             'message': 'Error connecting to Server: ', error
//         });
//     } 
// });


// router.delete('/delete', async (req, res) => {
//     try {

//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             'message': 'Error connecting to Server: ', error
//         });
//     }
// });

module.exports = router;