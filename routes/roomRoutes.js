const express = require('express');
const roomService = require('../services/roomService');
const { authenticateToken, checkAdminRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all available rooms (user)
router.get('/available', async (req, res) => {
    try {
        const rooms = await roomService.getAvailableRooms();
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching available rooms:', error.message);
        res.status(500).json({ error: 'Failed to fetch available rooms' });
    }
});

// Get all rooms (Admin only)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error.message);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// Add a new room (Admin only)
router.post('/', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const newRoom = await roomService.addRoom(req.body);
        res.status(201).json(newRoom);
    } catch (error) {
        console.error('Error adding room:', error.message);
        res.status(500).json({ error: 'Failed to add room' });
    }
});

// Update a room (Admin only)
router.put('/:id', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const updatedRoom = await roomService.updateRoom(req.params.id, req.body);
        res.status(200).json(updatedRoom);
    } catch (error) {
        console.error('Error updating room:', error.message);
        res.status(500).json({ error: 'Failed to update room' });
    }
});

// Delete a room (Admin only)
router.delete('/:id', authenticateToken, checkAdminRole, async (req, res) => {
    const roomId = req.params.id;
    try {
        await roomService.deleteRoom(roomId);
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error.message);
        res.status(500).json({ error: 'Failed to delete room' });
    }
});



module.exports = router;
