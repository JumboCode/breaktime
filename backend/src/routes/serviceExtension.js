/**
 * serviceExtension.js
 * Service Extension routes
 */
const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { serviceExtensionValidate } = require('../schemas/service');

/* * GET /accept :
 *      summary: Approves service extension request.
 * 
 *      requestBody:
 *          required: true
 *          content: 
 *              json:
 *                schema:
 *                  properties:
 *                    extensionID:
 *                       type: string
 * 
 *                    required:
 *                      - extensionID
 *
 * 
 *      responses:
 *        200:
 *          description: - json with a success message. Status updated.
 *        400:
 *          description: - error message when invalid request body is sent to endpoint
 *        500:
 *          description: - json with an error message and the error caught
 * */
router.post('/accept', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('requests');
        const collection = database.collection('booking_extensions');        
        const { error } = serviceExtensionValidate.validate(req.body);

        if (error) { // validate request
            return res.status(400).send({
                message: 'Invalid request body',
                error: error.details[0].message
            });
        } else {
            // Find service extension based on extensionID
            const { extensionID } = req.body;
            const pendingExtension = await collection.findOne({ extensionID });

            if (!pendingExtension) {
                return res.status(404).send({
                    message: 'Service Extension ' + extensionID + ' not found in pending requests.'
                });
            }

            // Update status level in MongoDB
            const result = await collection.updateOne(
                { extensionID },
                { $set: { status: 'approved' } }
            );
            if (result.modifiedCount === 0) { // check successful update
                return res.status(500).send({
                    message: 'Error updating Service Extension ' + extensionID + ' status.'
                });
            }

            console.log(result);
    
            res.status(200).send({
                message : 'Service Extension ' + extensionID + ' successfully approved.'
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

/* * GET /deny :
 *      summary: Denies service extension request.
 * 
 *      requestBody:
 *          required: true
 *          content: 
 *              json:
 *                schema:
 *                  properties:
 *                    extensionID:
 *                       type: string
 * 
 *                    required:
 *                      - extensionID
 *
 * 
 *      responses:
 *        200:
 *          description: - json with a success message. Status updated.
 *        400:
 *          description: - error message when invalid request body is sent to endpoint
 *        500:
 *          description: - json with an error message and the error caught
 * */
router.post('/deny', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('requests');
        const collection = database.collection('booking_extensions');        
        const { error } = serviceExtensionValidate.validate(req.body);

        if (error) { // validate request
            return res.status(400).send({
                message: 'Invalid request body',
                error: error.details[0].message
            });
        } else {
            // Find service extension based on extensionID
            const { extensionID } = req.body;
            const pendingExtension = await collection.findOne({ extensionID });

            if (!pendingExtension) {
                return res.status(404).send({
                    message: 'Service Extension ' + extensionID + ' not found in pending requests.'
                });
            }

            // Update status level in MongoDB
            const result = await collection.updateOne(
                { extensionID },
                { $set: { status: 'denied' } }
            );
            if (result.modifiedCount === 0) { // check successful update
                return res.status(500).send({
                    message: 'Error updating Service Extension ' + extensionID + ' status.'
                });
            }

            console.log(result);
    
            res.status(200).send({
                message : 'Service Extension ' + extensionID + ' was denied.'
            });
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