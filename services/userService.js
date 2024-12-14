const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

class UserService {
    // Fetch all users
    async getAllUsers() {
        try {
            return await userRepository.getAllUsers();
        } catch (error) {
            console.error('Error fetching all users:', error.message);
            throw new Error('Unable to fetch users');
        }
    }

    // Fetch a user by ID
    async getUserById(userId) {
        try {
            return await userRepository.getUserById(userId);
        } catch (error) {
            console.error('Error fetching user by ID:', error.message);
            throw new Error('Unable to fetch user');
        }
    }

    // Delete a user
    async deleteUser(userId) {
        try {
            return await userRepository.deleteUser(userId);
        } catch (error) {
            console.error('Error deleting user:', error.message);
            throw new Error('Unable to delete user');
        }
    }

     // Update a user's details
     async updateUser(userId, userDetails) {
        try {
            if (userDetails.password) {
                userDetails.password = bcrypt.hashSync(userDetails.password, 10);
            }
            return await userRepository.updateUser(userId, userDetails);
        } catch (error) {
            console.error('Error updating user:', error.message);
            throw new Error('Unable to update user');
        }
    }
}

module.exports = new UserService();
