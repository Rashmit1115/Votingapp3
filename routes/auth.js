const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust according to your models
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration route
router.post('/register', async (req, res) => {
    const { name, email, password,role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        
        const trimmedPassword = password.trim()
        
        user = new User({
            name,
            email,
            password:trimmedPassword,
            role
        });

        await user.save();

        res.status(201).json({
            msg: "user registered successfully .."
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        // if(user){console.log(`found user: ${user}`);}
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const trimmedPassword = password.trim()


        const isMatch = await bcrypt.compare(trimmedPassword, user.password);
        // if(isMatch){console.log(`passwords match !!`);}
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
                role:user.role
            }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Use JWT_SECRET from .env

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
