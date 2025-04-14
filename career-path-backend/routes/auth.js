const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
    const { firstName, surname, email, password, dob, gender, age, user_type, firebaseUid } = req.body;
    
    // Validate required fields
    if (!firstName || !surname || !email) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          firstName: !firstName ? 'First name is required' : undefined,
          surname: !surname ? 'Surname is required' : undefined,
          email: !email ? 'Email is required' : undefined
        }
      });
    }
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but doesn't have firebaseUid yet, update it
      if (firebaseUid && !existingUser.firebaseUid) {
        existingUser.firebaseUid = firebaseUid;
        await existingUser.save();
        
        // Generate token
        const token = generateToken(existingUser._id);
        
        // Return user data without password
        const userData = existingUser.toObject();
        delete userData.password;
        
        return res.json({
          token,
          user: userData,
          message: 'User updated with Firebase UID'
        });
      }
      
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = new User({
      firstName,
      surname,
      email,
      password: password || undefined, // Only set if provided
      dob,
      gender,
      age,
      user_type,
      firebaseUid
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

// Firebase auth verification
router.post('/firebase-auth', async (req, res) => {
  try {
    const { email, firebaseUid } = req.body;
    
    if (!email || !firebaseUid) {
      return res.status(400).json({ message: 'Email and Firebase UID are required' });
    }
    
    // Find user by email
    let user = await User.findOne({ email });
    
    // If user doesn't exist, create a new one
    if (!user && req.body.createUser) {
      const { firstName, surname, dob, gender, age, user_type } = req.body;
      
      user = new User({
        firstName,
        surname,
        email,
        firebaseUid,
        dob: dob || new Date(),
        gender: gender || 'Other',
        age: age || 18,
        user_type: user_type || 'student'
      });
      
      await user.save();
    } else if (user && !user.firebaseUid) {
      // Update existing user with Firebase UID
      user.firebaseUid = firebaseUid;
      await user.save();
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found and creation not requested' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      token,
      user
    });
  } catch (error) {
    console.error('Error in Firebase auth:', error);
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

module.exports = router;
