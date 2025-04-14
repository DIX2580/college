// routes/firebaseUser.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Route: POST /api/firebase/register
router.post("/register", async (req, res) => {
  const {
    uid,
    firstname,
    surname,
    email,
    dob,
    age,
    gender,
    user_type
  } = req.body;

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists in MongoDB" });
    }

    // Save new user
    const newUser = new User({
      uid,
      firstname,
      surname,
      email,
      dob,
      age,
      gender,
      user_type,
    });

    await newUser.save();
    res.status(201).json({ message: "User saved to MongoDB successfully!" });
  } catch (err) {
    console.error("Mongo Save Error:", err);
    res.status(500).json({ message: "Server error while saving user" });
  }
});

module.exports = router;
