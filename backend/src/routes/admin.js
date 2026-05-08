/*  admin.js
 */

const express = require('express');
const router = express.Router();
const mongodbPromise = require('../utils/mongodb');
const Joi = require('joi');
const clerkClient = require('../utils/clerk');

// Schema for validating username in request body
const usernameSchema = Joi.object({
    username: Joi.string().required()
});

/* * DELETE /deleteAccount :
 *      summary: deletes a user in Clerk.
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
 *          description: - json with a success message and username returned.
 *        400:
 *          description: - error message when invalid request body 
 *             is sent to endpoint.
 *        404:
 *          description: - error message when no user exists for given username.
 *        500:
 *          description: - json with an error message and the error caught.
 * */
router.delete('/deleteAccount', async (req, res) => {
    try {
        const { error } = usernameSchema.validate(req.body);

        if (error) {
            return res.status(400).send({
                message: 'Invalid request body',
                error: error.details[0].message
            });
        } else {
            const { username } = req.body;
           
            let clerkUsers;
            try {
                clerkUsers = await clerkClient.users.getUserList({ username: [username] });
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
            const response = await clerkClient.users.deleteUser(clerkUserId);

            // Also remove from MongoDB if the user was still pending there
            const client = await mongodbPromise;
            await client.db('requests').collection('accounts').deleteOne({ username });

            res.status(200).send({
                message: 'User successfully deleted',
                deletedUsername: username,
                clerkResponse: response
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            'message': 'Error connecting to Clerk: ',
            error
        });
    }
});

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
        const permissionLevel = username.startsWith('ya_') ? 1 : 2;

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

        // Update permission + persist name from MongoDB into Clerk
        try {
            await clerkClient.users.updateUser(clerkUserId, {
                firstName: pendingUser.firstName,
                lastName: pendingUser.lastName,
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

        // Staff accounts: email must be added via the emailAddresses API, not updateUser
        if (pendingUser.email) {
            try {
                await clerkClient.emailAddresses.createEmailAddress({
                    userId: clerkUserId,
                    emailAddress: pendingUser.email,
                    verified: true,
                    primary: true,
                });
            } catch (clerkError) {
                console.error('Error adding email to Clerk user:', clerkError);
                return res.status(500).send({
                    message: 'Error adding email to Clerk user',
                    error: clerkError.message
                });
            }
        }

        await removeAccountFromDB(username);

        res.status(200).send({
            message: 'Account successfully approved',
            username,
            permissionLevel
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
        // First, delete the user from Clerk
        let clerkUsers;
        try {
            clerkUsers = await clerkClient.users.getUserList({ username: [username] });

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
            username
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

/* * GET /accounts :
 *      summary: Returns all YA and Staff/Admin users (pending + active).
 *
 *      Pending users come from MongoDB requests.accounts (permissionLevel: 0).
 *      YA pending users are enriched with Clerk publicMetadata (age, gender, race, zone).
 *      Active users are pulled from Clerk filtered by permission level
 *      ('1' = YA active, '2' = Staff/Admin active).
 *
 *      responses:
 *        200:
 *          description: - { yaUsers: [...], staffUsers: [...] }
 *        500:
 *          description: - Internal server error
 * */
router.get('/accounts', async (_req, res) => {
    try {
        // --- Pending users from MongoDB ---
        const client = await mongodbPromise;
        const collection = client.db('requests').collection('accounts');
        const pendingDocs = await collection.find({ permissionLevel: 0 }).toArray();

        const pendingYA    = pendingDocs.filter(u =>  u.username.startsWith('ya_'));
        const pendingStaff = pendingDocs.filter(u => !u.username.startsWith('ya_'));

        // Enrich pending YA users with Clerk publicMetadata (age, gender, race, zone)
        let enrichedPendingYA = pendingYA.map(u => ({
            firstName: u.firstName, lastName: u.lastName,
            username: u.username, age: null, gender: null, ethnicity: null, city: null,
            status: 'pending',
        }));

        if (pendingYA.length > 0) {
            const usernames = pendingYA.map(u => u.username);
            const clerkResp = await clerkClient.users.getUserList({ username: usernames, limit: 200 });
            const clerkList = Array.isArray(clerkResp) ? clerkResp : clerkResp?.data || [];
            const metaByUsername = Object.fromEntries(clerkList.map(cu => [cu.username, cu.publicMetadata]));

            enrichedPendingYA = pendingYA.map(u => ({
                firstName: u.firstName, lastName: u.lastName,
                username: u.username,
                age:       metaByUsername[u.username]?.age       ?? null,
                gender:    metaByUsername[u.username]?.gender    ?? null,
                ethnicity: metaByUsername[u.username]?.race      ?? null,
                city:      metaByUsername[u.username]?.zone      ?? null,
                status: 'pending',
            }));
        }

        const formattedPendingStaff = pendingStaff.map(u => ({
            firstName: u.firstName, lastName: u.lastName,
            email: u.email, username: u.username,
            status: 'pending',
        }));

        // --- Active users from Clerk ---
        const allClerkResp = await clerkClient.users.getUserList({ limit: 500 });
        const allClerkUsers = Array.isArray(allClerkResp) ? allClerkResp : allClerkResp?.data || [];

        const pendingUsernames = new Set(pendingDocs.map(u => u.username));

        const activeYA = allClerkUsers
            .filter(u => u.publicMetadata?.permission === '1' && !pendingUsernames.has(u.username))
            .map(u => ({
                firstName: u.firstName || '', lastName: u.lastName || '',
                username: u.username,
                age:       u.publicMetadata?.age       ?? null,
                gender:    u.publicMetadata?.gender    ?? null,
                ethnicity: u.publicMetadata?.race      ?? null,
                city:      u.publicMetadata?.zone      ?? null,
                status: 'active',
            }));

        const activeStaff = allClerkUsers
            .filter(u => u.publicMetadata?.permission === '2' && !pendingUsernames.has(u.username))
            .map(u => ({
                firstName: u.firstName || '', lastName: u.lastName || '',
                email: u.emailAddresses?.[0]?.emailAddress || '',
                username: u.username,
                status: 'active',
            }));

        res.status(200).json({
            yaUsers:    [...enrichedPendingYA, ...activeYA],
            staffUsers: [...formattedPendingStaff, ...activeStaff],
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error fetching accounts', error: error.message });
    }
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

module.exports = router;