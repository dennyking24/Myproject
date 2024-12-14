const db = require('../db');
const BaseRepository = require('./baseRepository');

class RoomRepository  extends BaseRepository {
    constructor() {
        super(db);
    }
    getAllRooms() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM rooms', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    getAvailableRooms(filters = {}) {
        const { type, maxPrice } = filters;
        let query = 'SELECT * FROM rooms WHERE availability = 1';
        const params = [];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        return this.fetchAll(query, params);
    }


    addRoom(roomData) {
        const { roomNumber, type, price, availability } = roomData;
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO rooms (room_number, type, price, availability) VALUES (?, ?, ?, ?)';
            db.run(query, [roomNumber, type, price, availability], function (err) {
                if (err) return reject(err);
                resolve({ id: this.lastID, ...roomData });
            });
        });
    }

    updateRoom(roomId, roomData) {
        const { roomNumber, type, price, availability } = roomData;
        return new Promise((resolve, reject) => {
            const query = 'UPDATE rooms SET room_number = ?, type = ?, price = ?, availability = ? WHERE id = ?';
            db.run(query, [roomNumber, type, price, availability, roomId], function (err) {
                if (err) return reject(err);
                resolve({ id: roomId, ...roomData });
            });
        });
    }

    deleteRoom(roomId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM rooms WHERE id = ?', [roomId], function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = new RoomRepository();
