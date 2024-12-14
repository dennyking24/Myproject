const express = require('express');
const { authenticateToken, checkAdminRole } = require('../middleware/authMiddleware');
const adminService = require('../services/adminService');
const reservationService = require('../services/reservationService');
const userService = require('../services/userService');

const router = express.Router();

// View all users
router.get('/users', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user
router.put('/users/:id', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const userId = req.params.id;
        const userDetails = req.body;
        await userService.updateUser(userId, userDetails);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// View all reservations
router.get('/reservations', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const reservations = await reservationService.getAllReservations();
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error.message);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

router.delete('/reservations/:id', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        await reservationService.cancelReservation(req.params.id);
        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({ error: 'Failed to delete reservation' });
    }
});

// Delete a user by ID
router.delete('/users/:id', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const userId = req.params.id;
        await userService.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/rooms/:id', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        await roomService.deleteRoom(req.params.id);
        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ error: 'Failed to delete room' });
    }
});




module.exports = router;
