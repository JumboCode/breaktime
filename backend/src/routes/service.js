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
 *                    title:
 *                     type: string
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
 *                   - title
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
                const { title, id, rules, description, 
                    serviceDurationInterval, availability } = req.body;

                const newService = {
                        title,
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
 *                    title:
 *                     type: string
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
 *                   - title
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
                const { title, id, rules, description, 
                    serviceDurationInterval, availability } = req.body;

                const updatedService = {
                        title,
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
 *                    title:
 *                     type: string
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
 *                   - title
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

module.exports = router;