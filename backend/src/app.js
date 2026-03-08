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
const adminRoutes = require('./routes/admin');
const serviceExtensionRoutes = require('./routes/serviceExtension');
const userRoutes = require('./routes/user');
const staffRoutes = require('./routes/staff');
const serviceRoutes = require('./routes/service');
const booking = require('./routes/booking');
const notificationRoutes = require('./routes/notification');
const bookingRoutes = require('./routes/booking');

app.use('/example', exampleRoutes);
app.use('/user', userRoutes);
app.use('/staff', staffRoutes);
app.use('/admin', adminRoutes);
app.use('/service', serviceRoutes);
app.use('/serviceExtension', serviceExtensionRoutes);
app.use('/booking', booking);
app.use('/notification', notificationRoutes);
app.use('/booking', bookingRoutes);
app.use('/', (req, res) => {
    res.status(200).send('Backend is working');
});

module.exports = app;