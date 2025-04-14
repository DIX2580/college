// routes/courses.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect } = require('../middleware/authMiddleware');

// Get all courses - protected route, only accessible for authenticated users
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get course by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new course (admin only - you can add admin check middleware later)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, instructor, duration, price, image } = req.body;
    
    // Validation
    if (!title || !description || !instructor || !duration || !price || !image) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Create new course
    const course = new Course({
      title,
      description,
      instructor,
      duration,
      price,
      image
    });
    
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update course (admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, instructor, duration, price, image } = req.body;
    
    // Find course by id and update
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, instructor, duration, price, image },
      { new: true } // Return the updated document
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete course (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;