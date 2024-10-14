// routes/admin.js
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Candidate = require('../models/Candidate');
const router = express.Router();

// Add a new candidate (admin-only)
router.post('/add', [auth, admin], async (req, res) => {
    const { name, party } = req.body;

    try {
        const newCandidate = new Candidate({ name, party });
        await newCandidate.save();
        res.json({ msg: 'Candidate added successfully!' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all candidates (admin-only)
router.get('/', [auth, admin], async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
