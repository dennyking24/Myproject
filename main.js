const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Routes
app.use('/auth', authenticationRoutes); // Authentication routes (Signup/Login)
app.use('/api/users', authenticateToken, userRoutes); // User routes (Authenticated)
app.use('/api/admin', authenticateToken, adminRoutes); // Admin routes (Authenticated and Admin role)
app.use('/api/rooms', authenticateToken, roomRoutes); // Room management routes (Authenticated)
app.use('/api/reservations', authenticateToken, reservationRoutes); // Reservation routes (Authenticated)

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



