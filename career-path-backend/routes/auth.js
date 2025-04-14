const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/authMiddleware');
require('dotenv').config();

// Helper function to generate JWT
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { firstName, surname, email, password, dob, gender, age, user_type } = req.body;
    
    // Validate required fields
    if (!firstName || !surname || !email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          firstName: !firstName ? 'First name is required' : undefined,
          surname: !surname ? 'Surname is required' : undefined,
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined
        }
      });
    }
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = new User({
      firstName,
      surname,
      email,
      password,
      dob,
      gender,
      age,
      user_type
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return user data without password
    const userData = user.toObject();
    delete userData.password;
    
    res.status(201).json({
      token,
      user: userData
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ 
        message: 'Validation error', 
        errors 
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return user data without password
    const userData = user.toObject();
    delete userData.password;
    
    res.json({
      token,
      user: userData
    });
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by token (for authentication verification)
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Guest login route
router.get('/guest-login', async (req, res) => {
  try {
    // Find guest user or create if doesn't exist
    let guestUser = await User.findOne({ email: 'Guest@Guest.com' }).select('+password');
    
    if (!guestUser) {
      // Create guest user if it doesn't exist
      const hashedPassword = await bcrypt.hash('Guest@123', 12);
      
      guestUser = new User({
        firstName: 'Guest',
        surname: 'User',
        email: 'Guest@Guest.com',
        password: hashedPassword,
        dob: new Date('2000-01-01'),
        gender: 'Other',
        age: 25,
        user_type: 'student'
      });
      
      await guestUser.save();
    }
    
    // Generate token
    const token = generateToken(guestUser._id);
    
    // Return user data without password
    const userData = guestUser.toObject();
    delete userData.password;
    
    res.json({
      token,
      user: userData
    });
  } catch (error) {
    console.error('Error in guest login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile information
router.patch('/update-profile', protect, async (req, res) => {
  try {
    const { firstName, surname, bio, gender, dob, age, profilePicture } = req.body;
    
    // Find user by ID from token
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (surname) user.surname = surname;
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (dob) user.dob = new Date(dob);
    if (age) user.age = parseInt(age);
    if (profilePicture) user.profilePicture = profilePicture;
    
    // Save updated user
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        bio: user.bio,
        gender: user.gender,
        dob: user.dob,
        age: user.age,
        profilePicture: user.profilePicture,
        user_type: user.user_type
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;