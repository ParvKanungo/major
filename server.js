const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const colors = require('colors');
const morgan = require('morgan')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const notesRoutes = require('./routes/notesRoutes');
const { protect } = require('./middlewares/authMiddleware')
const profileRoutes = require('./routes/profileRoutes');
// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));




// Connect to MongoDB
connectDB();

// Use Routes
app.use('/api/auth/', authRoutes);
app.use('/api/notes', protect, notesRoutes);
app.use('/api/profile',protect,profileRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Set the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Node Server Running in ${process.env.DEV_MODE} Mode on port ${process.env.PORT}...`.bgGreen.black);

});
