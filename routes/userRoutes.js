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

// Delete a user (Admin only)
router.delete('/:id', authenticateToken, checkAdminRole, async (req, res) => {
    const userId = req.params.id;
    try {
        await userService.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
