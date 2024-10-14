// routes/vote.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User')
// Get candidates for voting
router.get('/', auth, async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Cast a vote
router.post('/', auth, async (req, res) => {
    const { candidateId } = req.body;

    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        // checking if user has already voted

        const user = await User.findById(req.user.id);
        if (user.hasVoted) {
            return res.status(403).json({ msg: 'You have already voted' }); 
        }


        candidate.votes += 1; // Increment vote count


        await candidate.save();

        // updating users voting status
        user.hasVoted = true
        await user.save()

        res.json({ msg: 'Vote cast successfully!' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
