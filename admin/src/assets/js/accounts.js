/* Accounts Page Script */

// API Configuration
const API_BASE_URL = 'http://localhost/CAATE-ITRMS/backend/public/api/v1';

// State
let traineesData = [];

document.addEventListener('DOMContentLoaded', function () {
    // Load trainees data
    loadTrainees();
    loadStatistics();

    // Menu toggle is handled by main.js - no need to duplicate here

    // Password Toggle for View Modal
    const toggleViewPassword = document.getElementById('toggleViewPassword');
    const viewPasswordInput = document.getElementById('viewTraineePassword');
    const viewPasswordIcon = document.getElementById('viewPasswordIcon');

    if (toggleViewPassword && viewPasswordInput && viewPasswordIcon) {
        toggleViewPassword.addEventListener('click', function () {
            // Toggle password visibility
            if (viewPasswordInput.type === 'password') {
                viewPasswordInput.type = 'text';
                viewPasswordIcon.classList.remove('bx-hide');
                viewPasswordIcon.classList.add('bx-show');
            } else {
                viewPasswordInput.type = 'password';
                viewPasswordIcon.classList.remove('bx-show');
                viewPasswordIcon.classList.add('bx-hide');
            }
        });
    }

    // Password Toggle for Add Modal
    const toggleAddPassword = document.getElementById('toggleAddPassword');
    const addPasswordInput = document.getElementById('addTraineePassword');
    const addPasswordIcon = document.getElementById('addPasswordIcon');

    if (toggleAddPassword && addPasswordInput && addPasswordIcon) {
        toggleAddPassword.addEventListener('click', function () {
            // Toggle password visibility
            if (addPasswordInput.type === 'password') {
                addPasswordInput.type = 'text';
                addPasswordIcon.classList.remove('bx-hide');
                addPasswordIcon.classList.add('bx-show');
            } else {
                addPasswordInput.type = 'password';
                addPasswordIcon.classList.remove('bx-show');
                addPasswordIcon.classList.add('bx-hide');
            }
        });
    }

    // Password Toggle for Edit Modal
    const toggleEditPassword = document.getElementById('toggleEditPassword');
    const editPasswordInput = document.getElementById('editTraineePassword');
    const editPasswordIcon = document.getElementById('editPasswordIcon');

    if (toggleEditPassword && editPasswordInput && editPasswordIcon) {
        toggleEditPassword.addEventListener('click', function () {
            // Toggle password visibility
            if (editPasswordInput.type === 'password') {
                editPasswordInput.type = 'text';
                editPasswordIcon.classList.remove('bx-hide');
                editPasswordIcon.classList.add('bx-show');
            } else {
                editPasswordInput.type = 'password';
                editPasswordIcon.classList.remove('bx-show');
                editPasswordIcon.classList.add('bx-hide');
            }
        });
    }

    // Populate Edit Trainee Modal with data
    const editTraineeModal = document.getElementById('editTraineeModal');
    if (editTraineeModal) {
        editTraineeModal.addEventListener('show.bs.modal', function (event) {
            // Button that triggered the modal
            const button = event.relatedTarget;

            // Get the closest table row
            const row = button.closest('tr');

            if (row) {
                // Extract data from the row
                const id = row.querySelector('td:nth-child(1) strong').textContent;
                const name = row.querySelector('td:nth-child(2) strong').textContent;
                const email = row.querySelector('td:nth-child(3)').textContent;
                const phone = row.querySelector('td:nth-child(4)').textContent;
                const statusBadge = row.querySelector('td:nth-child(5) .badge');
                const status = statusBadge ? statusBadge.textContent : '';

                // Populate the modal fields
                document.getElementById('editTraineeId').value = id;
                document.getElementById('editTraineeName').value = name;
                document.getElementById('editTraineeEmail').value = email;
                document.getElementById('editTraineePhone').value = phone;
                document.getElementById('editTraineeStatus').value = status;

                // Set a default password or leave empty for security
                document.getElementById('editTraineePassword').value = '';
            }
        });
    }
});


