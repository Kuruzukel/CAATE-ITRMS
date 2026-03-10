/* Accounts Page Script - Updated Avatar Styling */

// API Configuration - Works for both localhost and network access
const API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public/api/v1';

// Authentication check
function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (!token || !userRole || !userId) {
        window.location.href = '../../../auth/src/pages/login.html';
        return false;
    }

    if (userRole !== 'admin') {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'trainee') {
            window.location.href = baseUrl + '/trainee/src/pages/dashboard.html';
        } else {
            window.location.href = baseUrl + '/auth/src/pages/login.html';
        }
        return false;
    }

    return true;
}

// Load admin profile data for navbar dropdown
async function loadAdminProfileForNavbar() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        // Fetch admin data from the admins collection
        const response = await fetch(`${config.api.baseURL}/api/v1/admins/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            let adminData = result.data || result.admin || result;

            // Update navbar user info
            updateNavbarUserInfo(adminData);
        } else {
            console.error('Failed to fetch admin data:', response.status);
        }
    } catch (error) {
        console.error('Error loading admin profile:', error);
    }
}

// Update navbar user info
function updateNavbarUserInfo(data) {
    const userName = document.querySelector('.dropdown-menu .flex-grow-1 .fw-semibold');
    if (userName) {
        // Use name field from database first
        let displayName = data.name || 'Admin';
        userName.textContent = displayName;
    }

    // Update profile images if they exist
    const profileImages = document.querySelectorAll('.avatar img');
    profileImages.forEach(img => {
        if (data.profileImage && data.profileImage !== '../assets/images/DEFAULT_AVATAR.png') {
            img.src = data.profileImage;
        } else {
            img.src = '../assets/images/DEFAULT_AVATAR.png';
        }
        img.onerror = function () {
            this.src = '../assets/images/DEFAULT_AVATAR.png';
        };
    });
}

// State
let traineesData = [];

// Authentication check and navbar update
function checkAuthenticationAndUpdateNavbar() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (!token || !userRole || !userId) {
        window.location.href = '../../../auth/src/pages/login.html';
        return false;
    }

    if (userRole !== 'admin') {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'trainee') {
            window.location.href = baseUrl + '/trainee/src/pages/dashboard.html';
        } else {
            window.location.href = baseUrl + '/auth/src/pages/login.html';
        }
        return false;
    }

    // Load admin profile data for navbar
    loadAdminProfileForNavbar();
    return true;
}

// Load admin profile data for navbar
async function loadAdminProfileForNavbar() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            return;
        }

        // Try to get cached data first
        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
            try {
                const userData = JSON.parse(cachedData);
                updateNavbarUserInfo(userData);
            } catch (e) {
                console.warn('Failed to parse cached user data');
            }
        }

        // Fetch fresh data from API
        const response = await fetch(`${config.api.baseURL}/api/v1/admins/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            let adminData = result.data || result.admin || result;

            const mappedData = {
                _id: adminData._id,
                name: adminData.name,
                email: adminData.email,
                username: adminData.username,
                role: adminData.role,
                firstName: adminData.firstName,
                middleName: adminData.middleName,
                lastName: adminData.lastName,
                phone: adminData.phone,
                phoneNumber: adminData.phone,
                address: adminData.address,
                profileImage: adminData.profileImage || '../assets/images/DEFAULT_AVATAR.png'
            };

            // Update navbar user info
            updateNavbarUserInfo(mappedData);

            // Update cached data
            localStorage.setItem('userData', JSON.stringify(mappedData));
        }
    } catch (error) {
        console.error('Error loading admin profile for navbar:', error);
    }
}

