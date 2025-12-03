/*  staff.js
 *  This file contains a staff account creation endpoint route for the backend
 */

const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { staffUser } = require('../schemas/staff');
const { clerkClient } = require('@clerk/backend'); 

/* * POST /create :
 *      summary: creates a new staff entry in collection
 * 
 *      requestBody:
 *          required: true
 *         content:
 *             json:
 *          schema:
 *             properties:
 *               firstName:
 *                 type: String
 *              lastName:
 *                type: String
 *              email:
 *                type: String
 *              username:
 *                type: String
 *              password:
 *                type: String
 *              required:
 *               - firstName
 *                - lastName
 *               - email
 *              - username
 *             - password
 *      responses:
 *        200:
 *          description: - success message with the new staff user created
 *        400:
 *          description: - error message when invalid request body is sent to endpoint
 *       500:
 *         description: - json with an error message and the error caught
 * */
router.post('/create', async (req, res) => {
    try {
        // Get correct database collection in mongoDB, store to variables
        const client = await mongodbPromise;
        const database = client.db('requests');
        const collection = database.collection('accounts');

        // Validate body of request
        const { error } = staffUser.validate(req.body);
        
        if (error) {
                return res.status(400).send(error.details[0].message);
        } else {
                // Set req body to individual fields
                const { firstName, lastName, email, username, password } = req.body;

                // Instead of generating a random username, take input from body
                const newStaff = {
                        firstName, 
                        lastName,
                        username,
                        email,
                        permissionLevel: 0 
                };

                // For CLERK = populate mostly the same fields
                const clerkUser = {
                        username: username,
                        password: password,
                        publicMetadata: {
                                permission: '0'
                        }
                };

                // Await clerk return, return success
                const user = await clerkClient.users.createUser(clerkUser);

                if (!user || user.errors) {
                        return res.status(500).json({
                                message: 'Error creating user in Clerk.',
                                error: user?.errors
                        });
                }
                // Await insertion of the new user into mongoDB
                const document = await collection.insertOne(newStaff);

                return res.status(200).json({
                        message: 'User created successfully',  _id: document.insertedId, user 
                });
        }

    } catch (error){
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

// Export this module so it's available to other users
module.exports = router;