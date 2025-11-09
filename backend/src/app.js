/*
 * app.js
 * This file is used to initialize the backend
 * To add a new route file, add it to the routes folder and update the code
 * under the Routes section
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

/* Initializing Express */
const app = express();
app.use(cors());
app.use(express.json());

/* Routes */
const exampleRoutes = require('./routes/exampleRoute');
const admin = require('./routes/admin');
const userRoutes = require('./routes/user');
const staffRoutes = require('./routes/staff');
const service = require('./routes/service');

app.use('/example', exampleRoutes);
app.use('/user', userRoutes);
app.use('/staff', staffRoutes);
app.use('/admin', admin);
app.use('/service', service);


module.exports = app;