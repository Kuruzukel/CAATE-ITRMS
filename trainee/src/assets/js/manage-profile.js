/* Manage Profile Page Script - Trainee */

// API Configuration
const API_BASE_URL = config.api.baseUrl;

// Authentication check
function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (!token || !userRole || !userId) {
        window.location.href = '../../../auth/src/pages/login.html';
        return false;
    }

    if (userRole !== 'trainee') {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'admin') {
            window.location.href = baseUrl + '/admin/src/pages/dashboard.html';
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

    // Set flag to prevent trainee-navbar.js from double-initializing
    window.traineeNavbarInitialized = true;

    // Initialize navbar functionality manually since we're preventing auto-init
    if (typeof initializeTraineeNavbar === 'function') {
        initializeTraineeNavbar();
    }

    initializePhotoUpload();
    loadTraineeProfile();
    initializeEditForm();
});

// Load trainee profile data from database
async function loadTraineeProfile() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        // Fetch trainee data from the trainees collection
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/trainees/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();

                let traineeData = result.data || result.trainee || result;

                // Map database fields to frontend format
                const mappedData = {
                    _id: traineeData._id,
                    name: traineeData.name,
                    email: traineeData.email,
                    username: traineeData.username,
                    role: traineeData.role,
                    firstName: traineeData.firstName || traineeData.first_name,
                    secondName: traineeData.secondName || traineeData.second_name || '',
                    middleName: traineeData.middleName || traineeData.middle_name || '',
                    lastName: traineeData.lastName || traineeData.last_name,
                    suffix: traineeData.suffix || '',
                    traineeId: traineeData.traineeId || traineeData.trainee_id,
                    dateOfBirth: traineeData.dateOfBirth || traineeData.date_of_birth,
                    phone: traineeData.phone || traineeData.phoneNumber,
                    phoneNumber: traineeData.phone || traineeData.phoneNumber,
                    address: traineeData.address,
                    created_at: traineeData.created_at,
                    updated_at: traineeData.updated_at,
                    profileImage: traineeData.profileImage || '../assets/images/DEFAULT_AVATAR.png'
                };

                // Update profile overview
                updateProfileOverview(mappedData);

                // Update personal information
                updatePersonalInformation(mappedData);

                // Update navbar user info
                updateNavbarUserInfo(mappedData);

                // Store the mapped data in localStorage for future use
                localStorage.setItem('userData', JSON.stringify(mappedData));

            } else {
                let errorMessage = `Failed to fetch trainee data: ${response.status}`;

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }

                throw new Error(errorMessage);
            }

        } catch (apiError) {
            // Fallback: try to use data from localStorage
            const userData = localStorage.getItem('userData');
            if (userData) {
                try {
                    const traineeData = JSON.parse(userData);
                    updateProfileOverview(traineeData);
                    updatePersonalInformation(traineeData);
                    updateNavbarUserInfo(traineeData);
                    showToast('Using cached profile data', 'warning');
                } catch (e) {
                    showToast('Failed to load profile data', 'error');
                }
            } else {
                showToast('Failed to load profile data. Please try logging in again.', 'error');
            }
        }

    } catch (error) {
        showToast('An error occurred while loading your profile', 'error');
    }
}

// Update profile overview section
function updateProfileOverview(data) {
    // Full name - combine first_name, second_name, middle_name, last_name, suffix
    const fullNameElement = document.getElementById('profileFullName');
    if (fullNameElement) {
        const nameParts = [
            data.firstName || '',
            data.secondName || '',
            data.middleName || '',
            data.lastName || '',
            data.suffix || ''
        ].filter(part => part.trim() !== '');

        const fullName = nameParts.join(' ') || 'N/A';
        fullNameElement.textContent = fullName;
    }

    // Trainee ID - replace role badge
    const roleBadge = document.getElementById('profileRole');
    if (roleBadge) {
        roleBadge.textContent = data.traineeId || data._id || 'N/A';
        roleBadge.className = 'badge bg-primary';
    }

    // Email - fetch from database
    const emailElement = document.getElementById('profileEmail');
    if (emailElement) {
        emailElement.textContent = data.email || 'N/A';
    }

    // Date of Birth - replace account status
    const statusBadge = document.getElementById('profileStatus');
    if (statusBadge) {
        const dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : 'N/A';
        statusBadge.textContent = dateOfBirth;
        statusBadge.className = 'badge bg-info';
    }

    // Phone number
    const phoneElement = document.getElementById('profilePhone');
    if (phoneElement) {
        phoneElement.textContent = data.phone || data.phoneNumber || 'N/A';
    }

    // Address
    const addressElement = document.getElementById('profileAddress');
    if (addressElement) {
        addressElement.textContent = data.address || 'N/A';
    }

    // Profile image - use uploaded image if available, otherwise default avatar
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        if (data.profileImage && data.profileImage !== '../assets/images/DEFAULT_AVATAR.png') {
            // Handle both relative and absolute paths
            if (data.profileImage.startsWith('/CAATE-ITRMS/')) {
                profileImage.src = window.location.origin + data.profileImage;
            } else if (data.profileImage.startsWith('http')) {
                profileImage.src = data.profileImage;
            } else {
                profileImage.src = data.profileImage;
            }
        } else {
            profileImage.src = '../assets/images/DEFAULT_AVATAR.png';
        }

        // Add error handling
        profileImage.onerror = function () {
            this.src = '../assets/images/DEFAULT_AVATAR.png';
        };
    }

    // Update navbar user info
    updateNavbarUserInfo(data);
}

