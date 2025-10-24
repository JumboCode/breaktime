//in the B2B ticket we need the meta data formatted properly
//meta data can contain whatever stuff, but we need at least a username and a permission level to set

const express = require('express');
const router = express.Router();
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
 *      summary: Approves a pending account request by updating permission level in MongoDB
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
 *      summary: Denies a pending account request by removing from pending collection
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