//IMPORTANT
//NEED TO DELETE THIS USER FROM THE MONGODB AT THE END OF THIS
// havent done yet for sake of testing

/*
 * do a bunch of testing,
 * get access to Clerk
 * 
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
        // Debug: Print all users in Clerk database
        try {
            const allClerkUsers = await clerkClient.users.getUserList();
            console.log('\n=== ALL CLERK USERS ===');
            console.log('Response type:', Array.isArray(allClerkUsers) ? 'Array' : 'Object');
            console.log('Total users:', Array.isArray(allClerkUsers) ? allClerkUsers.length : allClerkUsers?.totalCount);
            const userList = Array.isArray(allClerkUsers) ? allClerkUsers : allClerkUsers?.data || [];
            userList.forEach(user => {
                console.log(`- Username: ${user.username}, ID: ${user.id}`);
            });
            console.log('======================\n');
        } catch (debugError) {
            console.error('Error fetching all Clerk users:', debugError);
        }

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
        let clerkUsers;
        try {
            clerkUsers = await clerkClient.users.getUserList({ username: [username] });
            console.log('Clerk getUserList response:', clerkUsers);
        } catch (clerkError) {
            console.error('Error fetching user from Clerk:', clerkError);
            return res.status(500).send({
                message: 'Error fetching user from Clerk',
                error: clerkError.message
            });
        }

        // Handle both array and object response types
        const userList = Array.isArray(clerkUsers) ? clerkUsers : clerkUsers?.data || [];

        if (!userList || userList.length === 0) {
            return res.status(404).send({
                message: 'User not found in Clerk database'
            });
        }

        const clerkUser = userList[0];
        const clerkUserId = clerkUser.id;

        // Update the permission in Clerk's publicMetadata
        try {
            await clerkClient.users.updateUser(clerkUserId, {
                publicMetadata: {
                    ...clerkUser.publicMetadata,
                    permission: String(permissionLevel)
                }
            });
        } catch (clerkError) {
            console.error('Error updating user in Clerk:', clerkError);
            return res.status(500).send({
                message: 'Error updating user in Clerk',
                error: clerkError.message
            });
        }

        await removeAccountFromDB(username);

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
        // Debug: Print all users in Clerk database
        try {
            const allClerkUsers = await clerkClient.users.getUserList();
            console.log('\n=== ALL CLERK USERS ===');
            console.log('Response type:', Array.isArray(allClerkUsers) ? 'Array' : 'Object');
            console.log('Total users:', Array.isArray(allClerkUsers) ? allClerkUsers.length : allClerkUsers?.totalCount);
            const userList = Array.isArray(allClerkUsers) ? allClerkUsers : allClerkUsers?.data || [];
            userList.forEach(user => {
                console.log(`- Username: ${user.username}, ID: ${user.id}`);
            });
            console.log('======================\n');
        } catch (debugError) {
            console.error('Error fetching all Clerk users:', debugError);
        }

        // Validate request body
        const { error } = usernameSchema.validate(req.body);
        if (error) {
            return res.status(400).send({
                message: 'Invalid request body',
                error: error.details[0].message
            });
        }

        const { username } = req.body;
        // First, delete the user from Clerk
        let clerkUsers;
        try {
            clerkUsers = await clerkClient.users.getUserList({ username: [username] });
            console.log('Clerk getUserList response:', clerkUsers);
        } catch (clerkError) {
            console.error('Error fetching user from Clerk:', clerkError);
            return res.status(500).send({
                message: 'Error fetching user from Clerk',
                error: clerkError.message
            });
        }

        // Handle both array and object response types
        const userList = Array.isArray(clerkUsers) ? clerkUsers : clerkUsers?.data || [];
        if (!userList || userList.length === 0) {
            return res.status(404).send({
                message: 'User not found in Clerk database'
            });
        }

        const clerkUserId = userList[0].id;
        try {
            await clerkClient.users.deleteUser(clerkUserId);
        } catch (clerkError) {
            console.error('Error deleting user from Clerk:', clerkError);
            return res.status(500).send({
                message: 'Error deleting user from Clerk',
                error: clerkError.message
            });
        }

        // Remove from pending accounts in MongoDB (will throw error if not found)
        await removeAccountFromDB(username);

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