/*
 * Counter.js
 * Mongoose model for tracking auto-incrementing counters
 */

const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: Number,
        required: true,
        default: 1
    }
});

const Counter = mongoose.connection.useDb('services').model('Counter', counterSchema, 'counters');

module.exports = Counter;
