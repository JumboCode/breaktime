/*
 * app.js
 * This file is used to initialize the backend
 * To add a new route file, add it to the routes folder and update the code
 * under the Routes section
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

/* Initializing Express */
const app = express();
app.use(cors());

/* Routes */

module.exports = app;