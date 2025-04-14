const express = require('express');
const router = express.Router();
const UserCareer = require('../models/UserCareer');
const { protect } = require('../middleware/authMiddleware'); // Import the auth middleware

// Create new user career data - with optional authentication
router.post('/', async (req, res) => {
  try {
    const { currentClass, sector, dreamJob } = req.body;
    const userId = req.body.userId || null; // Get userId from request body if provided
    
    // Validation
    if (!currentClass || !sector) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Create new record
    const userCareer = new UserCareer({
      userId, // This might be null for guest users
      currentClass,
      sector,
      dreamJob: dreamJob || '',
    });
    
    const savedData = await userCareer.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error saving user career data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected route - Create new user career data with user authentication
router.post('/authenticated', protect, async (req, res) => {
  try {
    const { currentClass, sector, dreamJob } = req.body;
    
    // Validation
    if (!currentClass || !sector) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Create new record with the authenticated user's ID
    const userCareer = new UserCareer({
      userId: req.user._id, // From the auth middleware
      currentClass,
      sector,
      dreamJob: dreamJob || '',
    });
    
    const savedData = await userCareer.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error saving user career data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all user career data (for admin purposes)
router.get('/', async (req, res) => {
  try {
    const userCareers = await UserCareer.find().sort({ createdAt: -1 });
    res.json(userCareers);
  } catch (error) {
    console.error('Error fetching user career data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user career data by ID
router.get('/:id', async (req, res) => {
  try {
    const userCareer = await UserCareer.findById(req.params.id);
    
    if (!userCareer) {
      return res.status(404).json({ message: 'User career data not found' });
    }
    
    res.json(userCareer);
  } catch (error) {
    console.error('Error fetching user career data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user career data for the logged-in user
router.get('/user/me', protect, async (req, res) => {
  try {
    const userCareers = await UserCareer.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(userCareers);
  } catch (error) {
    console.error('Error fetching user career data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;