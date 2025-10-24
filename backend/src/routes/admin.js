//this code should work for approving and denying pending users in the Clerk and MongoDB collections
//IMPORTANT
/*
 * I am able to test approval and denial of users from the MongoDB side
 * Because Account creation is not yet ready, I cannot test whether or not approval properly updates the metadata in Clerk
 * I need access to Clerk or need a working version of Account creation, which is B2B.
 */

const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const Joi = require('joi');
const { clerkClient } = require('@clerk/clerk-sdk-node');

// Schema for validating username in request body
const usernameSchema = Joi.object({
    username: Joi.string().required()
});

/**
 * Helper function to remove an account from MongoDB
 * @param {string} username - The username of the account to remove
 * @returns {Promise<boolean>} - Returns true if successful
 * @throws {Error} - Throws error if removal fails or account not found
 */
async function removeAccountFromDB(username) {
    try {
        const client = await mongodbPromise;
        const database = client.db('requests');
        const collection = database.collection('accounts');

        const result = await collection.deleteOne({ username });

        if (result.deletedCount === 0) {
            throw new Error('Account not found in database');
        }

        return true;
    } catch (error) {
        throw new Error(`Failed to remove account from database: ${error.message}`);
    }
}

/* * POST /approve :
 *      summary: Approves a pending account request by updating permission level in MongoDB and Clerk
 *      description: Permission level is automatically determined from username prefix (YA_ = 1, otherwise = 2)
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                schema:
 *                  properties:
 *                    username:
 *                      type: String
 *
 *                  required:
 *                      - username
 *
 *      responses:
 *        200:
 *          description: - Account successfully approved, permission level updated
 *        400:
 *          description: - Missing username or invalid request body
 *        404:
 *          description: - Username not found in pending requests
 *        500:
 *          description: - Internal server error
 * */
router.post('/approve', async (req, res) => {
    try {
        // Validate request body
        const { error } = usernameSchema.validate(req.body);

        if (error) {
            return res.status(400).send({
                message: 'Invalid request body',
                error: error.details[0].message
            });
        }

        const { username } = req.body;

        // Get pending user from MongoDB
        const client = await mongodbPromise;
        const database = client.db('requests');
        const collection = database.collection('accounts');

        const pendingUser = await collection.findOne({ username });

        if (!pendingUser) {
            return res.status(404).send({
                message: 'User not found in pending requests'
            });
        }

        // Determine permission level based on username prefix
        const permissionLevel = username.startsWith('YA_') ? 1 : 2;

        // Update permission level in MongoDB
        const result = await collection.updateOne(
            { username },
            { $set: { permissionLevel } }
        );

        if (result.modifiedCount === 0) {
            return res.status(500).send({
                message: 'Failed to update permission level'
            });
        }

        // Update permission level in Clerk
        // First, find the Clerk user by username
        const clerkUsers = await clerkClient.users.getUserList({ username: [username] });

        if (!clerkUsers || clerkUsers.data.length === 0) {
            return res.status(404).send({
                message: 'User not found in Clerk database'
            });
        }

        const clerkUserId = clerkUsers.data[0].id;

        // Update the permission in Clerk's publicMetadata
        await clerkClient.users.updateUser(clerkUserId, {
            publicMetadata: {
                ...clerkUsers.data[0].publicMetadata,
                permission: String(permissionLevel)
            }
        });

        //IMPORTANT
        //NEED TO DELETE THIS USER FROM THE MONGODB AT THE END OF THIS
        // havent done yet for sake of testing

        res.status(200).send({
            message: 'Account successfully approved',
            username: username,
            permissionLevel: permissionLevel
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error approving account',
            error: error.message
        });
    }
});

/* * POST /deny :
 *      summary: Denies a pending account request by removing from both Clerk and MongoDB
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                schema:
 *                  properties:
 *                    username:
 *                      type: String
 *
 *                  required:
 *                      - username
 *
 *      responses:
 *        200:
 *          description: - Account successfully denied and removed
 *        400:
 *          description: - Missing username or invalid request body
 *        404:
 *          description: - Username not found in MongoDB
 *        500:
 *          description: - Internal server error
 * */

router.post('/deny', async (req, res) => {
    try {
        // Validate request body
        const { error } = usernameSchema.validate(req.body);

        if (error) {
            return res.status(400).send({
                message: 'Invalid request body',
                error: error.details[0].message
            });
        }

        const { username } = req.body;

        // Remove from pending accounts in MongoDB (will throw error if not found)
        await removeAccountFromDB(username);

        // Second, delete the user from Clerk
        const clerkUsers = await clerkClient.users.getUserList({ username: [username] });

        if (!clerkUsers || clerkUsers.data.length === 0) {
            return res.status(404).send({
                message: 'User not found in Clerk database'
            });
        }

        const clerkUserId = clerkUsers.data[0].id;
        await clerkClient.users.deleteUser(clerkUserId);

        

        res.status(200).send({
            message: 'Account successfully denied and removed',
            username: username
        });

    } catch (error) {
        console.log(error);

        // Check if error is due to account not found
        if (error.message.includes('Account not found in database')) {
            return res.status(404).send({
                message: 'User not found in pending requests',
                error: error.message
            });
        }

        res.status(500).send({
            message: 'Error denying account',
            error: error.message
        });
    }
});

module.exports = router;