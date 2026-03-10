/* Manage Profile Page Script - Admin */

// API Configuration
const API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public';

// Authentication check
function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    console.log('Auth check - Admin Page:', { token: !!token, userRole, userId });

    if (!token || !userRole || !userId) {
        console.log('Missing authentication data, redirecting to login');
        window.location.href = '../../../auth/src/pages/login.html';
        return false;
    }

    if (userRole !== 'admin') {
        console.log('User role is not admin:', userRole);
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'trainee') {
            window.location.href = baseUrl + '/trainee/src/pages/dashboard.html';
        } else {
            window.location.href = baseUrl + '/auth/src/pages/login.html';
        }
        return false;
    }

    console.log('Authentication passed for admin user');
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    // Check authentication first
    if (!checkAuthentication()) {
        return;
    }

    initializePhotoUpload();
    loadAdminProfile();
    initializeEditForm();
});

// Load admin profile data from database
async function loadAdminProfile() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole');
        const userData = localStorage.getItem('userData');

        console.log('Debug - localStorage data:', {
            token: token ? 'exists' : 'missing',
            userId: userId,
            userRole: userRole,
            userData: userData ? 'exists' : 'missing'
        });

        if (!token) {
            console.log('No auth token found, redirecting to login');
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        if (!userRole || userRole !== 'admin') {
            console.log('Invalid user role:', userRole);
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        // If userId is not available, try to get it from userData
        let actualUserId = userId;
        if (!actualUserId && userData) {
            try {
                const parsedUserData = JSON.parse(userData);
                actualUserId = parsedUserData.id || parsedUserData._id;
                if (actualUserId) {
                    localStorage.setItem('userId', actualUserId);
                }
            } catch (e) {
                console.error('Error parsing userData:', e);
            }
        }

        if (!actualUserId) {
            console.log('No user ID found, redirecting to login');
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        console.log('Fetching admin profile for userId:', actualUserId);

        const response = await fetch(`${API_BASE_URL}/api/v1/admins/${actualUserId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.log('Unauthorized, redirecting to login');
                localStorage.clear();
                window.location.href = '../../../auth/src/pages/login.html';
                return;
            }
            throw new Error(`HTTP ${response.status}: Failed to fetch admin profile`);
        }

        const result = await response.json();
        const adminData = result.data;

        console.log('Admin profile loaded successfully:', adminData);

        // Update profile overview
        updateProfileOverview(adminData);

        // Update personal information
        updatePersonalInformation(adminData);

        // Update login history if available
        if (adminData.loginHistory) {
            updateLoginHistory(adminData.loginHistory);
        }

    } catch (error) {
        console.error('Error loading admin profile:', error);
        showNotification('Failed to load profile data: ' + error.message, 'error');
    }
}

// Update profile overview section
function updateProfileOverview(data) {
    // Full name
    const fullNameElement = document.querySelector('.col-lg-8 .row:nth-child(1) .col-md-6:nth-child(1) .form-control-plaintext');
    if (fullNameElement) {
        fullNameElement.textContent = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'N/A';
    }

    // Role badge
    const roleBadge = document.querySelector('.col-lg-8 .row:nth-child(1) .col-md-6:nth-child(2) .badge');
    if (roleBadge) {
        roleBadge.textContent = 'Administrator';
        roleBadge.className = 'badge bg-primary';
    }

    // Email
    const emailElement = document.querySelector('.col-lg-8 .row:nth-child(2) .col-md-6:nth-child(1) .form-control-plaintext');
    if (emailElement) {
        emailElement.textContent = data.email || 'N/A';
    }

    // Account status
    const statusBadge = document.querySelector('.col-lg-8 .row:nth-child(2) .col-md-6:nth-child(2) .badge');
    if (statusBadge) {
        const status = data.status || 'active';
        statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusBadge.className = status === 'active' ? 'badge bg-success' : 'badge bg-danger';
    }

    // Last login
    const lastLoginElement = document.querySelector('.col-lg-8 .row:nth-child(3) .col-md-6:nth-child(1) .form-control-plaintext');
    if (lastLoginElement && data.lastLogin) {
        lastLoginElement.textContent = formatDateTime(data.lastLogin);
    }

    // Last logout
    const lastLogoutElement = document.querySelector('.col-lg-8 .row:nth-child(3) .col-md-6:nth-child(2) .form-control-plaintext');
    if (lastLogoutElement && data.lastLogout) {
        lastLogoutElement.textContent = formatDateTime(data.lastLogout);
    }

    // Profile image
    const profileImage = document.getElementById('profileImage');
    if (profileImage && data.profileImage) {
        profileImage.src = data.profileImage;
    }

    // Update navbar user info
    updateNavbarUserInfo(data);
}

// Update personal information section
function updatePersonalInformation(data) {
    // First name
    const firstNameInput = document.querySelector('.card-body .row:nth-child(1) .col-md-6:nth-child(1) input');
    if (firstNameInput) {
        firstNameInput.value = data.firstName || '';
    }

    // Last name
    const lastNameInput = document.querySelector('.card-body .row:nth-child(1) .col-md-6:nth-child(2) input');
    if (lastNameInput) {
        lastNameInput.value = data.lastName || '';
    }

    // Phone number
    const phoneInput = document.querySelector('.card-body .row:nth-child(2) .col-md-6:nth-child(1) input');
    if (phoneInput) {
        phoneInput.value = data.phoneNumber || '';
    }

    // Department
    const departmentInput = document.querySelector('.card-body .row:nth-child(2) .col-md-6:nth-child(2) input');
    if (departmentInput) {
        departmentInput.value = data.department || 'Administration';
    }

    // Address
    const addressTextarea = document.querySelector('.card-body .row:nth-child(3) textarea');
    if (addressTextarea) {
        addressTextarea.value = data.address || '';
    }

    // Update edit modal fields
    document.getElementById('editFirstName').value = data.firstName || '';
    document.getElementById('editLastName').value = data.lastName || '';
    document.getElementById('editPhone').value = data.phoneNumber || '';
    document.getElementById('editDepartment').value = data.department || 'Administration';
    document.getElementById('editAddress').value = data.address || '';
}

// Update login history table
function updateLoginHistory(loginHistory) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody || !Array.isArray(loginHistory) || loginHistory.length === 0) return;

    tbody.innerHTML = '';

    loginHistory.slice(0, 5).forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${formatDateTime(entry.timestamp)}</strong></td>
            <td><span class="badge ${entry.action === 'login' ? 'bg-success' : 'bg-danger'}">${entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}</span></td>
            <td>${entry.ipAddress || 'N/A'}</td>
            <td>${entry.device || 'N/A'}</td>
            <td><span class="badge ${entry.status === 'success' ? 'bg-success' : 'bg-danger'}">${entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Update navbar user info
function updateNavbarUserInfo(data) {
    const userName = document.querySelector('.dropdown-menu .flex-grow-1 .fw-semibold');
    if (userName) {
        userName.textContent = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Admin';
    }
}

// Initialize edit form
function initializeEditForm() {
    const saveButton = document.querySelector('#editInformationModal .btn-primary');
    if (!saveButton) return;

    saveButton.addEventListener('click', async function () {
        await saveProfileChanges();
    });
}

// Save profile changes
async function saveProfileChanges() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        const updatedData = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            phoneNumber: document.getElementById('editPhone').value,
            department: document.getElementById('editDepartment').value,
            address: document.getElementById('editAddress').value
        };

        const response = await fetch(`${API_BASE_URL}/api/v1/admins/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editInformationModal'));
        modal.hide();

        // Reload profile data
        await loadAdminProfile();

        showNotification('Profile updated successfully!', 'success');

    } catch (error) {
        console.error('Error saving profile:', error);
        showNotification('Failed to update profile', 'error');
    }
}

// Photo upload functionality
function initializePhotoUpload() {
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImage = document.getElementById('profileImage');

    if (!changePhotoBtn || !profileImageInput || !profileImage) return;

    changePhotoBtn.addEventListener('click', function () {
        profileImageInput.click();
    });

    profileImageInput.addEventListener('change', async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showNotification('Please select a valid image file (JPG or PNG)', 'error');
            return;
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            showNotification('File size must be less than 2MB', 'error');
            return;
        }

        // Preview the image
        const reader = new FileReader();
        reader.onload = function (event) {
            profileImage.src = event.target.result;
        };
        reader.readAsDataURL(file);

        // Upload to server
        await uploadProfileImage(file);
    });
}

// Upload profile image
async function uploadProfileImage(file) {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${API_BASE_URL}/api/v1/admins/${userId}/profile-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        showNotification('Photo updated successfully!', 'success');

    } catch (error) {
        console.error('Error uploading image:', error);
        showNotification('Failed to upload photo', 'error');
    }
}

// Utility functions
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    return date.toLocaleDateString('en-US', options).replace(',', ' -');
}

function showNotification(message, type = 'info') {
    // Simple alert for now - can be replaced with toast notification
    if (type === 'error') {
        alert('Error: ' + message);
    } else {
        alert(message);
    }
}
