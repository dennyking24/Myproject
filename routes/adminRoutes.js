const express = require('express');
const { authenticateToken, checkAdminRole } = require('../middleware/authMiddleware');
const adminService = require('../services/adminService');
const reservationService = require('../services/reservationService');
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

router.delete('/users/:id', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
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
