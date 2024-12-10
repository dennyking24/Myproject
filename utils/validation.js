const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

function generateAuthToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
}

module.exports = { generateAuthToken };