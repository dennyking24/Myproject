// Logout functionality
// Clears the local storage and redirects to the login page.
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

// Fetch and populate tables dynamically based on provided data
// Dynamically populates the table rows with the given data and callback for actions.
function populateTable(data, tableId, actionsCallback) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = ''; // Clear existing rows

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

// Fetch Users
// Retrieves and populates the users table.
async function fetchUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
            const users = await response.json();
            populateTable(users, 'users-table', userActions);
        } else {
            const error = await response.json();
            alert(`Error fetching users: ${error.error}`);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Fetch Rooms
// Retrieves and populates the rooms table.
async function fetchRooms() {
    try {
        const response = await fetch('/api/rooms', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
            const rooms = await response.json();
            populateTable(rooms, 'rooms-table', roomActions);
        } else {
            const error = await response.json();
            alert(`Error fetching rooms: ${error.error}`);
        }
    } catch (error) {
        console.error('Error fetching rooms:', error);
    }
}

// Fetch Reservations
// Retrieves and populates the reservations table.
async function fetchReservations() {
    try {
        const response = await fetch('/api/admin/reservations', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
            const reservations = await response.json();
            populateTable(reservations, 'reservations-table', reservationActions);
        } else {
            const error = await response.json();
            alert(`Error fetching reservations: ${error.error}`);
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
}

// Add a Room
// Handles adding a new room via the form.
document.getElementById('add-room-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

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

// Delete a User
async function deleteUser(userId) {
    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            alert('User deleted successfully');
            fetchUsers(); // Refresh users table
        } else {
            const error = await response.json();
            alert(`Error deleting user: ${error.error}`);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Delete a Room
async function deleteRoom(roomId) {
    try {
        const response = await fetch(`/api/rooms/${roomId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            alert('Room deleted successfully');
            fetchRooms(); // Refresh rooms table
        } else {
            const error = await response.json();
            alert(`Error deleting room: ${error.error}`);
        }
    } catch (error) {
        console.error('Error deleting room:', error);
    }
}

// Cancel a Reservation
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
            fetchReservations(); // Refresh reservations table
        } else {
            const error = await response.json();
            alert(`Error canceling reservation: ${error.error}`);
        }
    } catch (error) {
        console.error('Error canceling reservation:', error);
    }
}

// Action Buttons for Users
function userActions(user) {
    return `<button onclick="deleteUser(${user.id})">Delete</button>`;
}

// Action Buttons for Rooms
function roomActions(room) {
    return `<button onclick="deleteRoom(${room.id})">Delete</button>`;
}

// Action Buttons for Reservations
function reservationActions(reservation) {
    return `<button onclick="cancelReservation(${reservation.id})">Cancel</button>`;
}

// Add Event Listeners for Fetch Buttons
document.getElementById('view-users-btn').addEventListener('click', fetchUsers);
document.getElementById('view-rooms-btn').addEventListener('click', fetchRooms);
document.getElementById('view-reservations-btn').addEventListener('click', fetchReservations);