// Update navbar user info
function updateNavbarUserInfo(data) {
    // Update user name in dropdown
    const userName = document.querySelector('.dropdown-menu .flex-grow-1 .fw-semibold');
    if (userName) {
        let displayName = data.name || 'Admin';
        userName.textContent = displayName;
    }

    // Update profile images in navbar
    const navbarImages = document.querySelectorAll('.navbar .avatar img');
    navbarImages.forEach(img => {
        if (data.profileImage && data.profileImage !== '../assets/images/DEFAULT_AVATAR.png') {
            img.src = data.profileImage;
        } else {
            img.src = '../assets/images/DEFAULT_AVATAR.png';
        }
        img.onerror = function () {
            this.src = '../assets/images/DEFAULT_AVATAR.png';
        };
    });
}

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
    // Check authentication and update navbar
    if (!checkAuthenticationAndUpdateNavbar()) {
        return;
    }

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

            // Reset the form
            const form = document.getElementById('addTraineeForm');
            if (form) {
                form.reset();
            }

            // Clear the trainee ID field
            const traineeIdInput = document.getElementById('addTraineeId');
            if (traineeIdInput) {
                traineeIdInput.value = '';
            }
        });

        // Generate trainee ID when modal is shown
        addTraineeModal.addEventListener('show.bs.modal', async function () {
            const traineeIdInput = document.getElementById('addTraineeId');
            if (traineeIdInput) {
                // Show loading state
                traineeIdInput.value = 'Generating...';

                // Generate and set the new trainee ID
                const newId = await generateTraineeId();
                traineeIdInput.value = newId;
            }
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


// Show loader in table
function showTableLoader() {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center" style="padding: 60px 20px;">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading trainees data...</p>
            </td>
        </tr>
    `;
}

// Load trainees from API
async function loadTrainees() {
    // Show loader before fetching data
    showTableLoader();

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

        if (!response.ok) {
            return;
        }

        const result = await response.json();

        if (result.success) {
            updateStatistics(result.data);
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Helper function to clear all row highlights
function clearAllHighlights() {
    const tbody = document.querySelector('.table tbody');
    if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            row.style.boxShadow = '';
            row.style.border = '';
            row.style.borderLeft = '';
            row.style.borderRadius = '';
            row.style.background = '';
            row.style.transition = '';
            row.style.transform = '';
            row.style.outline = '';
            row.style.outlineOffset = '';
            row.style.zIndex = '';
        });
    }
}

// Render trainees table
function renderTrainees(trainees) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    // Hide loader
    const loader = document.getElementById('tableLoader');
    if (loader) {
        loader.remove();
    }

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

    // Build full name with all name parts - only if first_name or last_name exists
    let fullName = '';
    let hasName = false;

    if (trainee.first_name || trainee.last_name) {
        hasName = true;
        fullName = trainee.first_name || '';
        if (trainee.second_name) {
            fullName += (fullName ? ' ' : '') + trainee.second_name;
        }
        if (trainee.middle_name) {
            fullName += (fullName ? ' ' : '') + trainee.middle_name;
        }
        if (trainee.last_name) {
            fullName += (fullName ? ' ' : '') + trainee.last_name;
        }
        if (trainee.suffix) {
            fullName += (fullName ? ' ' : '') + trainee.suffix;
        }
        fullName = fullName.trim();
    }

    // Safely get initials with fallback
    const firstInitial = (trainee.first_name && trainee.first_name.charAt(0)) || (trainee.username && trainee.username.charAt(0)) || '?';
    const lastInitial = (trainee.last_name && trainee.last_name.charAt(0)) || (trainee.username && trainee.username.charAt(1)) || '?';
    const initials = `${firstInitial}${lastInitial}`;
    // Display trainee ID or show format example
    const displayId = trainee.trainee_id || `TRN-${new Date().getFullYear()}-${String(index + 1).padStart(3, '0')}`;

    // Display username or show N/A
    const displayUsername = trainee.username || '<span class="text-muted">N/A</span>';

    // Display name or show N/A if no name exists
    const displayName = hasName ? fullName : '<span class="text-muted">N/A</span>';

    tr.innerHTML = `
        <td><strong>${displayId}</strong></td>
        <td>${displayUsername}</td>
        <td>
            <div class="d-flex align-items-center">
                <div class="avatar avatar-sm me-3" style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); backdrop-filter: blur(10px) saturate(180%); -webkit-backdrop-filter: blur(10px) saturate(180%); border: 1px solid rgba(54, 145, 191, 0.4); box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 38px; height: 38px; font-weight: 600;">
                    ${initials}
                </div>
                <div>
                    <strong>${displayName}</strong>
                </div>
            </div>
        </td>
        <td>${trainee.email}</td>
        <td>${trainee.phone || '<span class="text-muted">N/A</span>'}</td>
        <td>
            <div class="dropdown">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="javascript:void(0);" onclick="viewTrainee('${trainee._id}')">
                        <i class="bx bx-show me-1"></i> View Details
                    </a>
                    <a class="dropdown-item" href="javascript:void(0);" onclick="editTrainee('${trainee._id}')">
                        <i class="bx bx-edit-alt me-1"></i> Edit Details
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
        const totalValue = stats.total || 0;
        totalElement.textContent = totalValue.toLocaleString();
    }

    // Update Total Enrollment
    const enrollmentElement = document.getElementById('totalEnrollmentCount');
    if (enrollmentElement) {
        const enrollmentValue = stats.totalEnrollment || 0;
        enrollmentElement.textContent = enrollmentValue.toLocaleString();
    }

    // Update Total Application
    const applicationElement = document.getElementById('totalApplicationCount');
    if (applicationElement) {
        const applicationValue = stats.totalApplication || 0;
        applicationElement.textContent = applicationValue.toLocaleString();
    }

    // Update Total Admission
    const admissionElement = document.getElementById('totalAdmissionCount');
    if (admissionElement) {
        const admissionValue = stats.totalAdmission || 0;
        admissionElement.textContent = admissionValue.toLocaleString();
    }
}

