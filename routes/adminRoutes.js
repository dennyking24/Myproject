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

module.exports = router;
