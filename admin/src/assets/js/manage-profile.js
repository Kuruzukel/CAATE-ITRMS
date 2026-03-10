/* Manage Profile Page Script - Admin */

// API Configuration
const API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public';

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
        const userData = localStorage.getItem('userData');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        // Try to get user data from localStorage first
        let adminData = null;
        if (userData) {
            try {
                adminData = JSON.parse(userData);
            } catch (e) {
                // Error parsing userData
            }
        }

        // If we have user data from localStorage, use it
        if (adminData) {
            updateProfileOverview(adminData);
            updatePersonalInformation(adminData);
            return;
        }

        // Otherwise, try to fetch from API with fallback strategy
        try {
            // Try general users endpoint first
            let response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Try admin-specific endpoint
                response = await fetch(`${API_BASE_URL}/api/v1/admins/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.ok) {
                const result = await response.json();
                adminData = result.data || result.user || result;

                // Update profile overview
                updateProfileOverview(adminData);

                // Update personal information
                updatePersonalInformation(adminData);

                // Update login history if available
                if (adminData.loginHistory) {
                    updateLoginHistory(adminData.loginHistory);
                }
            } else {
                throw new Error('Failed to fetch from API');
            }

        } catch (apiError) {
            // Fallback: use data from localStorage
            if (userData) {
                try {
                    const adminData = JSON.parse(userData);
                    updateProfileOverview(adminData);
                    updatePersonalInformation(adminData);
                } catch (e) {
                    showNotification('Failed to load profile data', 'error');
                }
            } else {
                showNotification('Failed to load profile data', 'error');
            }
        }

    } catch (error) {
        // Fallback: use data from localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const adminData = JSON.parse(userData);
                updateProfileOverview(adminData);
                updatePersonalInformation(adminData);
            } catch (e) {
                showNotification('Failed to load profile data', 'error');
            }
        } else {
            showNotification('Failed to load profile data', 'error');
        }
    }
}

// Update profile overview section
function updateProfileOverview(data) {
    // Full name - use name field from database
    const fullNameElement = document.getElementById('profileFullName');
    if (fullNameElement) {
        fullNameElement.textContent = data.name || 'N/A';
    }

    // Role badge - fetch from database but default to Administrator for admin
    const roleBadge = document.getElementById('profileRole');
    if (roleBadge) {
        const role = data.role === 'admin' ? 'Administrator' : (data.role || 'Administrator');
        roleBadge.textContent = role;
        roleBadge.className = 'badge bg-primary';
    }

    // Email - fetch from database
    const emailElement = document.getElementById('profileEmail');
    if (emailElement) {
        emailElement.textContent = data.email || 'N/A';
    }

    // Account status - static Active
    const statusBadge = document.getElementById('profileStatus');
    if (statusBadge) {
        statusBadge.textContent = 'Active';
        statusBadge.className = 'badge bg-success';
    }

    // Last login - show actual date when available
    const lastLoginElement = document.getElementById('profileLastLogin');
    if (lastLoginElement) {
        if (data.lastLogin) {
            lastLoginElement.textContent = formatDateTime(data.lastLogin);
        } else {
            lastLoginElement.textContent = 'N/A';
        }
    }

    // Last logout - show actual date when available
    const lastLogoutElement = document.getElementById('profileLastLogout');
    if (lastLogoutElement) {
        if (data.lastLogout) {
            lastLogoutElement.textContent = formatDateTime(data.lastLogout);
        } else {
            lastLogoutElement.textContent = 'N/A';
        }
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
    const firstNameInput = document.getElementById('personalFirstName');
    if (firstNameInput) {
        firstNameInput.value = data.firstName || '';
    }

    // Middle name
    const middleNameInput = document.getElementById('personalMiddleName');
    if (middleNameInput) {
        middleNameInput.value = data.middleName || '';
    }

    // Last name
    const lastNameInput = document.getElementById('personalLastName');
    if (lastNameInput) {
        lastNameInput.value = data.lastName || '';
    }

    // Phone number
    const phoneInput = document.getElementById('personalPhone');
    if (phoneInput) {
        phoneInput.value = data.phoneNumber || data.phone || '';
    }

    // Email address
    const emailInput = document.getElementById('personalEmail');
    if (emailInput) {
        emailInput.value = data.email || '';
    }

    // Address
    const addressTextarea = document.getElementById('personalAddress');
    if (addressTextarea) {
        addressTextarea.value = data.address || '';
    }

    // Update edit modal fields
    const editFirstName = document.getElementById('editFirstName');
    const editMiddleName = document.getElementById('editMiddleName');
    const editLastName = document.getElementById('editLastName');
    const editPhone = document.getElementById('editPhone');
    const editEmail = document.getElementById('editEmail');
    const editAddress = document.getElementById('editAddress');

    if (editFirstName) editFirstName.value = data.firstName || '';
    if (editMiddleName) editMiddleName.value = data.middleName || '';
    if (editLastName) editLastName.value = data.lastName || '';
    if (editPhone) editPhone.value = data.phoneNumber || data.phone || '';
    if (editEmail) editEmail.value = data.email || '';
    if (editAddress) editAddress.value = data.address || '';
}

// Update login history table
function updateLoginHistory(loginHistory) {
    const tbody = document.getElementById('loginHistoryTable');
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
        // Use name field from database first
        let displayName = data.name || 'Admin';
        userName.textContent = displayName;
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

        const editFirstName = document.getElementById('editFirstName');
        const editMiddleName = document.getElementById('editMiddleName');
        const editLastName = document.getElementById('editLastName');
        const editPhone = document.getElementById('editPhone');
        const editEmail = document.getElementById('editEmail');
        const editAddress = document.getElementById('editAddress');

        const updatedData = {
            firstName: editFirstName ? editFirstName.value : '',
            middleName: editMiddleName ? editMiddleName.value : '',
            lastName: editLastName ? editLastName.value : '',
            phoneNumber: editPhone ? editPhone.value : '',
            email: editEmail ? editEmail.value : '',
            address: editAddress ? editAddress.value : ''
        };

        const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
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
        if (modal) modal.hide();

        // Reload profile data
        await loadAdminProfile();

        showNotification('Profile updated successfully!', 'success');

    } catch (error) {
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

        const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}/profile-image`, {
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