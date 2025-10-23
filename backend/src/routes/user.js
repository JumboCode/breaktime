/*  user.js
 *  This file contains a user account creation endpoint route for the backend
 */

const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { userSchema } = require('../schemas/user');
const { clerkClient } = require('@clerk/clerk-sdk-node'); 


router.post('/', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('requests');
        const collection = database.collection('accounts');
    
        const { error } = userSchema.validate(req.body);
        
        if (error) {
                return res.status(400).send(error.details[0].message);
        } else {
                const { firstName, lastName, password, age, gender, race, zone } = req.body;

                let username = username_generation();
                while (await collection.findOne({ username })) {
                        username = username_generation();
                }
            
                const newUser = {
                        firstName, 
                        lastName,
                        username
                };

                const document = await collection.insertOne(newUser);

                const clerkUser = {
                        username: username,
                        password: password,
                        publicMetadata: {
                                permission: '1',
                                race: race,
                                age: age,
                                gender: gender,
                                zone: zone
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

function username_generation() {
        rand = Math.floor(Math.random() * 100000000);
        return 'YA_' + String(rand).padStart(8, '0');
}


module.exports = router;


