const userRepository = require('../repositories/userRepository');
const reservationRepository = require('../repositories/reservationRepository');

class AdminService {
    getAllUsers() {
        return userRepository.getAllUsers();
    }

    getAllReservations() {
        return reservationRepository.getAllReservations();
    }
}

module.exports = new AdminService();
