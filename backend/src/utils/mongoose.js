/*
 * mongoose.js
 * This file creates and exports the Mongoose connection
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully via Mongoose');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
