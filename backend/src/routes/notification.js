const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { notificationSchema } = require('../schemas/notification');


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
                for (const notif of notifs) {
                        if (notif.notificationID > min + 1) {
                                return min + 1;
                        }
                        min = notif.notificationID;
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

module.exports = router;