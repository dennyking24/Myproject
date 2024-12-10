const express = require('express');
const roomService = require('../services/roomService');
const { authenticateToken, checkAdminRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all available rooms (Public)
router.get('/available', async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms();
        const availableRooms = rooms.filter((room) => room.availability === 1);
        res.json(availableRooms);
    } catch (error) {
        console.error('Error fetching available rooms:', error.message);
        res.status(500).json({ error: 'Failed to fetch available rooms' });
    }
});

// Get all rooms (Admin only)
router.get('/', authenticateToken, checkAdminRole, async (req, res) => {
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
    try {
        await roomService.deleteRoom(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting room:', error.message);
        res.status(500).json({ error: 'Failed to delete room' });
    }
});

module.exports = router;
