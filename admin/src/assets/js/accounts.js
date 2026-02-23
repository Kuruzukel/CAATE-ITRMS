/* Accounts Page Script - Updated Avatar Styling */

// API Configuration
const API_BASE_URL = 'http://localhost/CAATE-ITRMS/backend/public/api/v1';

// State
let traineesData = [];

// Password generation characters
const upper = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
const lower = 'abcdefghijkmnopqrstuvwxyz';
const digits = '123456789';
const special = '!@#_$';

// Generate random password function
function generateRandomPassword(length = 12) {
    const characters = upper + lower + digits + special;
    let password = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return password;
}

document.addEventListener('DOMContentLoaded', function () {
    // Load trainees data
    loadTrainees();
    loadStatistics();

    // Setup filter event listeners
    setupFilters();

    // Menu toggle is handled by main.js - no need to duplicate here

    // Password Toggle for View Modal
    const toggleViewPassword = document.getElementById('toggleViewPassword');
    const viewPasswordInput = document.getElementById('viewTraineePassword');
    const viewPasswordIcon = document.getElementById('viewPasswordIcon');

    if (toggleViewPassword && viewPasswordInput && viewPasswordIcon) {
        toggleViewPassword.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Toggle password visibility
            const isPassword = viewPasswordInput.getAttribute('type') === 'password';
            viewPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');

            if (isPassword) {
                viewPasswordIcon.classList.remove('bx-hide');
                viewPasswordIcon.classList.add('bx-show');
            } else {
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

    // Auto-generate password function
    function generateRandomPassword(length = 12) {
        const upper = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
        const lower = 'abcdefghijkmnopqrstuvwxyz';
        const digits = '123456789';
        const special = '!@#_$';
        const characters = upper + lower + digits + special;

        let password = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return password;
    }

    // Auto-generate password button for Add Modal
    const generateAddPassword = document.getElementById('generateAddPassword');
    if (generateAddPassword && addPasswordInput) {
        generateAddPassword.addEventListener('click', function () {
            const newPassword = generateRandomPassword(12);
            addPasswordInput.value = newPassword;
            addPasswordInput.type = 'text'; // Show the generated password
            addPasswordIcon.classList.remove('bx-hide');
            addPasswordIcon.classList.add('bx-show');
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

    // Reset button state when Add Trainee modal is hidden
    const addTraineeModal = document.getElementById('addTraineeModal');
    if (addTraineeModal) {
        addTraineeModal.addEventListener('hidden.bs.modal', function () {
            const addButton = addTraineeModal.querySelector('.btn-primary');
            if (addButton) {
                addButton.disabled = false;
                addButton.innerHTML = 'Add Trainee';
                addButton.blur();
                addButton.classList.remove('active', 'focus');
                // Force remove focus styles with a slight delay
                setTimeout(() => {
                    addButton.blur();
                }, 100);
            }
        });

        // Generate trainee ID when modal is shown
        addTraineeModal.addEventListener('show.bs.modal', function () {
            generateTraineeId();
        });
    }

    // Reset button state when Edit Trainee modal is hidden
    const editTraineeModal = document.getElementById('editTraineeModal');
    if (editTraineeModal) {
        editTraineeModal.addEventListener('hidden.bs.modal', function () {
            const saveButton = editTraineeModal.querySelector('.btn-primary');
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.innerHTML = 'Save Changes';
                saveButton.blur();
                saveButton.classList.remove('active', 'focus');
                // Force remove focus styles with a slight delay
                setTimeout(() => {
                    saveButton.blur();
                }, 100);
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

    // Build full name with all name parts
    let fullName = trainee.first_name;
    if (trainee.second_name) {
        fullName += ' ' + trainee.second_name;
    }
    if (trainee.middle_name) {
        fullName += ' ' + trainee.middle_name;
    }
    fullName += ' ' + trainee.last_name;
    if (trainee.suffix) {
        fullName += ' ' + trainee.suffix;
    }

    const initials = `${trainee.first_name.charAt(0)}${trainee.last_name.charAt(0)}`;
    const statusBadge = getStatusBadge(trainee.status);
    const displayId = trainee.trainee_id || String(index).padStart(2, '0');

    tr.innerHTML = `
        <td><strong>${displayId}</strong></td>
        <td>
            <div class="d-flex align-items-center">
                <div class="avatar avatar-sm me-3" style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); backdrop-filter: blur(10px) saturate(180%); -webkit-backdrop-filter: blur(10px) saturate(180%); border: 1px solid rgba(54, 145, 191, 0.4); box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 38px; height: 38px; font-weight: 600;">
                    ${initials}
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
}

// View trainee details
function viewTrainee(id) {
    const trainee = traineesData.find(t => t._id === id);
    if (!trainee) return;

    // Populate view modal with separate name fields
    document.getElementById('viewTraineeId').value = trainee.trainee_id || trainee._id || '';
    document.getElementById('viewTraineeFirstName').value = trainee.first_name || '';
    document.getElementById('viewTraineeSecondName').value = trainee.second_name || '';
    document.getElementById('viewTraineeMiddleName').value = trainee.middle_name || '';
    document.getElementById('viewTraineeLastName').value = trainee.last_name || '';
    document.getElementById('viewTraineeSuffix').value = trainee.suffix || '';
    document.getElementById('viewTraineeEmail').value = trainee.email || '';
    document.getElementById('viewTraineePhone').value = trainee.phone || '';
    document.getElementById('viewTraineeStatus').value = trainee.status || 'pending';

    // Set password field (show actual password from database)
    const passwordField = document.getElementById('viewTraineePassword');
    if (passwordField) {
        passwordField.value = trainee.password || '';
        // Reset to password type when modal opens
        passwordField.setAttribute('type', 'password');
        const viewPasswordIcon = document.getElementById('viewPasswordIcon');
        if (viewPasswordIcon) {
            viewPasswordIcon.classList.remove('bx-show');
            viewPasswordIcon.classList.add('bx-hide');
        }
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewTraineeModal'));
    modal.show();
}

// Edit trainee
function editTrainee(id) {
    const trainee = traineesData.find(t => t._id === id);
    if (!trainee) return;

    // Store original trainee data for change detection
    window.originalTraineeData = {
        trainee_id: trainee.trainee_id || '',
        first_name: trainee.first_name || '',
        second_name: trainee.second_name || '',
        middle_name: trainee.middle_name || '',
        last_name: trainee.last_name || '',
        suffix: trainee.suffix || '',
        email: trainee.email || '',
        phone: trainee.phone || '',
        status: trainee.status || 'pending'
    };

    // Populate edit modal with separate name fields
    document.getElementById('editTraineeId').value = trainee.trainee_id || '';
    document.getElementById('editTraineeFirstName').value = trainee.first_name || '';
    document.getElementById('editTraineeSecondName').value = trainee.second_name || '';
    document.getElementById('editTraineeMiddleName').value = trainee.middle_name || '';
    document.getElementById('editTraineeLastName').value = trainee.last_name || '';
    document.getElementById('editTraineeSuffix').value = trainee.suffix || '';
    document.getElementById('editTraineeEmail').value = trainee.email;
    document.getElementById('editTraineePhone').value = trainee.phone;
    document.getElementById('editTraineeStatus').value = trainee.status || 'pending';
    document.getElementById('editTraineePassword').value = ''; // Clear password field

    // Store the MongoDB _id in a hidden field or data attribute
    document.getElementById('editTraineeForm').setAttribute('data-trainee-id', trainee._id);

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
    showToast(message, 'success');
}

// Show error message
function showError(message) {
    showToast(message, 'error');
}

// Show toast notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-alt' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="bx bx-x"></i>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, 5000);
}

// Close toast notification
function closeToast(button) {
    const toast = button.closest('.toast-notification');
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}


// Save edited trainee
async function saveEditTrainee() {
    const submitBtn = document.querySelector('#editTraineeModal .btn-primary');
    const originalBtnText = submitBtn.innerHTML;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...';

    // Get MongoDB _id from data attribute
    const mongoId = document.getElementById('editTraineeForm').getAttribute('data-trainee-id');
    const studentId = document.getElementById('editTraineeId').value.trim();
    const firstName = document.getElementById('editTraineeFirstName').value.trim();
    const secondName = document.getElementById('editTraineeSecondName').value.trim();
    const middleName = document.getElementById('editTraineeMiddleName').value.trim();
    const lastName = document.getElementById('editTraineeLastName').value.trim();
    const suffix = document.getElementById('editTraineeSuffix').value.trim();
    const email = document.getElementById('editTraineeEmail').value.trim();
    const phone = document.getElementById('editTraineePhone').value.trim();
    const status = document.getElementById('editTraineeStatus').value;
    const password = document.getElementById('editTraineePassword').value;

    // Check if any changes were made
    if (window.originalTraineeData) {
        const hasChanges =
            studentId !== window.originalTraineeData.trainee_id ||
            firstName !== window.originalTraineeData.first_name ||
            secondName !== window.originalTraineeData.second_name ||
            middleName !== window.originalTraineeData.middle_name ||
            lastName !== window.originalTraineeData.last_name ||
            suffix !== window.originalTraineeData.suffix ||
            email !== window.originalTraineeData.email ||
            phone !== window.originalTraineeData.phone ||
            status !== window.originalTraineeData.status ||
            password !== ''; // Password field has value means it was changed

        if (!hasChanges) {
            showToast('No changes were made to the trainee', 'info');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            return;
        }
    }

    // Validate required fields
    if (!studentId || !firstName || !lastName || !email || !phone) {
        showError('Please fill in all required fields');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    // Validate name fields (only letters and spaces)
    const namePattern = /^[A-Za-z\s\-']+$/;
    if (!namePattern.test(firstName)) {
        showError('First name should only contain letters, spaces, hyphens, and apostrophes');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }
    if (secondName && !namePattern.test(secondName)) {
        showError('Second name should only contain letters, spaces, hyphens, and apostrophes');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }
    if (middleName && !namePattern.test(middleName)) {
        showError('Middle name should only contain letters, spaces, hyphens, and apostrophes');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }
    if (!namePattern.test(lastName)) {
        showError('Last name should only contain letters, spaces, hyphens, and apostrophes');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    // Validate phone (only numbers)
    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(phone)) {
        showError('Mobile number should only contain numbers');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError('Please enter a valid email address');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    // Validate password length if provided
    if (password && password.length < 6) {
        showError('Password must be at least 6 characters long');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    // Check if any changes were made (compare with original data)
    const hasChanges =
        window.originalTraineeData.trainee_id !== studentId ||
        window.originalTraineeData.first_name !== firstName ||
        window.originalTraineeData.second_name !== secondName ||
        window.originalTraineeData.middle_name !== middleName ||
        window.originalTraineeData.last_name !== lastName ||
        window.originalTraineeData.suffix !== suffix ||
        window.originalTraineeData.email !== email ||
        window.originalTraineeData.phone !== phone ||
        window.originalTraineeData.status !== status.toLowerCase() ||
        password !== ''; // Password change counts as a change

    if (!hasChanges) {
        showToast('No changes were made to the trainee', 'info');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    const updateData = {
        trainee_id: studentId,
        first_name: firstName,
        second_name: secondName,
        middle_name: middleName,
        last_name: lastName,
        suffix: suffix,
        email: email,
        phone: phone,
        status: status.toLowerCase()
    };

    // Only include password if it was changed
    if (password) {
        updateData.password = password;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/trainees/${mongoId}`, {
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

            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        } else {
            showError(result.error || 'Failed to update trainee');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    } catch (error) {
        console.error('Error updating trainee:', error);
        showError('Error connecting to server');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}




// Generate trainee ID in format TRN-YYYY-XXX
async function generateTraineeId() {
    try {
        // Get current year
        const currentYear = new Date().getFullYear();

        // Fetch existing trainees to find the highest number
        const response = await fetch(`${API_BASE_URL}/trainees`);
        const result = await response.json();

        if (result.success) {
            const trainees = result.data;

            // Filter trainees with IDs matching the current year pattern
            const yearPattern = new RegExp(`^TRN-${currentYear}-(\\d+)$`);
            let maxNumber = 0;

            trainees.forEach(trainee => {
                if (trainee.trainee_id) {
                    const match = trainee.trainee_id.match(yearPattern);
                    if (match) {
                        const num = parseInt(match[1], 10);
                        if (num > maxNumber) {
                            maxNumber = num;
                        }
                    }
                }
            });

            // Generate next sequential number
            const nextNumber = maxNumber + 1;
            const paddedNumber = String(nextNumber).padStart(3, '0');

            return `TRN-${currentYear}-${paddedNumber}`;
        } else {
            // If API fails, start with 001
            return `TRN-${currentYear}-001`;
        }
    } catch (error) {
        console.error('Error generating trainee ID:', error);
        // Fallback to default
        const currentYear = new Date().getFullYear();
        return `TRN-${currentYear}-001`;
    }
}

// Save new trainee
async function saveNewTrainee() {
    // Get the button element
    const addButton = document.querySelector('#addTraineeModal .btn-primary');
    const originalText = addButton.innerHTML;

    // Disable button and show loading state
    addButton.disabled = true;
    addButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Adding...';

    // Auto-generate trainee ID if not provided
    let id = document.getElementById('addTraineeId').value.trim();
    if (!id) {
        id = await generateTraineeId();
        document.getElementById('addTraineeId').value = id;
    }

    const firstName = document.getElementById('addTraineeFirstName').value.trim();
    const secondName = document.getElementById('addTraineeSecondName').value.trim();
    const middleName = document.getElementById('addTraineeMiddleName').value.trim();
    const lastName = document.getElementById('addTraineeLastName').value.trim();
    const suffix = document.getElementById('addTraineeSuffix').value.trim();
    const email = document.getElementById('addTraineeEmail').value.trim();
    const phone = document.getElementById('addTraineePhone').value.trim();
    const status = document.getElementById('addTraineeStatus').value;
    const password = document.getElementById('addTraineePassword').value;

    // Validate required fields
    if (!id || !firstName || !lastName || !email || !phone) {
        showError('Please fill in all required fields');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    // Validate trainee ID format (TRN-YYYY-XXX)
    const idPattern = /^TRN-\d{4}-\d{3}$/;
    if (!idPattern.test(id)) {
        showError('Invalid trainee ID format. Expected format: TRN-YYYY-XXX');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    // Validate name fields (only letters and spaces)
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(firstName)) {
        showError('First name should only contain letters and spaces');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }
    if (secondName && !namePattern.test(secondName)) {
        showError('Second name should only contain letters and spaces');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }
    if (middleName && !namePattern.test(middleName)) {
        showError('Middle name should only contain letters and spaces');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }
    if (!namePattern.test(lastName)) {
        showError('Last name should only contain letters and spaces');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    // Validate phone (only numbers)
    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(phone)) {
        showError('Mobile number should only contain numbers');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError('Please enter a valid email address');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    // Validate password length if provided
    if (password && password.length < 6) {
        showError('Password must be at least 6 characters long');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
        return;
    }

    const newTraineeData = {
        trainee_id: id,
        first_name: firstName,
        second_name: secondName,
        middle_name: middleName,
        last_name: lastName,
        suffix: suffix,
        email: email,
        phone: phone,
        status: status.toLowerCase()
    };

    // Only include password if provided
    if (password) {
        newTraineeData.password = password;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/trainees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTraineeData)
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);

            // Try to extract error message from HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const errorText = doc.body.textContent || text;

            showError('Server error: ' + errorText.substring(0, 200));
            addButton.disabled = false;
            addButton.innerHTML = originalText;
            return;
        }

        const result = await response.json();

        if (result.success) {
            showSuccess('Trainee added successfully');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addTraineeModal'));
            modal.hide();

            // Clear form
            document.getElementById('addTraineeForm').reset();

            // Reload trainees and statistics
            loadTrainees();
            loadStatistics();

            // Reset button state
            addButton.disabled = false;
            addButton.innerHTML = originalText;
        } else {
            showError(result.error || 'Failed to add trainee');
            addButton.disabled = false;
            addButton.innerHTML = originalText;
        }
    } catch (error) {
        console.error('Error adding trainee:', error);
        showError('Error connecting to server. Please check console for details.');
        addButton.disabled = false;
        addButton.innerHTML = originalText;
    }
}


// Toast notification function
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-alt' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="bx bx-x"></i>
        </button>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}


// Setup filter event listeners
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const resetButton = document.getElementById('resetFilters');

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

// Apply filters to trainee list
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const statusValue = document.getElementById('statusFilter').value.toLowerCase();

    let filteredTrainees = traineesData;

    // Apply search filter
    if (searchTerm) {
        filteredTrainees = filteredTrainees.filter(trainee => {
            // Build full name
            let fullName = trainee.first_name || '';
            if (trainee.second_name) fullName += ' ' + trainee.second_name;
            if (trainee.middle_name) fullName += ' ' + trainee.middle_name;
            fullName += ' ' + (trainee.last_name || '');
            if (trainee.suffix) fullName += ' ' + trainee.suffix;
            fullName = fullName.toLowerCase();

            const studentId = (trainee.trainee_id || '').toLowerCase();
            const email = (trainee.email || '').toLowerCase();

            return fullName.includes(searchTerm) ||
                studentId.includes(searchTerm) ||
                email.includes(searchTerm);
        });
    }

    // Apply status filter
    if (statusValue) {
        filteredTrainees = filteredTrainees.filter(trainee => {
            return (trainee.status || 'pending').toLowerCase() === statusValue;
        });
    }

    // Render filtered results
    renderTrainees(filteredTrainees);
}

// Reset all filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    renderTrainees(traineesData);
}
