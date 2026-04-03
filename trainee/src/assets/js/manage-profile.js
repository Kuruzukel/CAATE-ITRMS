

const API_BASE_URL = config.api.baseUrl;

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
    if (!checkAuthentication()) {
        return;
    }

    window.traineeNavbarInitialized = true;

    if (typeof initializeTraineeNavbar === 'function') {
        initializeTraineeNavbar();
    }

    initializePhotoUpload();
    loadTraineeProfile();
    initializeEditForm();
});

async function loadTraineeProfile() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

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
                    profileImage: traineeData.profileImage || traineeData.profile_image || '../assets/images/DEFAULT_AVATAR.png',
                    profile_image: traineeData.profile_image || traineeData.profileImage || '../assets/images/DEFAULT_AVATAR.png'
                };

                updateProfileOverview(mappedData);

                updatePersonalInformation(mappedData);

                updateNavbarUserInfo(mappedData);

                localStorage.setItem('userData', JSON.stringify(mappedData));

            } else {
                let errorMessage = `Failed to fetch trainee data: ${response.status}`;

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = response.statusText || errorMessage;
                }

                throw new Error(errorMessage);
            }

        } catch (apiError) {
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

function updateProfileOverview(data) {
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

    const roleBadge = document.getElementById('profileRole');
    if (roleBadge) {
        roleBadge.textContent = data.traineeId || data._id || 'N/A';
        roleBadge.className = 'badge bg-primary';
    }

    const emailElement = document.getElementById('profileEmail');
    if (emailElement) {
        emailElement.textContent = data.email || 'N/A';
    }

    const statusBadge = document.getElementById('profileStatus');
    if (statusBadge) {
        const dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : 'N/A';
        statusBadge.textContent = dateOfBirth;
        statusBadge.className = 'badge bg-info';
    }

    const phoneElement = document.getElementById('profilePhone');
    if (phoneElement) {
        let phoneValue = data.phone || data.phoneNumber || 'N/A';
        if (phoneValue && phoneValue !== 'N/A' && phoneValue.length === 11) {
            phoneValue = phoneValue.slice(0, 4) + ' ' + phoneValue.slice(4, 7) + ' ' + phoneValue.slice(7);
        }
        phoneElement.textContent = phoneValue;
    }

    const addressElement = document.getElementById('profileAddress');
    if (addressElement) {
        addressElement.textContent = data.address || 'N/A';
    }

    updateAllProfileImages(data.profileImage || data.profile_image);

    updateNavbarUserInfo(data);
}

function updatePersonalInformation(data) {
    const traineeIdInput = document.getElementById('personalTraineeId');
    if (traineeIdInput) {
        traineeIdInput.value = data.traineeId || data._id || '';
    }

    const usernameInput = document.getElementById('personalUsername');
    if (usernameInput) {
        usernameInput.value = data.username || '';
    }

    const firstNameInput = document.getElementById('personalFirstName');
    if (firstNameInput) {
        firstNameInput.value = data.firstName || '';
    }

    const secondNameInput = document.getElementById('personalSecondName');
    if (secondNameInput) {
        secondNameInput.value = data.secondName || '';
    }

    const middleNameInput = document.getElementById('personalMiddleName');
    if (middleNameInput) {
        middleNameInput.value = data.middleName || '';
    }

    const lastNameInput = document.getElementById('personalLastName');
    if (lastNameInput) {
        lastNameInput.value = data.lastName || '';
    }

    const suffixInput = document.getElementById('personalSuffix');
    if (suffixInput) {
        suffixInput.value = data.suffix || '';
    }

    const dateOfBirthInput = document.getElementById('personalDateOfBirth');
    if (dateOfBirthInput) {
        const dateValue = data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '';
        dateOfBirthInput.value = dateValue;
    }

    const phoneInput = document.getElementById('personalPhone');
    if (phoneInput) {
        let phoneValue = data.phoneNumber || data.phone || '';
        if (phoneValue && phoneValue.length === 11) {
            phoneValue = phoneValue.slice(0, 4) + ' ' + phoneValue.slice(4, 7) + ' ' + phoneValue.slice(7);
        }
        phoneInput.value = phoneValue;
    }

    const emailInput = document.getElementById('personalEmail');
    if (emailInput) {
        emailInput.value = data.email || '';
    }

    const addressTextarea = document.getElementById('personalAddress');
    if (addressTextarea) {
        addressTextarea.value = data.address || '';
    }

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
        if (phoneValue && phoneValue.length === 11) {
            phoneValue = phoneValue.slice(0, 4) + ' ' + phoneValue.slice(4, 7) + ' ' + phoneValue.slice(7);
        }
        editPhone.value = phoneValue;
    }
    if (editEmail) editEmail.value = data.email || '';
    if (editAddress) editAddress.value = data.address || '';
}

