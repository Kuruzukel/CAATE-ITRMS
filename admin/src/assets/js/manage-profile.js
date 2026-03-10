/* Manage Profile Page Script - Admin */

// API Configuration
const API_BASE_URL = config.api.baseURL;

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

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        // Fetch admin data from the admins collection
        try {
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

                // The AdminController already maps database fields to frontend format
                const mappedData = {
                    _id: adminData._id,
                    name: adminData.name,
                    email: adminData.email,
                    username: adminData.username,
                    role: adminData.role,
                    firstName: adminData.firstName,        // AdminController maps first_name to firstName
                    middleName: adminData.middleName,      // AdminController maps middle_name to middleName
                    lastName: adminData.lastName,          // AdminController maps last_name to lastName
                    phone: adminData.phone,
                    phoneNumber: adminData.phone,
                    address: adminData.address,
                    created_at: adminData.created_at,
                    updated_at: adminData.updated_at,
                    lastLogin: adminData.lastLogin,
                    lastLogout: adminData.lastLogout,
                    profileImage: adminData.profileImage || '../assets/images/AVATARNIKEL.jpg'
                };

                // Update profile overview
                updateProfileOverview(mappedData);

                // Update personal information
                updatePersonalInformation(mappedData);

                // Update navbar user info
                updateNavbarUserInfo(mappedData);

                // Update login history if available
                if (adminData.loginHistory) {
                    updateLoginHistory(adminData.loginHistory);
                }

                // Store the mapped data in localStorage for future use
                localStorage.setItem('userData', JSON.stringify(mappedData));

            } else {
                const errorData = await response.json();
                throw new Error(`Failed to fetch admin data: ${response.status} - ${errorData.error || 'Unknown error'}`);
            }

        } catch (apiError) {
            console.error('API Error:', apiError);

            // Fallback: try to use data from localStorage
            const userData = localStorage.getItem('userData');
            if (userData) {
                try {
                    const adminData = JSON.parse(userData);
                    updateProfileOverview(adminData);
                    updatePersonalInformation(adminData);
                    updateNavbarUserInfo(adminData);
                    showToast('Using cached profile data', 'warning');
                } catch (e) {
                    console.error('Error parsing cached data:', e);
                    showToast('Failed to load profile data', 'error');
                }
            } else {
                showToast('Failed to load profile data. Please try logging in again.', 'error');
            }
        }

    } catch (error) {
        console.error('Profile loading error:', error);
        showToast('An error occurred while loading your profile', 'error');
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
            first_name: editFirstName ? editFirstName.value : '',
            middle_name: editMiddleName ? editMiddleName.value : '',
            last_name: editLastName ? editLastName.value : '',
            phone: editPhone ? editPhone.value : '',
            email: editEmail ? editEmail.value : '',
            address: editAddress ? editAddress.value : ''
        };

        const response = await fetch(`${config.api.baseURL}/api/v1/admins/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editInformationModal'));
            if (modal) modal.hide();

            // Reload profile data
            await loadAdminProfile();

            // Show success toast
            showToast('Profile updated successfully!', 'success');
        } else {
            throw new Error('Failed to update profile');
        }

    } catch (error) {
        console.error('Profile update error:', error);
        showToast('Failed to update profile. Please try again.', 'error');
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
            showToast('Please select a valid image file (JPG or PNG)', 'error');
            return;
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast('File size must be less than 2MB', 'error');
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

        showToast('Photo updated successfully!', 'success');

    } catch (error) {
        showToast('Failed to upload photo', 'error');
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

// Toast notification functions
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

// Show success message
function showSuccess(message) {
    showToast(message, 'success');
}

// Show error message
function showError(message) {
    showToast(message, 'error');
}

function showNotification(message, type = 'info') {
    showToast(message, type);
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

// Show success message
function showSuccess(message) {
    showToast(message, 'success');
}

// Show error message
function showError(message) {
    showToast(message, 'error');
}