// View trainee details
window.viewTrainee = function viewTrainee(id) {
    // Convert id to string if it's an object
    const traineeId = String(id);

    const trainee = traineesData.find(t => String(t._id) === traineeId || String(t.id) === traineeId);
    if (!trainee) {
        console.error('Trainee not found with id:', traineeId);
        showError('Trainee not found. Please refresh the page and try again.');
        return;
    }

    // Populate view modal with separate name fields
    document.getElementById('viewTraineeId').value = trainee.trainee_id || trainee._id || '';
    document.getElementById('viewTraineeFirstName').value = trainee.first_name || '';
    document.getElementById('viewTraineeSecondName').value = trainee.second_name || '';
    document.getElementById('viewTraineeMiddleName').value = trainee.middle_name || '';
    document.getElementById('viewTraineeLastName').value = trainee.last_name || '';
    document.getElementById('viewTraineeSuffix').value = trainee.suffix || '';
    document.getElementById('viewTraineeEmail').value = trainee.email || '';
    document.getElementById('viewTraineeUsername').value = trainee.username || '';
    document.getElementById('viewTraineePhone').value = trainee.phone || '';

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
window.editTrainee = function editTrainee(id) {
    // Convert id to string if it's an object
    const traineeId = String(id);

    const trainee = traineesData.find(t => String(t._id) === traineeId || String(t.id) === traineeId);
    if (!trainee) {
        console.error('Trainee not found with id:', traineeId);
        showError('Trainee not found. Please refresh the page and try again.');
        return;
    }

    // Store original trainee data for change detection
    window.originalTraineeData = {
        trainee_id: trainee.trainee_id || '',
        first_name: trainee.first_name || '',
        second_name: trainee.second_name || '',
        middle_name: trainee.middle_name || '',
        last_name: trainee.last_name || '',
        suffix: trainee.suffix || '',
        email: trainee.email || '',
        username: trainee.username || '',
        phone: trainee.phone || ''
    };

    // Populate edit modal with separate name fields
    document.getElementById('editTraineeId').value = trainee.trainee_id || '';
    document.getElementById('editTraineeFirstName').value = trainee.first_name || '';
    document.getElementById('editTraineeSecondName').value = trainee.second_name || '';
    document.getElementById('editTraineeMiddleName').value = trainee.middle_name || '';
    document.getElementById('editTraineeLastName').value = trainee.last_name || '';
    document.getElementById('editTraineeSuffix').value = trainee.suffix || '';
    document.getElementById('editTraineeEmail').value = trainee.email;
    document.getElementById('editTraineeUsername').value = trainee.username || '';
    document.getElementById('editTraineePhone').value = trainee.phone;
    document.getElementById('editTraineePassword').value = ''; // Clear password field

    // Store the MongoDB _id in a hidden field or data attribute
    document.getElementById('editTraineeForm').setAttribute('data-trainee-id', trainee._id);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editTraineeModal'));
    modal.show();
}

// Delete trainee
window.deleteTrainee = async function deleteTrainee(id) {
    // Convert id to string if it's an object
    const traineeId = String(id);

    const trainee = traineesData.find(t => String(t._id) === traineeId || String(t.id) === traineeId);
    if (!trainee) {
        console.error('Trainee not found with id:', traineeId);
        showError('Trainee not found. Please refresh the page and try again.');
        return;
    }

    // Populate delete modal with trainee info
    document.getElementById('deleteTraineeName').textContent = `${trainee.first_name} ${trainee.last_name}`;
    document.getElementById('deleteTraineeId').value = traineeId;

    // Show the Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById('deleteTraineeModal'));
    modal.show();
}

// Confirm delete trainee
window.confirmDeleteTrainee = async function confirmDeleteTrainee() {
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
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
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
window.saveEditTrainee = async function saveEditTrainee() {
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
    const username = document.getElementById('editTraineeUsername').value.trim();
    const phone = document.getElementById('editTraineePhone').value.trim();
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
            username !== window.originalTraineeData.username ||
            phone !== window.originalTraineeData.phone ||
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
        window.originalTraineeData.username !== username ||
        window.originalTraineeData.phone !== phone ||
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
        username: username,
        phone: phone
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

            // Update the trainee in local data
            const traineeIndex = traineesData.findIndex(t => String(t._id) === mongoId);
            if (traineeIndex !== -1) {
                // Update the trainee object with new data
                traineesData[traineeIndex] = {
                    ...traineesData[traineeIndex],
                    ...updateData,
                    _id: mongoId
                };

                // Update only the specific row in the table
                const tbody = document.querySelector('.table tbody');
                if (tbody) {
                    const rows = tbody.querySelectorAll('tr');
                    if (rows[traineeIndex]) {
                        const updatedRow = createTraineeRow(traineesData[traineeIndex], traineeIndex + 1);
                        rows[traineeIndex].replaceWith(updatedRow);
                    }
                }
            }

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editTraineeModal'));
            modal.hide();

            // Reload statistics only
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
            console.log('Total trainees found:', trainees.length);

            // Find the highest trainee number across all years
            let maxNumber = 0;
            const traineePattern = /^TRN-\d{4}-(\d+)$/;

            trainees.forEach(trainee => {
                if (trainee.trainee_id) {
                    const match = trainee.trainee_id.match(traineePattern);
                    if (match) {
                        const num = parseInt(match[1], 10);
                        console.log(`Found trainee ID: ${trainee.trainee_id}, number: ${num}`);
                        if (num > maxNumber) {
                            maxNumber = num;
                        }
                    }
                }
            });

            console.log('Highest number found:', maxNumber);

            // Generate next sequential number based on total count
            const nextNumber = maxNumber + 1;
            const paddedNumber = String(nextNumber).padStart(3, '0');
            const newId = `TRN-${currentYear}-${paddedNumber}`;

            console.log('Generated new trainee ID:', newId);
            return newId;
        } else {
            // If API fails, start with 001
            console.log('API call failed, using default ID');
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
window.saveNewTrainee = async function saveNewTrainee() {
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

    const username = document.getElementById('addTraineeUsername').value.trim();
    const firstName = document.getElementById('addTraineeFirstName').value.trim();
    const secondName = document.getElementById('addTraineeSecondName').value.trim();
    const middleName = document.getElementById('addTraineeMiddleName').value.trim();
    const lastName = document.getElementById('addTraineeLastName').value.trim();
    const suffix = document.getElementById('addTraineeSuffix').value.trim();
    const email = document.getElementById('addTraineeEmail').value.trim();
    const phone = document.getElementById('addTraineePhone').value.trim();
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
        phone: phone
    };

    // Only include username if provided
    if (username) {
        newTraineeData.username = username;
    }

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
    const enrollmentFilter = document.getElementById('enrollmentFilter');
    const applicationFilter = document.getElementById('applicationFilter');
    const admissionFilter = document.getElementById('admissionFilter');
    const resetButton = document.getElementById('resetFilters');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            // Auto-reset when search input is cleared
            if (searchInput.value.trim() === '') {
                resetFilters();
            } else {
                applyFilters();
            }
        });
    }

    if (enrollmentFilter) {
        enrollmentFilter.addEventListener('change', applyFilters);
    }

    if (applicationFilter) {
        applicationFilter.addEventListener('change', applyFilters);
    }

    if (admissionFilter) {
        admissionFilter.addEventListener('change', applyFilters);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

// Apply filters to trainee list
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const enrollmentYear = document.getElementById('enrollmentFilter')?.value || '';
    const applicationYear = document.getElementById('applicationFilter')?.value || '';
    const admissionYear = document.getElementById('admissionFilter')?.value || '';

    // If search is cleared and no year filters, clear highlights and show all
    if (!searchTerm && !enrollmentYear && !applicationYear && !admissionYear) {
        clearAllHighlights();
        renderTrainees(traineesData);
        return;
    }

    // If only search term is provided (no year filters), highlight instead of filter
    if (searchTerm && !enrollmentYear && !applicationYear && !admissionYear) {
        // Show all trainees but highlight matches
        renderTrainees(traineesData);
        // Wait for render to complete, then highlight
        setTimeout(() => {
            clearAllHighlights();
            highlightSearchResults(searchTerm);
        }, 50);
        return;
    }

    // Otherwise, apply normal filtering for year filters
    let filteredTrainees = traineesData;

    // Apply search filter only when year filters are active
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

    // Apply enrollment year filter
    if (enrollmentYear) {
        filteredTrainees = filteredTrainees.filter(trainee => {
            return trainee.enrollments && trainee.enrollments.some(e =>
                e.year === enrollmentYear || (e.date && new Date(e.date).getFullYear().toString() === enrollmentYear)
            );
        });
    }

    // Apply application year filter
    if (applicationYear) {
        filteredTrainees = filteredTrainees.filter(trainee => {
            return trainee.applications && trainee.applications.some(a =>
                a.year === applicationYear || (a.date && new Date(a.date).getFullYear().toString() === applicationYear)
            );
        });
    }

    // Apply admission year filter
    if (admissionYear) {
        filteredTrainees = filteredTrainees.filter(trainee => {
            return trainee.admissions && trainee.admissions.some(a =>
                a.year === admissionYear || (a.date && new Date(a.date).getFullYear().toString() === admissionYear)
            );
        });
    }

    // Render filtered results
    renderTrainees(filteredTrainees);
}