function updateNavbarUserInfo(data) {
    const nameParts = [
        data.firstName || '',
        data.secondName || '',
        data.middleName || '',
        data.lastName || '',
        data.suffix || ''
    ].filter(part => part.trim() !== '');

    const displayName = nameParts.join(' ') || 'Trainee';

    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        if (element) {
            element.textContent = displayName;
        }
    });

    const userName = document.querySelector('.dropdown-menu .grow .fw-semibold');
    if (userName) {
        userName.textContent = displayName;
    }

    const welcomeElements = document.querySelectorAll('.welcome-user-name, .dashboard-welcome .user-name');
    welcomeElements.forEach(element => {
        if (element) {
            element.textContent = displayName;
        }
    });

    window.currentTraineeDisplayName = displayName;

    updateAllProfileImages(data.profileImage || data.profile_image);
}

function initializeEditForm() {
    const saveButton = document.querySelector('#editInformationModal .btn-primary');
    if (!saveButton) return;

    saveButton.addEventListener('click', async function () {
        const originalText = saveButton.innerHTML;
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Saving...';

        try {
            await saveProfileChanges();
        } finally {
            saveButton.disabled = false;
            saveButton.innerHTML = originalText;
        }
    });

    const phoneInput = document.getElementById('editPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 11) {
                value = value.slice(0, 11);
            }

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
            if (!/[0-9\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
}

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
        phone: editPhone ? editPhone.value.replace(/\s/g, '').trim() : '',
        email: editEmail ? editEmail.value.trim() : '',
        address: editAddress ? editAddress.value.trim() : ''
    };

    if (!updatedData.first_name || !updatedData.email || !updatedData.username) {
        showToast('First name, username, and email are required.', 'error');
        return;
    }

    if (!updatedData.date_of_birth) {
        showToast('Date of birth is required.', 'error');
        return;
    }

    if (!updatedData.address || updatedData.address.trim() === '') {
        showToast('Address is required.', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedData.email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }

    if (updatedData.phone && updatedData.phone.length > 0) {
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

            const modal = bootstrap.Modal.getInstance(document.getElementById('editInformationModal'));
            if (modal) modal.hide();

            await loadTraineeProfile();

            showToast('Profile updated successfully!', 'success');
        } else {
            const errorData = await response.json();
            let errorMessage = 'Failed to update profile';

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
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showToast('Network error. Please check your connection and try again.', 'error');
        } else if (error.message.includes('Authentication expired')) {
            showToast('Session expired. Redirecting to login...', 'error');
        } else {
            showToast(error.message, 'error');
        }
    }
}

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

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showToast('Please select a valid image file (JPG or PNG)', 'error');
            return;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast('File size must be less than 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            profileImage.src = event.target.result;
        };
        reader.readAsDataURL(file);

        await uploadProfileImage(file);
    });
}

async function uploadProfileImage(file) {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            showToast('Authentication required. Please log in again.', 'error');
            return;
        }

        const changePhotoBtn = document.getElementById('changePhotoBtn');
        changePhotoBtn.disabled = true;
        changePhotoBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Uploading...';

        const formData = new FormData();
        formData.append('profile_image', file);

        const uploadUrl = `${API_BASE_URL}/api/v1/trainees/${userId}`;

        const response = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const result = await response.json();

            const imagePath = result.profile_image || result.profileImage || result.image_path || result.data?.profile_image || result.data?.profileImage;

            if (imagePath) {
                updateAllProfileImages(imagePath);

                const userData = localStorage.getItem('userData');
                if (userData) {
                    try {
                        const userDataObj = JSON.parse(userData);
                        userDataObj.profileImage = imagePath;
                        userDataObj.profile_image = imagePath;
                        updateNavbarUserInfo(userDataObj);
                        localStorage.setItem('userData', JSON.stringify(userDataObj));
                    } catch (e) {
                    }
                }

                window.dispatchEvent(new CustomEvent('profileImageUpdated', {
                    detail: { imagePath: imagePath }
                }));

                showToast('Profile photo updated successfully!', 'success');
            } else {
                showToast('Profile photo uploaded successfully!', 'success');

                setTimeout(() => {
                    loadTraineeProfile();
                }, 500);
            }
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.message || 'Failed to upload image');
        }

    } catch (error) {
        showToast(error.message || 'Failed to upload photo', 'error');

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
        const changePhotoBtn = document.getElementById('changePhotoBtn');
        if (changePhotoBtn) {
            changePhotoBtn.disabled = false;
            changePhotoBtn.innerHTML = '<i class="bx bx-upload"></i> Change Photo';
        }
    }
}

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

    const timeout = type === 'info' ? 3000 : 5000;
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, timeout);
}

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showInfo(message) {
    showToast(message, 'info');
}