// Load trainees from API
async function loadTrainees() {
    try {
        const response = await fetch(`${API_BASE_URL}/trainees`);
        const result = await response.json();

        if (result.success) {
            traineesData = result.data;
            renderTrainees(traineesData);
        } else {
            console.error('Failed to load trainees:', result.error);
            showEmptyState('Failed to load trainees data');
        }
    } catch (error) {
        console.error('Error loading trainees:', error);
        showEmptyState('Error connecting to server. Please check if the backend is running.');
    }
}

// Show empty state with custom message
function showEmptyState(message) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center" style="padding: 60px 20px;">
                <div style="color: #697a8d;">
                    <i class="bx bx-error-circle" style="font-size: 4rem; opacity: 0.3; display: block; margin-bottom: 15px; color: #ff3e1d;"></i>
                    <h5 style="margin-bottom: 10px; color: #697a8d;">Connection Error</h5>
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">${message}</p>
                </div>
            </td>
        </tr>
    `;
}

// Load statistics from API
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/trainees/statistics`);
        const result = await response.json();

        if (result.success) {
            updateStatistics(result.data);
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Render trainees table
function renderTrainees(trainees) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (trainees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="padding: 60px 20px;">
                    <div style="color: #697a8d;">
                        <i class="bx bx-user-x" style="font-size: 4rem; opacity: 0.3; display: block; margin-bottom: 15px;"></i>
                        <h5 style="margin-bottom: 10px; color: #697a8d;">No accounts existing in here</h5>
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">The trainee database collection is empty.</p>
                        <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.7;">Click "Add New Trainee" to create your first account.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    trainees.forEach((trainee, index) => {
        const row = createTraineeRow(trainee, index + 1);
        tbody.appendChild(row);
    });
}

// Create trainee table row
function createTraineeRow(trainee, index) {
    const tr = document.createElement('tr');

    const fullName = `${trainee.first_name} ${trainee.last_name}`;
    const initials = `${trainee.first_name.charAt(0)}${trainee.last_name.charAt(0)}`;
    const statusBadge = getStatusBadge(trainee.status);
    const avatarColor = getAvatarColor(index);

    tr.innerHTML = `
        <td><strong>#${String(index).padStart(2, '0')}</strong></td>
        <td>
            <div class="d-flex align-items-center">
                <div class="avatar avatar-sm me-3">
                    <span class="avatar-initial rounded-circle ${avatarColor}">${initials}</span>
                </div>
                <div>
                    <strong>${fullName}</strong>
                </div>
            </div>
        </td>
        <td>${trainee.email}</td>
        <td>${trainee.phone}</td>
        <td><span class="badge ${statusBadge.class}">${statusBadge.text}</span></td>
        <td>
            <div class="dropdown">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="javascript:void(0);" onclick="editTrainee('${trainee._id}')">
                        <i class="bx bx-edit-alt me-1"></i> Edit
                    </a>
                    <a class="dropdown-item" href="javascript:void(0);" onclick="viewTrainee('${trainee._id}')">
                        <i class="bx bx-show me-1"></i> View
                    </a>
                    <a class="dropdown-item text-danger" href="javascript:void(0);" onclick="deleteTrainee('${trainee._id}')">
                        <i class="bx bx-trash me-1"></i> Delete
                    </a>
                </div>
            </div>
        </td>
    `;

    return tr;
}

// Get status badge configuration
function getStatusBadge(status) {
    // Default to pending if no status
    if (!status) status = 'pending';

    const badges = {
        'active': { class: 'bg-success', text: 'Active' },
        'enrolled': { class: 'bg-success', text: 'Enrolled' },
        'pending': { class: 'bg-warning', text: 'Pending' },
        'completed': { class: 'bg-primary', text: 'Completed' },
        'inactive': { class: 'bg-secondary', text: 'Inactive' }
    };

    return badges[status.toLowerCase()] || { class: 'bg-warning', text: 'Pending' };
}



// Get avatar color based on index
function getAvatarColor(index) {
    const colors = [
        'bg-label-primary',
        'bg-label-warning',
        'bg-label-danger',
        'bg-label-success',
        'bg-label-info'
    ];

    return colors[index % colors.length];
}

