const bcrypt = require('bcryptjs');
const db = require('../db');
const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
    constructor() {
        super(db);
    }

    getAllUsers() {
        return this.fetchAll('SELECT * FROM users');
    }

    async addUserWithHashedPassword(user) {
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        return this.runQuery(query, [user.username, user.email, hashedPassword, user.role]);
    }

    getUserByEmail(email) {
        return this.fetchOne('SELECT * FROM users WHERE email = ?', [email]);
    }

    validatePassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }

    deleteUser(userId) {
        return this.delete('DELETE FROM users WHERE id = ?', [userId]);
    }
       // Update a user's details
        updateUser(userId, { username, email, password, role }) {
        const query = `
            UPDATE users
            SET username = ?, email = ?, ${password ? 'password = ?,' : ''} role = ?
            WHERE id = ?
        `;
        const params = password
            ? [username, email, password, role, userId]
            : [username, email, role, userId];
        return this.update(query, params);
    }
    
}

module.exports = new UserRepository();
