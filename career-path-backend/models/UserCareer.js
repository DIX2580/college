const mongoose = require('mongoose');

const userCareerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make it optional to support guest users
  },
  currentClass: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  dreamJob: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('UserCareer', userCareerSchema);