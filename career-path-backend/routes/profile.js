const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = file.fieldname === 'resume' 
      ? './uploads/resumes' 
      : './uploads/profilePictures';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with user ID and timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profilePicture') {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
  } else if (file.fieldname === 'resume') {
    // Accept PDFs and DOCs only
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      return cb(new Error('Only PDF and DOC files are allowed!'), false);
    }
  }
  cb(null, true);
};

// Configure multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Update user profile
router.put('/update', protect, async (req, res) => {
  try {
    const { firstName, surname, bio, gender, dob, age } = req.body;
    
    // Find user and update basic info
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
    if (age) user.age = age;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        bio: user.bio,
        gender: user.gender,
        dob: user.dob,
        age: user.age,
        profilePicture: user.profilePicture,
        skills: user.skills,
        user_type: user.user_type
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload profile picture
router.post('/upload-profile-picture', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get file path relative to server
    const filePath = `/uploads/profilePictures/${req.file.filename}`;
    
    // Update user with new profile picture
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: filePath },
      { new: true }
    );
    
    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: filePath
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload resume
router.post('/upload-resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get file path relative to server
    const filePath = `/uploads/resumes/${req.file.filename}`;
    
    // Update user with new resume
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: filePath },
      { new: true }
    );
    
    res.json({
      message: 'Resume uploaded successfully',
      resume: filePath
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download resume
router.get('/download-resume/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user || !user.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Construct the full file path
    const filePath = path.join(__dirname, '..', user.resume);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }
    
    res.download(filePath);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user skills
router.put('/update-skills', protect, async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }
    
    // Update user skills
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills },
      { new: true }
    );
    
    res.json({
      message: 'Skills updated successfully',
      skills: user.skills
    });
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;