// Highlight search results without hiding other rows
function highlightSearchResults(searchTerm) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    let firstMatch = null;

    rows.forEach(row => {
        // Remove any existing highlight
        row.style.boxShadow = '';
        row.style.border = '';
        row.style.borderLeft = '';
        row.style.borderRadius = '';
        row.style.background = '';
        row.style.transition = '';
        row.style.transform = '';
        row.style.outline = '';
        row.style.outlineOffset = '';
        row.style.zIndex = '';

        // Get row text content
        const rowText = row.textContent.toLowerCase();

        // Check if row matches search term
        if (rowText.includes(searchTerm)) {
            // Apply card hover design with proper spacing
            row.style.position = 'relative';
            row.style.boxShadow = '0 8px 24px rgba(22, 56, 86, 0.5), 0 4px 12px rgba(54, 145, 191, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
            row.style.outline = '2px solid rgba(54, 145, 191, 0.6)';
            row.style.outlineOffset = '2px';
            row.style.borderRadius = '10px';
            row.style.background = 'linear-gradient(135deg, rgba(54, 145, 191, 0.08) 0%, rgba(50, 85, 150, 0.08) 100%)';
            row.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            row.style.zIndex = '10';

            // Store first match for scrolling
            if (!firstMatch) {
                firstMatch = row;
            }
        }
    });

    // Scroll to first match
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Reset all filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    const enrollmentFilter = document.getElementById('enrollmentFilter');
    const applicationFilter = document.getElementById('applicationFilter');
    const admissionFilter = document.getElementById('admissionFilter');

    if (enrollmentFilter) enrollmentFilter.value = '';
    if (applicationFilter) applicationFilter.value = '';
    if (admissionFilter) admissionFilter.value = '';

    // Clear all highlights using helper function
    clearAllHighlights();

    renderTrainees(traineesData);
}