// Update statistics
function updateStatistics(stats) {
    // Update Total Trainees
    const totalElement = document.getElementById('totalTraineesCount');
    if (totalElement) {
        totalElement.textContent = stats.total.toLocaleString();
    }

    // Update Enrolled Trainees
    const enrolledElement = document.getElementById('enrolledTraineesCount');
    if (enrolledElement) {
        enrolledElement.textContent = stats.enrolled.toLocaleString();
    }

    // Update Completed Trainees
    const completedElement = document.getElementById('completedTraineesCount');
    if (completedElement) {
        completedElement.textContent = stats.completed.toLocaleString();
    }

    // Update Pending
    const pendingElement = document.getElementById('pendingTraineesCount');
    if (pendingElement) {
        pendingElement.textContent = stats.pending.toLocaleString();
    }

    console.log('Statistics updated:', stats);
}

// View trainee details
function viewTrainee(id) {
    const trainee = traineesData.find(t => t._id === id);
    if (!trainee) return;

    // Populate view modal
    document.getElementById('viewTraineeName').value = `${trainee.first_name} ${trainee.last_name}`;
    document.getElementById('viewTraineeEmail').value = trainee.email;
    document.getElementById('viewTraineePhone').value = trainee.phone;
    document.getElementById('viewTraineeAddress').value = trainee.address || '';
    document.getElementById('viewTraineeStatus').value = trainee.status || 'pending';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewTraineeModal'));
    modal.show();
}

// Edit trainee
function editTrainee(id) {
    const trainee = traineesData.find(t => t._id === id);
    if (!trainee) return;

    // Populate edit modal
    document.getElementById('editTraineeId').value = trainee._id;
    document.getElementById('editTraineeName').value = `${trainee.first_name} ${trainee.last_name}`;
    document.getElementById('editTraineeEmail').value = trainee.email;
    document.getElementById('editTraineePhone').value = trainee.phone;
    document.getElementById('editTraineeStatus').value = trainee.status || 'pending';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editTraineeModal'));
    modal.show();
}

// Delete trainee
async function deleteTrainee(id) {
    const trainee = traineesData.find(t => t._id === id);
    if (!trainee) return;

    // Populate delete modal with trainee info
    document.getElementById('deleteTraineeName').textContent = `${trainee.first_name} ${trainee.last_name}`;
    document.getElementById('deleteTraineeId').value = id;

    // Show the Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById('deleteTraineeModal'));
    modal.show();
}

// Confirm delete trainee
async function confirmDeleteTrainee() {
    const id = document.getElementById('deleteTraineeId').value;

    try {
        const response = await fetch(`${API_BASE_URL}/trainees/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteTraineeModal'));
            modal.hide();

            showSuccess('Trainee deleted successfully');
            loadTrainees();
            loadStatistics();
        } else {
            showError(result.error || 'Failed to delete trainee');
        }
    } catch (error) {
        console.error('Error deleting trainee:', error);
        showError('Error connecting to server');
    }
}

// Show success message
function showSuccess(message) {
    alert(message); // Replace with better notification system
}

// Show error message
function showError(message) {
    alert(message); // Replace with better notification system
}


// Save edited trainee
async function saveEditTrainee() {
    const id = document.getElementById('editTraineeId').value;
    const fullName = document.getElementById('editTraineeName').value;
    const email = document.getElementById('editTraineeEmail').value;
    const phone = document.getElementById('editTraineePhone').value;
    const status = document.getElementById('editTraineeStatus').value;

    // Split full name into first and last name
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Validate required fields
    if (!firstName || !email || !phone) {
        showError('Please fill in all required fields');
        return;
    }

    const updateData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        status: status.toLowerCase()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/trainees/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (result.success) {
            showSuccess('Trainee updated successfully');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editTraineeModal'));
            modal.hide();

            // Reload trainees and statistics
            loadTrainees();
            loadStatistics();
        } else {
            showError(result.error || 'Failed to update trainee');
        }
    } catch (error) {
        console.error('Error updating trainee:', error);
        showError('Error connecting to server');
    }
}
