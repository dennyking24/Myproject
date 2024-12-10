const roomRepository = require('../repositories/roomRepository');

class RoomService {
    getAllRooms() {
        return roomRepository.getAllRooms();
    }

    addRoom(roomData) {
        return roomRepository.addRoom(roomData);
    }

    updateRoom(roomId, roomData) {
        return roomRepository.updateRoom(roomId, roomData);
    }

    deleteRoom(roomId) {
        return roomRepository.deleteRoom(roomId);
    }
}

module.exports = new RoomService();
