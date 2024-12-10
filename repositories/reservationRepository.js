const db = require('../db');
const BaseRepository = require('./baseRepository');

class ReservationRepository extends BaseRepository {
    constructor() {
        super(db);
    }
    addReservation(reservation) {
        const { userId, roomId, checkIn, checkOut, status } = reservation;
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO reservations (user_id, room_id, check_in_date, check_out_date, status)
                VALUES (?, ?, ?, ?, ?);
            `;
            db.run(query, [userId, roomId, checkIn, checkOut, status], function (err) {
                if (err) return reject(err);
                resolve({ id: this.lastID, ...reservation });
            });
        });
    }

    getReservationsByUser(userId) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM reservations WHERE user_id = ?', [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    getAllReservations() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM reservations', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    updateReservationStatus(reservationId, status) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE reservations SET status = ? WHERE id = ?', [status, reservationId], function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    cancelReservation(reservationId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM reservations WHERE id = ?', [reservationId], function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = new ReservationRepository();
