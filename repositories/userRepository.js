const bcrypt = require('bcryptjs');
const BaseRepository = require('./baseRepository');
const db = require('../db');

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
}

module.exports = new UserRepository();