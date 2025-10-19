/*
 *  clerk.js
 *  This file creates a usable clerk client
 * 
 */

const { createClerkClient } = require('@clerk/backend');

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
});

module.exports = clerkClient;