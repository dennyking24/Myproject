const express = require('express');
const userRepository = require('../repositories/userRepository');
const { generateAuthToken } = require('../utils/validation');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const newUser = await userRepository.addUserWithHashedPassword({ username, email, password, role });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error('Error in signup:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user || !userRepository.validatePassword(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateAuthToken(user);
        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, username: user.username, email: user.email, role: user.role },
            token,
        });
    } catch (err) {
        console.error('Error in login:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
