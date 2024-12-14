// LOGOUT FUNCTIONALITY
// Clears local storage and redirects to the login page.
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

/******************* TABLE POPULATION FUNCTION *******************/
// Dynamically populates a table with given data and actions callback.
function populateTable(data, tableId, actionsCallback) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = ''; // Clear existing rows

    data.forEach((item) => {
        const row = document.createElement('tr');

        // Populate columns with item values
        Object.values(item).forEach((value) => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });

        // Add actions column
        const actions = document.createElement('td');
        actions.innerHTML = actionsCallback(item);
        row.appendChild(actions);

        tbody.appendChild(row);
    });
}

/******************* FETCH FUNCTIONS *******************/

// Fetch all users and populate the users table
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

// Fetch all rooms and populate the rooms table
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

// Fetch all reservations and populate the reservations table
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

/******************* CRUD FUNCTIONS *******************/

// Add a new room
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
            fetchRooms(); // Refresh rooms table
        } else {
            alert('Failed to add room');
        }
    } catch (error) {
        console.error('Error adding room:', error);
    }
});

// Delete a user
async function deleteUser(userId) {
    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

// Delete a room
async function deleteRoom(roomId) {
    try {
        const response = await fetch(`/api/rooms/${roomId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

// Cancel a reservation
async function cancelReservation(reservationId) {
    try {
        const response = await fetch(`/api/admin/reservations/${reservationId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

/******************* UPDATE FUNCTIONS *******************/

// Update user
let selectedUserId = null;

function openUserModal(user) {
    selectedUserId = user.id;
    document.getElementById('update-username').value = user.username;
    document.getElementById('update-email').value = user.email;
    document.getElementById('update-role').value = user.role;
    document.getElementById('update-user-modal').style.display = 'block';
}

document.getElementById('update-user-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('update-username').value;
    const email = document.getElementById('update-email').value;
    const role = document.getElementById('update-role').value;

    try {
        const response = await fetch(`/api/admin/users/${selectedUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ username, email, role }),
        });

        if (response.ok) {
            alert('User updated successfully');
            closeUserModal();
            fetchUsers(); // Refresh user table
        } else {
            alert('Failed to update user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
});

function closeUserModal() {
    selectedUserId = null;
    document.getElementById('update-user-modal').style.display = 'none';
}

// Update room
let selectedRoomId = null;

function openRoomModal(room) {
    selectedRoomId = room.id;
    document.getElementById('update-room-number').value = room.room_number;
    document.getElementById('update-room-type').value = room.type;
    document.getElementById('update-room-price').value = room.price;
    document.getElementById('update-room-availability').value = room.availability;
    document.getElementById('update-room-modal').style.display = 'block';
}

document.getElementById('update-room-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const roomNumber = document.getElementById('update-room-number').value;
    const type = document.getElementById('update-room-type').value;
    const price = document.getElementById('update-room-price').value;
    const availability = document.getElementById('update-room-availability').value;

    try {
        const response = await fetch(`/api/rooms/${selectedRoomId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ roomNumber, type, price, availability }),
        });

        if (response.ok) {
            alert('Room updated successfully');
            closeRoomModal();
            fetchRooms(); // Refresh room table
        } else {
            alert('Failed to update room');
        }
    } catch (error) {
        console.error('Error updating room:', error);
    }
});

function closeRoomModal() {
    selectedRoomId = null;
    document.getElementById('update-room-modal').style.display = 'none';
}

/******************* ACTION BUTTONS *******************/

// User action buttons (Update & Delete)
function userActions(user) {
    return `
        <button onclick="openUserModal(${JSON.stringify(user.id)})">Update</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
    `;
}

// Room action buttons (Update & Delete)
function roomActions(room) {
    return `
        <button onclick="openRoomModal(${JSON.stringify(room.id)})">Update</button>
        <button onclick="deleteRoom(${room.id})">Delete</button>
    `;
}

// Reservation action buttons (Cancel)
function reservationActions(reservation) {
    return `<button onclick="cancelReservation(${reservation.id})">Cancel</button>`;
}

/******************* FETCH BUTTONS *******************/

// Event listeners for viewing tables
document.getElementById('view-users-btn').addEventListener('click', fetchUsers);
document.getElementById('view-rooms-btn').addEventListener('click', fetchRooms);
document.getElementById('view-reservations-btn').addEventListener('click', fetchReservations);
