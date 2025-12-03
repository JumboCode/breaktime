const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const { notificationSchema } = require('../schemas/notification');

/* Helper function to get the next available notificationID for a user */
async function getNextNotificationID(userID, collection) {
        let found = false;
        let min = 0;
        while (!found) {
                const notifs = await collection.find({ userID: userID, notificationID: { $gt: min } }, 
                        { projection: { notificationID: 1 } })
                .sort({ notificationID: 1 })
                .limit(100)
                .toArray();

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

/* * POST /create :
 *      summary: Creates a new notification for a user.
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                  schema:
 *                      properties:
 *                          userID:
 *                              type: String
 *                          type:
 *                              type: String
 *                          title:
 *                              type: String
 *                          message:
 *                              type: String
 *                          timestamp:
 *                              type: String
 *                      required:
 *                          - userID
 *                          - type
 *                          - title
 *                          - message
 *                          - timestamp
 *      responses:
 *          200:
 *              description: Success message with the newly created notification.
 *          400:
 *              description: Error message when request body is invalid.
 *          500:
 *              description: Error connecting to MongoDB or inserting notification.
 */
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

                if (!notificationID) {
                    return res.status(400).json({ message: 'Error generating notificationID' });
                }

                if (!type) {
                    return res.status(400).json({ message: 'type is required' });
                }

                if (!title) {
                    return res.status(400).json({ message: 'title is required' });
                }

                if (!message) {
                    return res.status(400).json({ message: 'message is required' });
                }

                if (!timestamp) {
                    return res.status(400).json({ message: 'timestamp is required' });
                }

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

/* * DELETE /delete :
 *      summary: Deletes an existing notification for a user.
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                  schema:
 *                      properties:
 *                          userID:
 *                              type: String
 *                          notificationID:
 *                              type: Number
 *                      required:
 *                          - userID
 *                          - notificationID
 *      responses:
 *          200:
 *              description: Success message and ID of deleted notification.
 *          400:
 *              description: Error message if request body is invalid.
 *          404:
 *              description: Notification not found.
 *          500:
 *              description: Error connecting to MongoDB or deleting notification.
 */
router.delete('/delete', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('notifications');
        const collection = database.collection('notifications');
        
        const { error } = notificationSchema.validate(req.body);

        if (error) {
                return res.status(400).send(error.details[0].message);
        } else {
                const { userID, notificationID } = req.body;

                if (!userID) {
                    return res.status(400).json({ message: 'User ID is required' });
                }

                if (!notificationID) {
                    return res.status(400).json({ message: 'Notification ID is required' });
                }

                const foundNotif = await collection.findOne({ userID, notificationID });

                if (!foundNotif) {
                    return res.status(404).json({ message: 'Notification not found' });
                }

                const document = await collection.deleteOne({ userID, notificationID });

                if (!document) {
                    return res.status(500).json({ message: 'Deletion failed' });
                }

                return res.status(200).json({ message: 'Notification deleted successfully', _id: document.insertedId });
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