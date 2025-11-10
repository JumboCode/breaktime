const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Counter = require('../models/Counter');
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
        // Get next bookingID from counter and atomically increment it
        const counter = await Counter.findOneAndUpdate(
            { name: 'bookingID' },
            { $inc: { value: 1 } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        const bookingID = counter.value;
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

// PUT /edit - Edit an existing booking's status
// Client passes: bookingID and status ('confirmed' or 'canceled')
router.put('/edit', async (req, res) => {
    try {
        const { bookingID, status } = req.body;

        // Validate required fields
        if (!bookingID) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: 'bookingID is required'
            });
        }

        // Validate status exists
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: 'status is required'
            });
        }

        // Validate status value
        const validStatuses = ['pending', 'confirmed', 'canceled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: `status must be one of: ${validStatuses.join(', ')}`
            });
        }

        // Find and update the booking
        const updatedBooking = await Booking.findOneAndUpdate(
            { bookingID },
            { 
                status,
                timestamp: new Date() // Update timestamp to current time
            },
            { new: true } // Return the updated document
        );

        // Check if booking was found
        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
                error: `No booking found with bookingID: ${bookingID}`
            });
        }

        // Return edit success response
        return res.status(200).json({
            success: true,
            message: 'Booking updated successfully',
            data: {
                _id: updatedBooking._id,
                bookingID: updatedBooking.bookingID,
                userID: updatedBooking.userID,
                serviceID: updatedBooking.serviceID,
                status: updatedBooking.status,
                timestamp: updatedBooking.timestamp,
                duration: updatedBooking.duration
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking',
            error: error.message
        });
    }
});

// DELETE /delete - Delete a booking
// Client passes: bookingID
router.delete('/delete', async (req, res) => {
        try {
            // TODO: Check in with Yoda, Luis, and Sean that bookingID should
            // be the var we delete off of. 
            const { bookingID } = req.body;
    
            // Validate required field
            if (!bookingID) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: 'bookingID is required'
                });
            }
    
            const deletedBooking = await Booking.findOneAndDelete({ bookingID });
    
            // Check if booking was found
            if (!deletedBooking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found',
                    error: `No booking found with bookingID: ${bookingID}`
                });
            }
    
            // Return delete success response
            return res.status(200).json({
                success: true,
                message: 'Booking deleted successfully',
                data: {
                    bookingID: deletedBooking.bookingID,
                    userID: deletedBooking.userID,
                    serviceID: deletedBooking.serviceID
                }
            });
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Error deleting booking',
                error: error.message
            });
        }
    });

// POST /reset-counter - Reset booking ID counter to 0 (for testing purposes)
router.post('/reset-counter', async (req, res) => {
    try {
        await Counter.findOneAndUpdate(
            { name: 'bookingID' },
            { value: 0 },
            { upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Booking ID counter has been reset to 0'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error resetting counter',
            error: error.message
        });
    }
});

module.exports = router;