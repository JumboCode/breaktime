const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
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
        // Get MongoDB client and connect to services database
        const client = await mongodbPromise;
        const database = client.db('services');
        const bookingsCollection = database.collection('bookings');
        const countersCollection = database.collection('counters');

        // Get next bookingID from counter and atomically increment it
        const counter = await countersCollection.findOneAndUpdate(
            { name: 'bookingID' },
            { $inc: { value: 1 } },
            {
                returnDocument: 'after',
                upsert: true
            }
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

        // Insert the booking into MongoDB
        const result = await bookingsCollection.insertOne(bookingData);

        return res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                _id: result.insertedId,
                bookingID: bookingData.bookingID,
                userID: bookingData.userID,
                serviceID: bookingData.serviceID,
                status: bookingData.status,
                timestamp: bookingData.timestamp,
                duration: bookingData.duration
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

// PUT /edit - Edit an existing booking's status and/or duration
// Client passes: bookingID and optionally status and/or duration
router.put('/edit', async (req, res) => {
    try {
        // Get MongoDB client and connect to services database
        const client = await mongodbPromise;
        const database = client.db('services');
        const bookingsCollection = database.collection('bookings');

        const { bookingID, status, duration } = req.body;

        // Convert bookingID to number
        const bookingIDNum = Number(bookingID);

        // Validate required field
        if (!bookingID || isNaN(bookingIDNum)) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: 'Valid bookingID is required'
            });
        }

        // Check that at least one field to update is provided
        if (!status && !duration) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: 'At least one field (status or duration) must be provided for update'
            });
        }

        // Build the update object dynamically
        const updateFields = {
            timestamp: new Date() // Always update timestamp
        };

        // Validate and add status if provided
        if (status !== undefined) {
            const validStatuses = ['pending', 'confirmed', 'canceled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: `status must be one of: ${validStatuses.join(', ')}`
                });
            }
            updateFields.status = status;
        }

        // Validate and add duration if provided
        if (duration !== undefined) {
            // Use Joi to validate duration structure
            const Joi = require('joi');
            const durationSchema = Joi.array().items(
                Joi.object({
                    day: Joi.string().valid('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday').required(),
                    startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
                    endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required()
                }).required()
            ).required();

            const { error } = durationSchema.validate(duration);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: error.details[0].message
                });
            }
            updateFields.duration = duration;
        }

        // Find and update the booking
        const updatedBooking = await bookingsCollection.findOneAndUpdate(
            { bookingID: bookingIDNum },
            { $set: updateFields },
            { returnDocument: 'after' } // Return the updated document
        );

        // Check if booking was found
        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
                error: `No booking found with bookingID: ${bookingIDNum}`
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
        // Get MongoDB client and connect to services database
        const client = await mongodbPromise;
        const database = client.db('services');
        const bookingsCollection = database.collection('bookings');

        // TODO: Check in with Yoda, Luis, and Sean that bookingID should
        // be the var we delete off of.
        const { bookingID } = req.body;

        // Convert bookingID to number
        const bookingIDNum = Number(bookingID);

        // Validate required field
        if (!bookingID || isNaN(bookingIDNum)) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: 'Valid bookingID is required'
            });
        }

        const deletedBooking = await bookingsCollection.findOneAndDelete({ bookingID: bookingIDNum });

        // Check if booking was found
        if (!deletedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
                error: `No booking found with bookingID: ${bookingIDNum}`
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
        // Get MongoDB client and connect to services database
        const client = await mongodbPromise;
        const database = client.db('services');
        const countersCollection = database.collection('counters');

        await countersCollection.findOneAndUpdate(
            { name: 'bookingID' },
            { $set: { value: 0 } },
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

/**
 * input that /create
 * userID
 * serviceID
 * duration
 * 
 * input that /edit requires
 * bookingID
 * status
 * AND OR
 * duration
 * 
 * input that /delete requires
 * bookingID
 * 
 * I think from a security point of view, we need someway to authenticate users who try to /edit or /delete.
 * this could be done using JWT's, confirming that only admins are executing these functions
 */

//questions
/**
 * what is an example input?
 * 
 */

const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');

/* * POST /history :
 *      summary: Get booking history for a specific user
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                schema:
 *                  properties:
 *                    userID:
 *                      type: string
 *                  required:
 *                    - userID
 *      responses:
 *        200:
 *          description: - json with array of bookings sorted by timestamp (most recent first)
 *        400:
 *          description: - error message when userID is missing or invalid
 *        500:
 *          description: - json with an error message if there is an issue connecting to MongoDB
 * */
router.post('/history', async (req, res) => {
    try {
        // Extract and validate userID from request body
        const { userID } = req.body;

        if (!userID || typeof userID !== 'string') {
            return res.status(400).send('userID is required and must be a string');
        }

        // Validate userID format: must start with "YA_" or "ya_" followed by numbers
        const userIDPattern = /^ya_\d+$/i; // Case-insensitive check
        if (!userIDPattern.test(userID)) {
            return res.status(400).send('userID must start with "YA_" followed by numbers');
        }

        // Get MongoDB client and connect to bookings collection
        const client = await mongodbPromise;
        const database = client.db('services');
        const collection = database.collection('bookings');

        // Query for all bookings with matching userID, sorted by timestamp (descending)
        const bookings = await collection
            .find({ userID })
            .sort({ timestamp: -1 })
            .toArray();

        // Return bookings array (empty array if no bookings found)
        return res.status(200).json({ bookings });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

module.exports = router;