// ==================== BULK UPLOAD & EXPORT FUNCTIONALITY ====================

// Bulk Upload Button Event Listener
document.addEventListener('DOMContentLoaded', function () {
    const bulkUploadBtn = document.getElementById('bulkUploadBtn');
    const bulkUploadModal = new bootstrap.Modal(document.getElementById('bulkUploadModal'));
    const bulkUploadFile = document.getElementById('bulkUploadFile');
    const confirmBulkUpload = document.getElementById('confirmBulkUpload');
    const uploadPreview = document.getElementById('uploadPreview');
    const uploadPreviewBody = document.getElementById('uploadPreviewBody');
    const uploadRecordCount = document.getElementById('uploadRecordCount');

    let uploadedData = [];

    // Open bulk upload modal
    if (bulkUploadBtn) {
        bulkUploadBtn.addEventListener('click', function () {
            bulkUploadModal.show();
        });
    }

    // Handle file selection
    if (bulkUploadFile) {
        bulkUploadFile.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (fileExtension === 'csv') {
                parseCSVFile(file);
            } else if (fileExtension === 'json') {
                parseJSONFile(file);
            } else {
                showToast('Invalid file format. Please upload CSV or JSON file.', 'error');
            }
        });
    }

    // Parse CSV file
    function parseCSVFile(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const text = e.target.result;
                const lines = text.split('\n').filter(line => line.trim());

                if (lines.length < 2) {
                    showToast('CSV file is empty or invalid.', 'error');
                    resetBulkUploadForm();
                    return;
                }

                // Parse header
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                // Required fields for CSV (trainee_id is optional, will be auto-generated)
                const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
                const validFields = ['trainee_id', 'username', 'first_name', 'second_name', 'middle_name', 'last_name', 'suffix', 'email', 'phone', 'password'];

                // Check if all required fields are present
                const missingFields = requiredFields.filter(field => !headers.includes(field));
                if (missingFields.length > 0) {
                    showToast(`CSV file is missing required fields: ${missingFields.join(', ')}. Expected format: trainee_id, username, first_name, second_name, middle_name, last_name, suffix, email, phone, password`, 'error');
                    resetBulkUploadForm();
                    return;
                }

                // Check if there are any invalid fields
                const invalidFields = headers.filter(header => !validFields.includes(header));
                if (invalidFields.length > 0) {
                    showToast(`CSV file contains invalid fields: ${invalidFields.join(', ')}. Valid fields are: ${validFields.join(', ')}`, 'error');
                    resetBulkUploadForm();
                    return;
                }

                // Parse data rows
                uploadedData = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    const trainee = {};

                    headers.forEach((header, index) => {
                        trainee[header] = values[index] || '';
                    });

                    // Validate required fields in each row (trainee_id is optional)
                    const rowMissingFields = requiredFields.filter(field => !trainee[field] || trainee[field].trim() === '');
                    if (rowMissingFields.length > 0) {
                        showToast(`Row ${i + 1} is missing required fields: ${rowMissingFields.join(', ')}`, 'error');
                        resetBulkUploadForm();
                        return;
                    }

                    uploadedData.push(trainee);
                }

                displayUploadPreview();
            } catch (error) {
                showToast('Error parsing CSV file. Please check the file format.', 'error');
                resetBulkUploadForm();
            }
        };
        reader.readAsText(file);
    }

    // Parse JSON file
    function parseJSONFile(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);

                if (!Array.isArray(data)) {
                    showToast('JSON file must contain an array of trainee objects.', 'error');
                    resetBulkUploadForm();
                    return;
                }

                if (data.length === 0) {
                    showToast('JSON file is empty.', 'error');
                    resetBulkUploadForm();
                    return;
                }

                // Required fields for JSON (trainee_id is optional, will be auto-generated)
                const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
                const validFields = ['trainee_id', 'username', 'first_name', 'second_name', 'middle_name', 'last_name', 'suffix', 'email', 'phone', 'password'];

                // Validate each object in the array
                for (let i = 0; i < data.length; i++) {
                    const trainee = data[i];

                    // Check if it's an object
                    if (typeof trainee !== 'object' || trainee === null) {
                        showToast(`Item ${i + 1} in JSON file is not a valid object.`, 'error');
                        resetBulkUploadForm();
                        return;
                    }

                    // Check for required fields
                    const missingFields = requiredFields.filter(field => !trainee[field] || trainee[field].toString().trim() === '');
                    if (missingFields.length > 0) {
                        showToast(`Item ${i + 1} is missing required fields: ${missingFields.join(', ')}. Expected format: Array of objects with fields: trainee_id, username, first_name, second_name, middle_name, last_name, suffix, email, phone, password`, 'error');
                        resetBulkUploadForm();
                        return;
                    }

                    // Check for invalid fields
                    const objectFields = Object.keys(trainee);
                    const invalidFields = objectFields.filter(field => !validFields.includes(field));
                    if (invalidFields.length > 0) {
                        showToast(`Item ${i + 1} contains invalid fields: ${invalidFields.join(', ')}. Valid fields are: ${validFields.join(', ')}`, 'error');
                        resetBulkUploadForm();
                        return;
                    }
                }

                uploadedData = data;
                displayUploadPreview();
            } catch (error) {
                showToast('Error parsing JSON file. Please check the file format and ensure it contains valid JSON.', 'error');
                resetBulkUploadForm();
            }
        };
        reader.readAsText(file);
    }

    // Display upload preview
    function displayUploadPreview() {
        if (uploadedData.length === 0) {
            uploadPreview.style.display = 'none';
            confirmBulkUpload.disabled = true;
            return;
        }

        uploadPreviewBody.innerHTML = '';

        // Get current year for trainee ID format
        const currentYear = new Date().getFullYear();

        uploadedData.forEach((trainee, index) => {
            const fullName = [
                trainee.first_name,
                trainee.second_name,
                trainee.middle_name,
                trainee.last_name,
                trainee.suffix
            ].filter(Boolean).join(' ');

            // Generate preview trainee ID in format TRN-YYYY-XXX
            const previewId = trainee.trainee_id || `TRN-${currentYear}-${String(index + 1).padStart(3, '0')}`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${previewId}</td>
                <td>${fullName || 'N/A'}</td>
                <td>${trainee.email || 'N/A'}</td>
                <td>${trainee.phone || 'N/A'}</td>
            `;
            uploadPreviewBody.appendChild(row);
        });

        uploadRecordCount.textContent = uploadedData.length;
        uploadPreview.style.display = 'block';
        confirmBulkUpload.disabled = false;
    }

    // Confirm bulk upload
    if (confirmBulkUpload) {
        confirmBulkUpload.addEventListener('click', async function () {
            if (uploadedData.length === 0) return;

            confirmBulkUpload.disabled = true;
            confirmBulkUpload.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Uploading...';

            try {
                let successCount = 0;
                let errorCount = 0;

                for (const trainee of uploadedData) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/trainees`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(trainee)
                        });

                        if (response.ok) {
                            successCount++;
                        } else {
                            errorCount++;
                        }
                    } catch (error) {
                        errorCount++;
                    }
                }

                if (successCount > 0) {
                    showToast(`Successfully uploaded ${successCount} trainee(s).`, 'success');
                    loadTrainees();
                    loadStatistics();
                }

                if (errorCount > 0) {
                    showToast(`Failed to upload ${errorCount} trainee(s).`, 'warning');
                }

                bulkUploadModal.hide();
                resetBulkUploadForm();
            } catch (error) {
                console.error('Error during bulk upload:', error);
                showToast('Error during bulk upload.', 'error');
            } finally {
                confirmBulkUpload.disabled = false;
                confirmBulkUpload.innerHTML = '<i class="bx bx-upload"></i> Upload Trainees';
            }
        });
    }

    // Reset bulk upload form
    function resetBulkUploadForm() {
        bulkUploadFile.value = '';
        uploadedData = [];
        uploadPreview.style.display = 'none';
        confirmBulkUpload.disabled = true;
    }

    // Export to CSV
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', async function () {
            // Disable button and show loading state
            exportCsvBtn.disabled = true;
            const originalText = exportCsvBtn.innerHTML;
            exportCsvBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Fetching data...';

            try {
                // Fetch all trainees from API
                const response = await fetch(`${API_BASE_URL}/trainees`);

                if (!response.ok) {
                    throw new Error('Failed to fetch trainees data');
                }

                const data = await response.json();
                const allTrainees = data.data || [];

                if (allTrainees.length === 0) {
                    showToast('No data to export.', 'warning');
                    return;
                }

                // Prepare CSV content
                const headers = ['trainee_id', 'username', 'first_name', 'second_name', 'middle_name', 'last_name', 'suffix', 'email', 'phone'];
                const csvContent = [
                    headers.join(','),
                    ...allTrainees.map(trainee =>
                        headers.map(header => {
                            const value = trainee[header] || '';
                            // Escape commas and quotes in values
                            const stringValue = value.toString();
                            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                                return `"${stringValue.replace(/"/g, '""')}"`;
                            }
                            return stringValue;
                        }).join(',')
                    )
                ].join('\n');

                // Generate filename with timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const filename = `trainees_export_${timestamp}.csv`;

                downloadFile(csvContent, filename, 'text/csv');
                showToast(`Successfully exported ${allTrainees.length} trainee(s) to CSV.`, 'success');
            } catch (error) {
                console.error('Error exporting CSV:', error);
                showToast('Error exporting data. Please try again.', 'error');
            } finally {
                // Re-enable button
                exportCsvBtn.disabled = false;
                exportCsvBtn.innerHTML = originalText;
            }
        });
    }

    // Export to JSON
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', async function () {
            // Disable button and show loading state
            exportJsonBtn.disabled = true;
            const originalText = exportJsonBtn.innerHTML;
            exportJsonBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Fetching data...';

            try {
                // Fetch all trainees from API
                const response = await fetch(`${API_BASE_URL}/trainees`);

                if (!response.ok) {
                    throw new Error('Failed to fetch trainees data');
                }

                const data = await response.json();
                const allTrainees = data.data || [];

                if (allTrainees.length === 0) {
                    showToast('No data to export.', 'warning');
                    return;
                }

                // Prepare JSON content with proper formatting
                const jsonContent = JSON.stringify(allTrainees, null, 2);

                // Generate filename with timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const filename = `trainees_export_${timestamp}.json`;

                downloadFile(jsonContent, filename, 'application/json');
                showToast(`Successfully exported ${allTrainees.length} trainee(s) to JSON.`, 'success');
            } catch (error) {
                console.error('Error exporting JSON:', error);
                showToast('Error exporting data. Please try again.', 'error');
            } finally {
                // Re-enable button
                exportJsonBtn.disabled = false;
                exportJsonBtn.innerHTML = originalText;
            }
        });
    }

    // Download file helper function
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
});
