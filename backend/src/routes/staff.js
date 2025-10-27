/*  staff.js
 *  This file contains a staff account creation endpoint route for the backend
 */

const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { staffUser } = require('../schemas/staff');
const { clerkClient } = require('@clerk/clerk-sdk-node'); 

router.post('/', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('requests');
        const collection = database.collection('accounts');

        const { error } = staffUser.validate(req.body);
        
        if (error) {
                return res.status(400).send(error.details[0].message);
        } else {
                const { firstName, lastName, email, username, password } = req.body;

                const newUser = {
                        firstName, 
                        lastName,
                        username,
                        permissionLevel: 0 
                };

                const document = await collection.insertOne(newUser);

                const clerkUser = {
                        username: username,
                        password: password,
                        publicMetadata: {
                                permission: '0'
                        },
                };

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

module.exports = router;