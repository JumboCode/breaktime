const express = require('express');
const router = express.Router();
const clerkClient = require('../utils/clerk');
const mongodbPromise = require('../utils/mongodb');
const Joi = require('joi');

// Schema for validating username in request body
const usernameSchema = Joi.object({
    username: Joi.string().required()
});

/**
 * Helper function to remove an account from MongoDB
 * @param {string} username - The username of the account to remove
 * @returns {Promise<boolean>} - Returns true if successful
 * @throws {Error} - Throws error if removal fails
 */
async function removeAccountFromDB(username, res) {
    try {
        const client = await mongodbPromise;
        const database = client.db('requests');
        const collection = database.collection('accounts');

        const result = await collection.deleteOne({ username });

        if (result.deletedCount === 0) {
            res.status(404).send("Account not found in database");
        }

        return true;
    } catch (error) {
        throw new Error(`Failed to remove account from database: ${error.message}`);
    }
}

/* * POST /approve :
 *      summary: Approves a pending account request by updating user permissions and removing from pending collection
 *
 *      requestBody:
 *          required: true
 *          content:
 *              json:
 *                schema:
 *                  properties:
 *                    username:
 *                      type: String
 *                    permissionLevel:
 *                      type: Number
 *                      description: Permission level (1 for YA, 2 for Staff)
 *
 *                  required:
 *                      - username
 *                      - permissionLevel
 *
 *      responses:
 *        200:
 *          description: - Account successfully approved
 *        400:
 *          description: - Missing username or invalid request body
 *        404:
 *          description: - Username not found in Clerk
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

        const { username, permissionLevel } = req.body;

        // Validate permission level
        if (!permissionLevel || (permissionLevel !== 1 && permissionLevel !== 2)) {
            return res.status(400).send({
                message: 'Invalid permission level. Must be 1 (YA) or 2 (Staff)'
            });
        }

        // Get user from Clerk by username
        const userList = await clerkClient.users.getUserList({ username: [username] });

        if (!userList || userList.totalCount === 0) {
            return res.status(404).send({
                message: 'User not found in Clerk'
            });
        }

        const user = userList.data[0];

        // Update user metadata in Clerk
        await clerkClient.users.updateUserMetadata(user.id, {
            publicMetadata: {
                permission: permissionLevel
            }
        });

        // Remove from pending accounts in MongoDB
        await removeAccountFromDB(username, res);

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
 *      summary: Denies a pending account request by deleting user from Clerk and removing from pending collection
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
 *          description: - Username not found in Clerk or MongoDB
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

        // Get user from Clerk by username
        const userList = await clerkClient.users.getUserList({ username: [username] });

        if (!userList || userList.totalCount === 0) {
            return res.status(404).send({
                message: 'User not found in Clerk'
            });
        }

        const user = userList.data[0];

        // Delete user from Clerk
        await clerkClient.users.deleteUser(user.id);

        // Remove from pending accounts in MongoDB
        await removeAccountFromDB(username);

        res.status(200).send({
            message: 'Account successfully denied and removed',
            username: username
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error denying account',
            error: error.message
        });
    }
});

module.exports = router;