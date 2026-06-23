/*  user.js
 *  This file contains a user account creation endpoint route for the backend
 */

const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { userSchema } = require('../schemas/user');
const clerkClient = require('../utils/clerk');

/* * POST /create :
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
                const { firstName, lastName, password, age, gender, race } = req.body;

                // Generate username: [first letter][first 5 of last name][2-digit suffix]
                let username = await username_generation(collection, firstName, lastName);
                
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
                        firstName: firstName,
                        lastName: lastName,
                        publicMetadata: {
                                permission: '0',
                                race: race,
                                age: age,
                                gender: gender
                        }
                };

                // Await clerk return, return success
                const user = await clerkClient.users.createUser(clerkUser);
                return res.status(200).json({
                        message: 'User created successfully', username, _id: document.insertedId, user
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

/* * GET /getAll :
 *      summary: Returns all approved YA users (permission level 1).
 *
 *      responses:
 *        200:
 *          description: Array of { id, username } objects for all YA users.
 *        500:
 *          description: Error fetching from Clerk.
 */
router.get('/getAll', async (req, res) => {
    try {
        let allUsers = [];
        let offset = 0;
        const limit = 100;

        // Page through Clerk's user list to collect all YA users
        while (true) {
            const result = await clerkClient.users.getUserList({ limit, offset });
            const page = Array.isArray(result) ? result : (result?.data || []);
            if (page.length === 0) break;

            const yaUsers = page
                .filter(u => u.firstName)
                .map(u => ({ id: u.id, username: u.username, firstName: u.firstName || "", lastName: u.lastName || "" }));

            allUsers = allUsers.concat(yaUsers);
            if (page.length < limit) break;
            offset += limit;
        }

        return res.status(200).json({ users: allUsers });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error fetching users from Clerk: ', error });
    }
});

// Generate username: [first letter of first name][first 5 of last name][2-digit suffix]
// Example: Luis Suarez → lsuare00, next lsuare01, etc.
async function username_generation(collection, firstName, lastName) {
        const base = firstName[0].toLowerCase() + lastName.substring(0, 5).toLowerCase();
        const existing = await collection.countDocuments({ username: { $regex: `^${base}\\d{2}$` } });
        let num = existing;
        let username = base + String(num).padStart(2, '0');
        while (await collection.findOne({ username })) {
                num++;
                if (num > 99) throw new Error('Username limit reached for this name combination');
                username = base + String(num).padStart(2, '0');
        }
        return username;
}

// Export this module so it's available to other users
module.exports = router;
