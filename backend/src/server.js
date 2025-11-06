/*
 * server.js
 * This file is the entry point for the server
 */

const app = require('./app');
const connectDB = require('./utils/mongoose');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB via Mongoose
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});