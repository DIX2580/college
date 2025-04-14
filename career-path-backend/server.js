const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userCareerRoutes = require('./routes/userCareer');
require('dotenv').config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user-career', userCareerRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Career Path API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});