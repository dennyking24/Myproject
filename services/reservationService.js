const reservationRepository = require('../repositories/reservationRepository');

class ReservationService {
    createReservation(userId, roomId, checkIn, checkOut) {
        return reservationRepository.addReservation({ userId, roomId, checkIn, checkOut, status: 'pending' });
    }

    getReservationsByUser(userId) {
        return reservationRepository.getAllReservations(userId);
    }

    getAllReservations() {
        return reservationRepository.getAllReservations();
    }

    updateReservationStatus(reservationId, status, userId) {
        return reservationRepository.updateReservationStatus(reservationId, status, userId);
    }

    cancelReservation(reservationId, userId) {
        return reservationRepository.cancelReservation(reservationId, userId);
    }
}

module.exports = new ReservationService();

