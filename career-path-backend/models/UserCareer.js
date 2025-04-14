const mongoose = require('mongoose');

const userCareerSchema = new mongoose.Schema({
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