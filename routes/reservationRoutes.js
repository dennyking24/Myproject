const express = require('express');
const reservationService = require('../services/reservationService');
const { authenticateToken, checkAdminRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Get user's reservations
router.get('/', authenticateToken, async (req, res) => {
    try {
        const reservations = await reservationService.getReservationsByUser(req.user.id);
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/reservations', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available from the token
        const reservations = await reservationService.getReservationsByUser(userId);
        console.log('Reservations:', reservations); // Log the response
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error.message);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});



// Create a reservation
router.post('/', authenticateToken, async (req, res) => {
    const { roomId, checkIn, checkOut } = req.body;
    try {
        const reservation = await reservationService.createReservation(req.user.id, roomId, checkIn, checkOut);
        res.status(201).json(reservation);
    } catch (error) {
        console.error('Error creating reservation:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Update a reservation
router.put('/:id', authenticateToken, async (req, res) => {
    const { status } = req.body;
    try {
        await reservationService.updateReservationStatus(req.params.id, status);
        res.status(200).send('Reservation updated');
    } catch (error) {
        console.error('Error updating reservation:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a reservation
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await reservationService.cancelReservation(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting reservation:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/reservations/:id', authenticateToken,checkAdminRole, async (req, res) => {
    try {
        await reservationService.cancelReservation(req.params.id);
        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({ error: 'Failed to delete reservation' });
    }
});


module.exports = router;
