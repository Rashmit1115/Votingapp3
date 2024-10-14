// models/Candidate.js
const mongoose = require('mongoose');

// Candidate Schema
const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('Candidate', CandidateSchema);