// Update personal information section
function updatePersonalInformation(data) {
    // Trainee ID
    const traineeIdInput = document.getElementById('personalTraineeId');
    if (traineeIdInput) {
        traineeIdInput.value = data.traineeId || data._id || '';
    }

    // Username
    const usernameInput = document.getElementById('personalUsername');
    if (usernameInput) {
        usernameInput.value = data.username || '';
    }

    // First name
    const firstNameInput = document.getElementById('personalFirstName');
    if (firstNameInput) {
        firstNameInput.value = data.firstName || '';
    }

    // Second name
    const secondNameInput = document.getElementById('personalSecondName');
    if (secondNameInput) {
        secondNameInput.value = data.secondName || '';
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

    // Suffix
    const suffixInput = document.getElementById('personalSuffix');
    if (suffixInput) {
        suffixInput.value = data.suffix || '';
    }

    // Date of Birth
    const dateOfBirthInput = document.getElementById('personalDateOfBirth');
    if (dateOfBirthInput) {
        const dateValue = data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '';
        dateOfBirthInput.value = dateValue;
    }

    // Phone number
    const phoneInput = document.getElementById('personalPhone');
    if (phoneInput) {
        let phoneValue = data.phoneNumber || data.phone || '';
        // Format phone number for display: 09XX XXX XXXX
        if (phoneValue && phoneValue.length === 11) {
            phoneValue = phoneValue.slice(0, 4) + ' ' + phoneValue.slice(4, 7) + ' ' + phoneValue.slice(7);
        }
        phoneInput.value = phoneValue;
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
    const editTraineeId = document.getElementById('editTraineeId');
    const editUsername = document.getElementById('editUsername');
    const editFirstName = document.getElementById('editFirstName');
    const editSecondName = document.getElementById('editSecondName');
    const editMiddleName = document.getElementById('editMiddleName');
    const editLastName = document.getElementById('editLastName');
    const editSuffix = document.getElementById('editSuffix');
    const editDateOfBirth = document.getElementById('editDateOfBirth');
    const editPhone = document.getElementById('editPhone');
    const editEmail = document.getElementById('editEmail');
    const editAddress = document.getElementById('editAddress');

    if (editTraineeId) editTraineeId.value = data.traineeId || data._id || '';
    if (editUsername) editUsername.value = data.username || '';
    if (editFirstName) editFirstName.value = data.firstName || '';
    if (editSecondName) editSecondName.value = data.secondName || '';
    if (editMiddleName) editMiddleName.value = data.middleName || '';
    if (editLastName) editLastName.value = data.lastName || '';
    if (editSuffix) editSuffix.value = data.suffix || '';
    if (editDateOfBirth) {
        const dateValue = data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '';
        editDateOfBirth.value = dateValue;
    }
    if (editPhone) {
        let phoneValue = data.phoneNumber || data.phone || '';
        // Format phone number for display: 09XX XXX XXXX
        if (phoneValue && phoneValue.length === 11) {
            phoneValue = phoneValue.slice(0, 4) + ' ' + phoneValue.slice(4, 7) + ' ' + phoneValue.slice(7);
        }
        editPhone.value = phoneValue;
    }
    if (editEmail) editEmail.value = data.email || '';
    if (editAddress) editAddress.value = data.address || '';
}


// Update navbar user info
function updateNavbarUserInfo(data) {
    const userName = document.querySelector('.dropdown-menu .flex-grow-1 .fw-semibold');
    if (userName) {
        // Use combined full name
        const nameParts = [
            data.firstName || '',
            data.secondName || '',
            data.middleName || '',
            data.lastName || '',
            data.suffix || ''
        ].filter(part => part.trim() !== '');

        const displayName = nameParts.join(' ') || 'Trainee';
        userName.textContent = displayName;
    }

    // Update profile images in navbar - target all avatar images more comprehensively
    const profileImageSelectors = [
        '.navbar .avatar img',
        '.dropdown-menu .avatar img',
        '.navbar-dropdown .avatar img',
        '.navbar img[src*="DEFAULT_AVATAR"]',
        '.navbar img[alt=""]',
        'img.w-px-40.h-auto.rounded-circle',
        '.navbar img.rounded-circle',
        '.dropdown-menu img.w-px-40',
        '.dropdown-menu img.rounded-circle'
    ];

    let totalUpdated = 0;
    profileImageSelectors.forEach(selector => {
        const images = document.querySelectorAll(selector);
        images.forEach(img => {
            if (data.profileImage && data.profileImage !== '../assets/images/DEFAULT_AVATAR.png') {
                // Handle both relative and absolute paths
                if (data.profileImage.startsWith('/CAATE-ITRMS/')) {
                    img.src = window.location.origin + data.profileImage;
                } else if (data.profileImage.startsWith('http')) {
                    img.src = data.profileImage;
                } else if (data.profileImage.startsWith('/')) {
                    img.src = window.location.origin + data.profileImage;
                } else {
                    img.src = data.profileImage;
                }
                totalUpdated++;
            } else {
                img.src = '../assets/images/DEFAULT_AVATAR.png';
            }

            // Add error handling to fallback to default avatar
            img.onerror = function () {
                this.src = '../assets/images/DEFAULT_AVATAR.png';
            };
        });
    });
}

// Initialize edit form
function initializeEditForm() {
    const saveButton = document.querySelector('#editInformationModal .btn-primary');
    if (!saveButton) return;

    saveButton.addEventListener('click', async function () {
        // Show loading state
        const originalText = saveButton.innerHTML;
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Saving...';

        try {
            await saveProfileChanges();
        } finally {
            // Reset button state
            saveButton.disabled = false;
            saveButton.innerHTML = originalText;
        }
    });

    // Add phone number validation and formatting
    const phoneInput = document.getElementById('editPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            // Remove all non-numeric characters
            let value = e.target.value.replace(/\D/g, '');

            // Limit to 11 digits
            if (value.length > 11) {
                value = value.slice(0, 11);
            }

            // Format with spacing like placeholder: 09XX XXX XXXX
            if (value.length >= 4) {
                if (value.length >= 7) {
                    value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
                } else {
                    value = value.slice(0, 4) + ' ' + value.slice(4);
                }
            }

            e.target.value = value;
        });

        phoneInput.addEventListener('keypress', function (e) {
            // Only allow numeric characters and space
            if (!/[0-9\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
}

// Save profile changes
async function saveProfileChanges() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
        showToast('Authentication required. Please log in again.', 'error');
        window.location.href = '../../../auth/src/pages/login.html';
        return;
    }

    const editFirstName = document.getElementById('editFirstName');
    const editSecondName = document.getElementById('editSecondName');
    const editMiddleName = document.getElementById('editMiddleName');
    const editLastName = document.getElementById('editLastName');
    const editSuffix = document.getElementById('editSuffix');
    const editDateOfBirth = document.getElementById('editDateOfBirth');
    const editPhone = document.getElementById('editPhone');
    const editEmail = document.getElementById('editEmail');
    const editAddress = document.getElementById('editAddress');
    const editUsername = document.getElementById('editUsername');

    const updatedData = {
        username: editUsername ? editUsername.value.trim() : '',
        first_name: editFirstName ? editFirstName.value.trim() : '',
        second_name: editSecondName ? editSecondName.value.trim() : '',
        middle_name: editMiddleName ? editMiddleName.value.trim() : '',
        last_name: editLastName ? editLastName.value.trim() : '',
        suffix: editSuffix ? editSuffix.value.trim() : '',
        date_of_birth: editDateOfBirth ? editDateOfBirth.value : '',
        phone: editPhone ? editPhone.value.replace(/\s/g, '').trim() : '', // Remove spaces for storage
        email: editEmail ? editEmail.value.trim() : '',
        address: editAddress ? editAddress.value.trim() : ''
    };

    // Basic validation - first name, username, email, date of birth, and address are required
    if (!updatedData.first_name || !updatedData.email || !updatedData.username) {
        showToast('First name, username, and email are required.', 'error');
        return;
    }

    // Date of birth validation
    if (!updatedData.date_of_birth) {
        showToast('Date of birth is required.', 'error');
        return;
    }

    // Address validation
    if (!updatedData.address || updatedData.address.trim() === '') {
        showToast('Address is required.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedData.email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }

    // Phone number validation (optional but if provided, should be valid)
    if (updatedData.phone && updatedData.phone.length > 0) {
        // Remove any non-digit characters for validation
        const cleanPhone = updatedData.phone.replace(/\D/g, '');
        if (cleanPhone.length !== 11 || !cleanPhone.startsWith('09')) {
            showToast('Please enter a valid 11-digit phone number starting with 09 (e.g., 09XX XXX XXXX).', 'error');
            return;
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/trainees/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const result = await response.json();

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editInformationModal'));
            if (modal) modal.hide();

            // Reload profile data to reflect changes
            await loadTraineeProfile();

            // Show success toast
            showToast('Profile updated successfully!', 'success');
        } else {
            const errorData = await response.json();
            let errorMessage = 'Failed to update profile';

            // Handle specific error cases
            if (response.status === 404) {
                errorMessage = 'Trainee account not found. Please contact support.';
            } else if (response.status === 401) {
                errorMessage = 'Authentication expired. Please log in again.';
                setTimeout(() => {
                    window.location.href = '../../../auth/src/pages/login.html';
                }, 2000);
            } else if (response.status === 403) {
                errorMessage = 'You do not have permission to update this profile.';
            } else if (response.status === 422) {
                errorMessage = errorData.error || 'Invalid data provided. Please check your inputs.';
            } else if (response.status === 409) {
                errorMessage = 'Email address is already in use by another account.';
            } else if (response.status === 500) {
                errorMessage = 'Server error occurred. Please try again later.';
            } else if (response.status === 503) {
                errorMessage = 'Service temporarily unavailable. Please try again in a few minutes.';
            } else if (errorData.error) {
                errorMessage = errorData.error;
            }

            throw new Error(errorMessage);
        }
    } catch (error) {
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showToast('Network error. Please check your connection and try again.', 'error');
        } else if (error.message.includes('Authentication expired')) {
            showToast('Session expired. Redirecting to login...', 'error');
        } else {
            showToast(error.message, 'error');
        }
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

        // Preview the uploaded image
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

        if (!token || !userId) {
            showToast('Authentication required. Please log in again.', 'error');
            return;
        }

        // Show loading state
        const changePhotoBtn = document.getElementById('changePhotoBtn');
        const originalText = changePhotoBtn.innerHTML;
        changePhotoBtn.disabled = true;
        changePhotoBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Uploading...';

        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${API_BASE_URL}/api/v1/trainees/${userId}/profile-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const result = await response.json();

            // Update the profile image immediately
            const profileImage = document.getElementById('profileImage');
            if (profileImage && result.image_path) {
                profileImage.src = result.image_path;
            }

            // Update cached user data with new profile image
            const userData = localStorage.getItem('userData');
            if (userData) {
                try {
                    const userDataObj = JSON.parse(userData);
                    userDataObj.profileImage = result.image_path;

                    // Call the local updateNavbarUserInfo function immediately
                    updateNavbarUserInfo(userDataObj);

                    localStorage.setItem('userData', JSON.stringify(userDataObj));
                } catch (e) {
                    // Silent fail for cache update
                }
            }

            // Dispatch custom event to notify other pages/tabs
            window.dispatchEvent(new CustomEvent('profileImageUpdated', {
                detail: { imagePath: result.image_path }
            }));

            // Force reload trainee profile data to get fresh data from database
            setTimeout(async () => {
                await loadTraineeProfile();

                // Trigger storage event to update other trainee pages
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'userData',
                    newValue: localStorage.getItem('userData')
                }));
            }, 1000);

            showToast('Profile photo updated successfully!', 'success');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload image');
        }

    } catch (error) {
        showToast(error.message || 'Failed to upload photo', 'error');

        // Reset the image to previous state on error
        const profileImage = document.getElementById('profileImage');
        const userData = localStorage.getItem('userData');
        if (profileImage && userData) {
            try {
                const userDataObj = JSON.parse(userData);
                profileImage.src = userDataObj.profileImage || '../assets/images/DEFAULT_AVATAR.png';
            } catch (e) {
                profileImage.src = '../assets/images/DEFAULT_AVATAR.png';
            }
        }
    } finally {
        // Reset button state
        const changePhotoBtn = document.getElementById('changePhotoBtn');
        changePhotoBtn.disabled = false;
        changePhotoBtn.innerHTML = '<i class="bx bx-upload"></i> Change Photo';
    }
}

// Toast notification functions
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-alt' :
                type === 'info' ? 'bx-info-circle' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds (or 3 seconds for info messages)
    const timeout = type === 'info' ? 3000 : 5000;
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, timeout);
}

// Show success message
function showSuccess(message) {
    showToast(message, 'success');
}

// Show error message
function showError(message) {
    showToast(message, 'error');
}

// Show info message
function showInfo(message) {
    showToast(message, 'info');
}

// Show warning message
function showWarning(message) {
    showToast(message, 'warning');
}

function showNotification(message, type = 'info') {
    showToast(message, type);
}