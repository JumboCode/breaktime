/*  user.js
 *  This file contains a user account creation endpoint route for the backend
 */

const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { userSchema } = require('../schemas/user');


router.get('/mongodb', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('requests');
        const collection = database.collection('accounts');
    
        const { error } = userSchema.validate(req.body);
        
        if (error) {
                res.status(400).send(error.details[0].message);
        } else {
                const { firstName, lastName, password, age, gender, race, zone } = req.body;

                const username = username_generation();

                const newUser = {
                        firstName, 
                        lastName,
                        username
                };

                const document = await collection.insertOne(newUser);
    
                res.status(200).send({
                    message : 'User successfully created',
                    _id: document.insertedId
                });

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
                return NextResponse.json({ message: 'User created successfully', user });

        }

    } catch {
        
    }
} 
);

function username_generation() {
        rand = Math.floor(Math.random() * 100000000);
        return 'YA_' + String(rand).padStart(8, '0');
}