function showWarning(message) {
    showToast(message, 'warning');
}

function showNotification(message, type = 'info') {
    showToast(message, type);
}
window.refreshTraineeDisplayName = function () {
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const data = JSON.parse(userData);
            updateNavbarUserInfo(data);
        } catch (e) {
            loadTraineeProfile();
        }
    } else {
        loadTraineeProfile();
    }
};

window.fixPlaceholderDisplayName = function () {
    const userNameElements = document.querySelectorAll('.user-name');
    let foundPlaceholder = false;

    userNameElements.forEach(element => {
        if (element && (
            element.textContent === 'dsad  sdasd' ||
            element.textContent === 'dsad sdasd' ||
            element.textContent.includes('dsad')
        )) {
            element.textContent = 'Loading...';
            foundPlaceholder = true;
        }
    });

    if (foundPlaceholder) {
        window.refreshTraineeDisplayName();
    } else {
        window.refreshTraineeDisplayName();
    }
};
window.testProfileImageUpdate = function (imagePath) {
    updateAllProfileImages(imagePath);

    if (window.updateTraineeProfileImages) {
        window.updateTraineeProfileImages(imagePath);
    }

    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const userDataObj = JSON.parse(userData);
            userDataObj.profileImage = imagePath;
            userDataObj.profile_image = imagePath;
            localStorage.setItem('userData', JSON.stringify(userDataObj));

            window.dispatchEvent(new CustomEvent('profileImageUpdated', {
                detail: { imagePath: imagePath }
            }));
        } catch (e) {
        }
    }
};

function updateAllProfileImages(imagePath) {
    const profileImageSelectors = [
        '#profileImage',
        '.navbar .avatar img',
        '.dropdown-menu .avatar img',
        '.navbar-dropdown .avatar img',
        '.navbar img[src*="DEFAULT_AVATAR"]',
        '.navbar img[alt=""]',
        'img.w-px-40.h-auto.rounded-circle',
        '.navbar img.rounded-circle',
        '.dropdown-menu img.w-px-40',
        '.dropdown-menu img.rounded-circle',
        '.avatar img',
        'img[alt="Profile Picture"]'
    ];

    let totalUpdated = 0;
    profileImageSelectors.forEach(selector => {
        const images = document.querySelectorAll(selector);
        images.forEach(img => {
            if (img) {
                if (imagePath &&
                    imagePath !== '../assets/images/DEFAULT_AVATAR.png' &&
                    imagePath !== 'DEFAULT_AVATAR.png' &&
                    !imagePath.includes('DEFAULT_AVATAR')) {

                    if (imagePath.startsWith('/CAATE-ITRMS/')) {
                        img.src = window.location.origin + imagePath;
                    } else if (imagePath.startsWith('http')) {
                        img.src = imagePath;
                    } else if (imagePath.startsWith('/')) {
                        img.src = window.location.origin + imagePath;
                    } else {
                        img.src = `${window.location.origin}/CAATE-ITRMS/backend/public/uploads/profiles/${imagePath}`;
                    }
                    totalUpdated++;
                } else {
                    img.src = '../assets/images/DEFAULT_AVATAR.png';
                }

                img.onerror = function () {
                    this.src = '../assets/images/DEFAULT_AVATAR.png';
                };
            }
        });
    });

}

window.refreshTraineeDisplayName = function () {
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const data = JSON.parse(userData);
            updateNavbarUserInfo(data);
        } catch (e) {
            loadTraineeProfile();
        }
    } else {
        loadTraineeProfile();
    }
};

window.testProfileImageUpdate = function (imagePath) {
    updateAllProfileImages(imagePath);

    if (window.updateTraineeProfileImages) {
        window.updateTraineeProfileImages(imagePath);
    }

    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const userDataObj = JSON.parse(userData);
            userDataObj.profileImage = imagePath;
            userDataObj.profile_image = imagePath;
            localStorage.setItem('userData', JSON.stringify(userDataObj));

            window.dispatchEvent(new CustomEvent('profileImageUpdated', {
                detail: { imagePath: imagePath }
            }));
        } catch (e) {
        }
    }
};
