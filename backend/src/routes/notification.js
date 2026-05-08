const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const mongodbPromise = require('../utils/mongodb');
const { notificationSchema } = require('../schemas/notification');

/* * POST /create :
 *      summary: Creates a new notification for a user.
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                  schema:
 *                      properties:
 *                          senderID:
 *                              type: String
 *                          receiverID:
 *                              type: String
 *                          bookingID:
 *                              type: String
 *                          type:
 *                              type: String
 *                              enum: [UPDATE, ALERT]
 *                          title:
 *                              type: String
 *                          message:
 *                              type: String
 *                          timestamp:
 *                              type: Date
 *                      required:
 *                          - senderID
 *                          - receiverID
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
                const { senderID,
                        receiverID,
                        bookingID,
                        conversationID,
                        senderName,
                        type,
                        title,
                        message
                } = req.body;

                if (type === 'UPDATE' && !bookingID) {
                    return res.status(400).json(
                        { message: 'A bookingID is required for an update notification' }
                    );
                }

                const timestamp = new Date().toISOString();

                const newNotif = {
                        senderID,
                        receiverID,
                        ...(bookingID ? { bookingID } : {}),
                        ...(conversationID ? { conversationID } : {}),
                        ...(senderName ? { senderName } : {}),
                        type,
                        isRead: false,
                        wasNotified: false,
                        title,
                        message,
                        timestamp
                };

                const document = await collection.insertOne(newNotif);

                // For new MESSAGE threads (no conversationID supplied), set conversationID = _id
                if (type === 'MESSAGE' && !conversationID) {
                    await collection.updateOne(
                        { _id: document.insertedId },
                        { $set: { conversationID: document.insertedId.toString() } }
                    );
                }

                return res.status(200).json(
                    { message: 'Notification created successfully', _id: document.insertedId, conversationID: conversationID || document.insertedId.toString() }
                );
        }

    } catch (error){
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

/* * GET /getInbox :
 *      summary: Returns all notifications for a given user.
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                  schema:
 *                      properties:
 *                          userID:
 *                              type: String
 *                      required:
 *                          - userID
 *      responses:
 *          200:
 *              description: Array of notifications for the user.
 *          400:
 *              description: Error message if userID is missing.
 *          500:
 *              description: Error connecting to MongoDB.
 */
router.post('/getInbox', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('notifications');
        const collection = database.collection('notifications');

        const { userID, role } = req.body;

        if (!userID) {
            return res.status(400).json({ message: 'userID is required' });
        }

        // Staff see their personal notifications AND the shared staff-inbox messages
        const query = role === 'staff'
            ? { $or: [{ receiverID: userID }, { receiverID: 'staff-inbox' }] }
            : { receiverID: userID };

        const notifications = await collection.find(query)
            .sort({ _id: -1 })
            .toArray();

        return res.status(200).json({ notifications });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

/* * POST /getConversation :
 *      summary: Returns all messages belonging to a conversation thread.
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                  schema:
 *                      properties:
 *                          conversationID:
 *                              type: String
 *                      required:
 *                          - conversationID
 *      responses:
 *          200:
 *              description: Array of notifications in the conversation, sorted oldest first.
 *          400:
 *              description: Missing conversationID.
 *          500:
 *              description: Error connecting to MongoDB.
 */
router.post('/getConversation', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('notifications');
        const collection = database.collection('notifications');

        const { conversationID } = req.body;

        if (!conversationID) {
            return res.status(400).json({ message: 'conversationID is required' });
        }

        const messages = await collection.find({ conversationID })
            .sort({ _id: 1 })
            .toArray();

        return res.status(200).json({ messages });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error connecting to MongoDB: ', error });
    }
});

/* * PATCH /markRead :
 *      summary: Updates the isRead status of a notification.
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                  schema:
 *                      properties:
 *                          _id:
 *                              type: String
 *                          isRead:
 *                              type: Boolean
 *                      required:
 *                          - _id
 *                          - isRead
 *      responses:
 *          200:
 *              description: Notification updated successfully.
 *          400:
 *              description: Missing required fields.
 *          404:
 *              description: Notification not found.
 *          500:
 *              description: Error connecting to MongoDB.
 */
router.patch('/markRead', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('notifications');
        const collection = database.collection('notifications');

        const { _id, isRead } = req.body;

        if (!_id || isRead === undefined) {
            return res.status(400).json({ message: '_id and isRead are required' });
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: { isRead } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        return res.status(200).json({ message: 'Notification updated successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to MongoDB: ',
            error
        });
    }
});

/* * PATCH /markNotified :
 *      summary: Sets wasNotified to true, dismissing it from the notification widget.
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                  schema:
 *                      properties:
 *                          _id:
 *                              type: String
 *                      required:
 *                          - _id
 *      responses:
 *          200:
 *              description: Notification dismissed successfully.
 *          400:
 *              description: Missing _id.
 *          404:
 *              description: Notification not found.
 *          500:
 *              description: Error connecting to MongoDB.
 */
router.patch('/markNotified', async (req, res) => {
    try {
        const client = await mongodbPromise;
        const database = client.db('notifications');
        const collection = database.collection('notifications');

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: '_id is required' });
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: { wasNotified: true } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        return res.status(200).json({ message: 'Notification dismissed successfully' });

    } catch (error) {
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