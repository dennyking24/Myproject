// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

// Fetch and populate users
async function fetchUsers() {
    try {
        const response = await fetch('/admin/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const users = await response.json();
        populateTable(users, 'users-table', userActions);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Fetch and populate rooms
async function fetchRooms() {
    try {
        const response = await fetch('/api/rooms', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const rooms = await response.json();
        populateTable(rooms, 'rooms-table', roomActions);
    } catch (error) {
        console.error('Error fetching rooms:', error);
    }
}

// Fetch and populate reservations
async function fetchReservations() {
    try {
        const response = await fetch('/admin/reservations', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const reservations = await response.json();
        populateTable(reservations, 'reservations-table', reservationActions);
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
}

// Populate tables dynamically
function populateTable(data, tableId, actionsCallback) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    data.forEach((item) => {
        const row = document.createElement('tr');
        Object.values(item).forEach((value) => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        const actions = document.createElement('td');
        actions.innerHTML = actionsCallback(item);
        row.appendChild(actions);
        tbody.appendChild(row);
    });
}

// User-specific actions
function userActions(user) {
    return `
        <button onclick="deleteUser(${user.id})">Delete</button>
    `;
}

// Room-specific actions
function roomActions(room) {
    return `
        <button onclick="deleteRoom(${room.id})">Delete</button>
    `;
}

// Reservation-specific actions
function reservationActions(reservation) {
    return `
        <button onclick="cancelReservation(${reservation.id})">Cancel</button>
    `;
}

// Add event listeners for viewing data
document.getElementById('view-users-btn').addEventListener('click', fetchUsers);
document.getElementById('view-rooms-btn').addEventListener('click', fetchRooms);
document.getElementById('view-reservations-btn').addEventListener('click', fetchReservations);

// Add a room
document.getElementById('add-room-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const roomNumber = document.getElementById('room-number').value;
    const type = document.getElementById('room-type').value;
    const price = document.getElementById('room-price').value;
    const availability = document.getElementById('room-availability').value;

    try {
        const response = await fetch('/api/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ roomNumber, type, price, availability }),
        });
        if (response.ok) {
            alert('Room added successfully');
            fetchRooms();
        } else {
            alert('Failed to add room');
        }
    } catch (error) {
        console.error('Error adding room:', error);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // Event listener for "View All Users"
    const viewUsersButton = document.getElementById('view-users-btn');
    if (viewUsersButton) {
        viewUsersButton.addEventListener('click', fetchAllUsers);
    }

    // Event listener for "View All Reservations"
    const viewReservationsButton = document.getElementById('view-reservations-btn');
    if (viewReservationsButton) {
        viewReservationsButton.addEventListener('click', fetchAllReservations);
    }
});

// Fetch and display all users
async function fetchAllUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            const users = await response.json();
            populateUsersTable(users);
        } else {
            const error = await response.json();
            alert(`Error fetching users: ${error.error}`);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users.');
    }
}

// Populate users table
function populateUsersTable(users) {
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = ''; // Clear existing rows
    users.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fetch and display all reservations
async function fetchAllReservations() {
    try {
        const response = await fetch('/api/admin/reservations', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            const reservations = await response.json();
            populateReservationsTable(reservations);
        } else {
            const error = await response.json();
            alert(`Error fetching reservations: ${error.error}`);
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
        alert('Failed to fetch reservations.');
    }
}


// Populate reservations table
function populateReservationsTable(reservations) {
    const tbody = document.querySelector('#reservations-table tbody');
    tbody.innerHTML = ''; // Clear existing rows
    reservations.forEach((reservation) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reservation.id}</td>
            <td>${reservation.user_id}</td>
            <td>${reservation.room_id}</td>
            <td>${reservation.check_in}</td>
            <td>${reservation.check_out}</td>
            <td>${reservation.status}</td>
            <td>
                <button onclick="cancelReservation(${reservation.id})">Cancel</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Example function for canceling a reservation
async function cancelReservation(reservationId) {
    try {
        const response = await fetch(`/api/admin/reservations/${reservationId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            alert('Reservation canceled successfully');
            fetchAllReservations(); // Refresh reservations
        } else {
            const error = await response.json();
            alert(`Error canceling reservation: ${error.error}`);
        }
    } catch (error) {
        console.error('Error canceling reservation:', error);
        alert('Failed to cancel reservation.');
    }
}
