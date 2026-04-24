const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { servicesSchema } = require('../schemas/service');
const { getBookingsValidate } = require('../schemas/booking');

/* * POST /create  :
 *      summary: Create a new service in booking extensions collection
 * 
 *      requestBody:
 *          required: true
 *          content: 
 *              json:
 *                schema:
 *                  properties:
 *                    id:
 *                     type: string
 *                    rules:
 *                     type: string
 *                    description:
 *                     type: string
 *                    serviceDurationInterval:
 *                     type: integer
 *                    availability:
 *                     type: array
 *                     items:
 *                         type: object
 *                      properties:
 *                        day:
 *                          type: string
 *                        startTime:
 *                          type: string
 *                        endTime:
 *                          type: string    
 *                  required:
 *                   - id
 *                   - rules
 *                   - description
 *                   - serviceDurationInterval
 *                   - availability
 *      responses:
 *        200:
 *          description: - json with a success message and the id of the created service
 *        400:
 *          description: - json with an error message if the request body is invalid
 *        500:
 *          description: - json with an error message if there is an issue connecting to MongoDB
 * */
router.post('/create', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('services');
        const collection = database.collection('services');

        const { error } = servicesSchema.validate(req.body);

        if (error) {
                return res.status(400).send(error.details[0].message);
        } else {
                const { id, rules, description, 
                    serviceDurationInterval, availability } = req.body;

                const newService = {
                        id,
                        rules,
                        description,
                        serviceDurationInterval,
                        availability
                };

                const document = await collection.insertOne(newService);

                return res.status(200).json({ 
                    message: 'Service created successfully', _id: document.insertedId });
        }

    } catch (error){
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

/* * PUT /update  :
 *      summary: Update an existing service in booking extensions collection
 * 
 *      requestBody:
 *          required: true
 *          content: 
 *              json:
 *                schema:
 *                  properties:
 *                    id:
 *                     type: string
 *                    rules:
 *                     type: string
 *                    description:
 *                     type: string
 *                    serviceDurationInterval:
 *                     type: integer
 *                    availability:
 *                     type: array
 *                     items:
 *                         type: object
 *                      properties:
 *                        day:
 *                          type: string
 *                        startTime:
 *                          type: string
 *                        endTime:
 *                          type: string    
 *                  required:
 *                   - id
 *                   - rules
 *                   - description
 *                   - serviceDurationInterval
 *                   - availability
 *      responses:
 *        200:
 *          description: - json with a success message and the id of the updated service
 *        400:
 *          description: - json with an error message if the request body is invalid
 *        500:
 *          description: - json with an error message if there is an issue connecting to MongoDB
 * */
router.put('/update', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('services');
        const collection = database.collection('services');

        const { error } = servicesSchema.validate(req.body);

        if (error) {
                return res.status(400).send(error.details[0].message);
        } else {
                const { id, rules, description, 
                    serviceDurationInterval, availability } = req.body;

                const updatedService = {
                        id,
                        rules,
                        description,
                        serviceDurationInterval,
                        availability
                };

                const foundId = await collection.findOne({ id });

                if (!foundId) {
                    return res.status(404).json({ message: 'Service ID not found.' });
                }

                const result = await collection.updateOne({ id }, { $set: updatedService });

                if (result.modifiedCount !== 0) {
                    return res.status(200).json({ message: 'Service updated successfully!' });
                }
        }

    } catch (error){
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

/* * DELETE /delete  :
 *      summary: Delete an existing service in booking extensions collection
 * 
 *      requestBody:
 *          required: true
 *          content: 
 *              json:
 *                schema:
 *                  properties:
 *                    id:
 *                     type: string
 *                    rules:
 *                     type: string
 *                    description:
 *                     type: string
 *                    serviceDurationInterval:
 *                     type: integer
 *                    availability:
 *                     type: array
 *                     items:
 *                         type: object
 *                      properties:
 *                        day:
 *                          type: string
 *                        startTime:
 *                          type: string
 *                        endTime:
 *                          type: string    
 *                  required:
 *                   - id
 *                   - rules
 *                   - description
 *                   - serviceDurationInterval
 *                   - availability
 *      responses:
 *        200:
 *          description: - json with a success message and the id of the deleted service
 *        400:
 *          description: - json with an error message if the request body is invalid
 *        500:
 *          description: - json with an error message if there is an issue connecting to MongoDB
 * */
router.delete('/delete', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('services');
        const collection = database.collection('services');

        const { error } = servicesSchema.validate(req.body);
        
        if (error) {
                return res.status(400).send(error.details[0].message);
        } else {
                const { id } = req.body;

                if (!id) {
                    return res.status(400).json({ message: 'Service ID is required' });
                }

                const foundId = await collection.findOne({ id });

                if (!foundId) {
                    return res.status(404).json({ message: 'Service ID not found.' });
                }

                await collection.deleteOne({ id });

                return res.status(200).json({ message: 'Service deleted successfully!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

/* * DELETE /delete  :
 *      summary: Delete an existing service in booking extensions collection
 * 
 *      requestBody:
 *          required: true
 *          content: 
 *              json:
 *                schema:
 *                  properties:
 *                    serviceID:
 *                     type: string
 *                    date:
 *                     type: string
 *                  required:
 *                   - serviceID
 *                   - date
 *      responses:
 *        200:
 *          description: - json with a success message and the json of the 
 *              retrieved bookings.
 *        400:
 *          description: - json with an error message if the request body is invalid
 *        404:
 *          description: - json with an error message if the serviceID does not exist 
 *                         or if there are no bookings with that serviceID found in that month
 *        500:
 *          description: - json with an error message if there is an issue connecting to MongoDB
 * */
router.get('/AllBookingsForService', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('services');
        const collection = database.collection('bookings');
        
        const { error } = getBookingsValidate.validate(req.body);

        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            // date = "MM/YYYY"
            const { serviceID, date } = req.body;
    
            const foundId = await collection.findOne({ serviceID });
            if (!foundId) {
                return res.status(404).json({ 
                    message: 'Bookings under Service ID ' + serviceID + 
                        ' not found.' 
                });
            }
            
            // parse into month and year 
            const [month, year] = date.split('/').map(String);

            // build date range
            const start = new Date(Date.UTC(year, month - 1, 1));  
            const end = new Date(Date.UTC(year, month, 1));       

            // query bookings inside that month
            const bookings = await collection.find({
                serviceID,
                timestamp: {
                    $gte: start,
                    $lt: end
                }
            }).toArray();
            
            if (bookings.length === 0) {
                res.status(404).send({
                    message : 'There are no bookings with service ID ' +
                    `${serviceID} in date ${date}`
                });
            } else {
                res.status(200).json({
                    message : `Bookings with service ID ${serviceID} ` +
                        `in date ${date} successfully retrieved`,
                    bookings
                });
            }
            
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

router.post('/getService', async (req, res) => {
    const { serviceID } = req.body;

    if (!serviceID) {
        res.status(400).send('serviceID is not provided');
    } else {
        try {
            const client = await mongodbPromise;
            const database = client.db('services');
            const service_collection = database.collection('services');

            const service_response = await service_collection.findOne({ id: serviceID });

            if (!service_response) {
                res.status(404).send(`${serviceID} has no services associated with it`);
                return;
            }

            res.status(200).send(service_response);
            
        } catch (error) {
            res.status(500).send({
                'message': 'Error connecting to MongoDB: ',
                error
            });
        }
    }
});

router.post('/getTimeslots', async (req, res) => {
    const { serviceID, date } = req.body;
    
    const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

    if (!serviceID || !isValidDate(date)) {
        res.status(400).send('Input provided is invalid');
    } else {
        try {
            const client = await mongodbPromise;
            const database = client.db('services');
            const booking_collection = database.collection('bookings');
            const service_collection = database.collection('services');

            const service_response = await service_collection.findOne({ id: serviceID });

            if (!service_response) {
                res.status(404).send(`${serviceID} has no services associated with it`);
                return;
            }
            
            const bookings_response = await booking_collection.find({ 
                serviceID: serviceID,
                timestamp: { $regex: `^${date}` }
            }).toArray();

            // Get the day of the week from the date
            const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }).toLowerCase();

            // Find availability for that day
            const dayAvailability = service_response.availability.find(a => a.day === dayOfWeek);

            if (!dayAvailability) {
                res.status(200).send([]);
                return;
            }

            const timeToMinutes = (time) => {
                const [hours, mins] = time.split(':').map(Number);
                return hours * 60 + mins;
            };

            // Generate all possible timeslots based on serviceDurationInterval
            const generateTimeslots = (startTime, endTime, interval) => {
                const slots = [];
                let [currentHour, currentMin] = startTime.split(':').map(Number);
                const [endHour, endMin] = endTime.split(':').map(Number);

                while (currentHour * 60 + currentMin + interval <= endHour * 60 + endMin) {
                    const slotStart = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
                    currentMin += interval;
                    currentHour += Math.floor(currentMin / 60);
                    currentMin = currentMin % 60;
                    const slotEnd = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
                    slots.push({ startTime: slotStart, endTime: slotEnd });
                }

                return slots;
            };

            // Check if a slot overlaps with any existing booking
            const isSlotAvailable = (slot) => {
                const slotStart = timeToMinutes(slot.startTime);
                const slotEnd = timeToMinutes(slot.endTime);

                return !bookings_response.some(booking => {
                    const bookingStart = timeToMinutes(booking.duration.startTime);
                    const bookingEnd = timeToMinutes(booking.duration.endTime); // 15 min grace period

                    return slotStart < bookingEnd && slotEnd > bookingStart;
                });
            };

            const allSlots = generateTimeslots(dayAvailability.startTime, 
                                               dayAvailability.endTime, 
                                               service_response.serviceDurationInterval);
            const availableSlots = allSlots.filter(isSlotAvailable);

            res.status(200).send(availableSlots);
            
        } catch (error) {
            res.status(500).send({
                'message': 'Error connecting to MongoDB: ',
                error
            });
        }
    }
});

module.exports = router;