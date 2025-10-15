/*  exampleRoute.js
 *  This file contains an example routes for the backend
 */

const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { exampleForkedSchema } = require('../schemas/exampleSchema');

/* * GET / :
 *      summary: sends a hello message when called
 * 
 *      requestBody:
 *          required: false
 * 
 *      responses:
 *        200:
 *          description: - success message
 *        400:
 *          description: - error message
 * */
router.get('/', (req, res) => {
    if (!req.body) {
        res.status(200).send('Hey twinnn!!!');
    } else {
        res.status(400).send('Don\'t give me a request body');
    }
});

/* * GET /mongodb :
 *      summary: creates a new entry in the Dummy database Dummy collection 
 * 
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                schema:
 *                  properties:
 *                    firstName:
 *                      type: String
 *                    lastName:
 *                      type: String
 *                    email:
 *                      type: String
 *                    password:
 *                      type: String
 * 
 *                  required:
 *                      - firstName
 *                      - lastName
 *                      - email
 *                      - password
 * 
 *      responses:
 *        200:
 *          description: - json with a success message and survey id returned.
 *        400:
 *          description: - error message when invalid request body is sent to endpoint
 *        500:
 *          description: - json with an error message and the error caught
 * */
router.get('/mongodb', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('Dummy');
        const collection = database.collection('Dummy');
        
        const { error } = exampleForkedSchema.validate(req.body);

        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            const { firstName, lastName, email, password } = req.body;
    
            const newEntry = {
                firstName,
                lastName,
                email,
                password
            };
    
            const document = await collection.insertOne(newEntry);
    
            res.status(200).send({
                message : 'Document successfully created',
                _id: document.insertedId
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