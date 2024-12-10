const express = require('express');
const userService = require('../services/userService');
const { authenticateToken, checkAdminRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific user by ID
router.get('/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    try {
        if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user details
router.put('/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    try {
        if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const updatedUser = await userService.updateUser(userId, { username, email, password });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a user (Admin only)
router.delete('/:id', authenticateToken, checkAdminRole, async (req, res) => {
    const userId = req.params.id;
    try {
        await userService.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
