/*  user.js
 *  This file contains a user account creation endpoint route for the backend
 */

const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { userSchema } = require('../schemas/user');
const { clerkClient } = require('@clerk/clerk-sdk-node'); 

/* * POST /mongodb :
 *      summary: creates a new user entry in collection
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
 *             password:       
 *               type: String
 *              age:
 *               type: Number
 *             gender:
 *               type: String
 *              race:
 *               type: String
 *              zone:
 *               type: String
 *              required:
 *               - firstName
 *               - lastName
 *               - email
 *               - username
 *               - password
 *               - age
 *               - gender
 *               - race
 *               - zone
 *      responses:
 *        200:
 *          description: - success message with the new user created
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
        const { error } = userSchema.validate(req.body);
        
        if (error) {
                return res.status(400).send(error.details[0].message);
        } else {
                // Set req body to individual fields
                const { firstName, lastName, password, age, gender, race, zone } = req.body;

                // Generate user ID using 8 digit random num
                let username = username_generation();
                while (await collection.findOne({ username })) {
                        username = username_generation();
                }
                
                const newUser = {
                        firstName, 
                        lastName,
                        username,
                        permissionLevel: 0 // Populate as undef
                        // Validated and changed later
                };

                // Await insertion of the new user into mongoDB
                const document = await collection.insertOne(newUser);

                // For CLERK = populate mostly the same fields
                const clerkUser = {
                        username: username,
                        password: password,
                        publicMetadata: {
                                permission: '0',
                                race: race,
                                age: age,
                                gender: gender,
                                zone: zone
                        },
                };

                // Await clerk return, return success
                const user = await clerkClient.users.createUser(clerkUser);
                return res.status(200).json({ message: 'User created successfully',  _id: document.insertedId, user });
        }

    } catch (error){
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

// Generate a username, append string so it works with Clerk
// Example: YA_12345678
function username_generation() {
        rand = Math.floor(Math.random() * 100000000);
        return 'YA_' + String(rand).padStart(8, '0');
}

// Export this module so it's available to other users
module.exports = router;


