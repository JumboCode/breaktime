const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { notificationSchema } = require('../schemas/service');
const { clerkClient } = require('@clerk/clerk-sdk-node');

/* This endpoint will receive as input a req.body with the fields listed in the 
notification schema except for the notificationID.

The endpoint will then check the next available notificationID for the specific user

Ex: If a userID has notificationIDs [2, 3, 4, 6] the endpoint will create a 
notification object with ID 1.

This endpoint will create a notification object and send it to the notification
collection in the notification database in Mongo. */

async function getNextNotificationID(userID, collection) {
        let found = false;
        let min = 0;
        while (!found) {
                const notifs = await collection.find({ userID: userID, notificationID: { $gt: min } }, 
                        { projection: { notificationID: 1 } })
                .sort({ notificationID: 1 })
                .limit(100)
                .toArray()
                
                if (notifs.length === 0) {
                        return min + 1;
                }      
        }
}

router.post('/create', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('notifications');
        const collection = database.collection('notifications');
        
        const { error } = notificationSchema.validate(req.body);

        if (error) {
                return res.status(400).send(error.details[0].message);
        } else {
                const { userID, type, title, message, timestamp } = req.body;

                const notificationID = await getNextNotificationID(userID, collection);

                const newNotif = {
                        userID,
                        notificationID,
                        type,
                        title,
                        message,
                        timestamp
                };

                const document = await collection.insertOne(newNotif);

                return res.status(200).json({ message: 'Service created successfully', _id: document.insertedId });
        }

    } catch (error){
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});