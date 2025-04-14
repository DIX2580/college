const express = require('express');
const router = express.Router();
const UserCareer = require('../models/UserCareer');

// Create new user career data
router.post('/', async (req, res) => {
  try {
    const { currentClass, sector, dreamJob } = req.body;
    
    // Validation
    if (!currentClass || !sector) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Create new record
    const userCareer = new UserCareer({
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

module.exports = router;