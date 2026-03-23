const API_BASE_URL = config.api.baseUrl;

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

    if (!checkAuthentication()) {
        return;
    }

    window.adminNavbarInitialized = true;

    if (typeof initializeAdminNavbar === 'function') {
        initializeAdminNavbar();
    }

    initializePhotoUpload();
    loadAdminProfile();
    initializeEditForm();
});

async function loadAdminProfile() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/admins/${userId}`, {
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
                    secondName: adminData.secondName,
                    middleName: adminData.middleName,
                    lastName: adminData.lastName,
                    suffix: adminData.suffix,
                    phone: adminData.phone,
                    phoneNumber: adminData.phone,
                    address: adminData.address,
                    created_at: adminData.created_at,
                    updated_at: adminData.updated_at,
                    profileImage: adminData.profileImage || '../assets/images/DEFAULT_AVATAR.png'
                };

                updateProfileOverview(mappedData);

                updatePersonalInformation(mappedData);

                updateNavbarUserInfo(mappedData);

                localStorage.setItem('userData', JSON.stringify(mappedData));

            } else {
                let errorMessage = `Failed to fetch admin data: ${response.status}`;

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
                    const adminData = JSON.parse(userData);
                    updateProfileOverview(adminData);
                    updatePersonalInformation(adminData);
                    updateNavbarUserInfo(adminData);
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
        fullNameElement.textContent = data.name || 'N/A';
    }

    const roleBadge = document.getElementById('profileRole');
    if (roleBadge) {
        const role = data.role === 'admin' ? 'Administrator' : (data.role || 'Administrator');
        roleBadge.textContent = role;
        roleBadge.className = 'badge bg-primary';
    }

    const usernameElement = document.getElementById('profileUsername');
    if (usernameElement) {
        usernameElement.textContent = data.username || 'N/A';
    }

    const emailElement = document.getElementById('profileEmail');
    if (emailElement) {
        emailElement.textContent = data.email || 'N/A';
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

    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        if (data.profileImage && data.profileImage !== '../assets/images/DEFAULT_AVATAR.png') {

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

        profileImage.onerror = function () {
            this.src = '../assets/images/DEFAULT_AVATAR.png';
        };
    }

    updateNavbarUserInfo(data);
}

function updatePersonalInformation(data) {

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

    const editUsername = document.getElementById('editUsername');
    const editFirstName = document.getElementById('editFirstName');
    const editSecondName = document.getElementById('editSecondName');
    const editMiddleName = document.getElementById('editMiddleName');
    const editLastName = document.getElementById('editLastName');
    const editSuffix = document.getElementById('editSuffix');
    const editPhone = document.getElementById('editPhone');
    const editEmail = document.getElementById('editEmail');
    const editAddress = document.getElementById('editAddress');

    if (editUsername) editUsername.value = data.username || '';
    if (editFirstName) editFirstName.value = data.firstName || '';
    if (editSecondName) editSecondName.value = data.secondName || '';
    if (editMiddleName) editMiddleName.value = data.middleName || '';
    if (editLastName) editLastName.value = data.lastName || '';
    if (editSuffix) editSuffix.value = data.suffix || '';
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
    const userName = document.querySelector('.dropdown-menu .flex-grow-1 .fw-semibold');
    if (userName) {

        let displayName = data.name || 'Admin';
        userName.textContent = displayName;
    }

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

            img.onerror = function () {
                this.src = '../assets/images/DEFAULT_AVATAR.png';
            };
        });
    });

    setTimeout(() => {
        const allImages = document.querySelectorAll('img');
        let forceUpdated = 0;
        allImages.forEach(img => {
            if ((img.src.includes('DEFAULT_AVATAR') ||
                img.classList.contains('rounded-circle') ||
                img.classList.contains('w-px-40') ||
                img.closest('.avatar') ||
                img.closest('.dropdown-menu')) &&
                data.profileImage &&
                data.profileImage !== '../assets/images/DEFAULT_AVATAR.png') {

                if (data.profileImage.startsWith('/CAATE-ITRMS/')) {
                    img.src = window.location.origin + data.profileImage;
                } else if (data.profileImage.startsWith('/')) {
                    img.src = window.location.origin + data.profileImage;
                } else {
                    img.src = data.profileImage;
                }
                forceUpdated++;
            }
        });

    }, 100);
}

function initializeEditForm() {
    const saveButton = document.querySelector('#editInformationModal .btn-primary');
    if (!saveButton) return;

    saveButton.addEventListener('click', async function () {

        const originalText = saveButton.innerHTML;
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Saving...';

        try {
            await saveProfileChangesNew();
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

    const editUsername = document.getElementById('editUsername');
    const editFirstName = document.getElementById('editFirstName');
    const editSecondName = document.getElementById('editSecondName');
    const editMiddleName = document.getElementById('editMiddleName');
    const editLastName = document.getElementById('editLastName');
    const editSuffix = document.getElementById('editSuffix');
    const editPhone = document.getElementById('editPhone');
    const editEmail = document.getElementById('editEmail');
    const editAddress = document.getElementById('editAddress');

    const updatedData = {
        username: editUsername ? editUsername.value.trim() : '',
        first_name: editFirstName ? editFirstName.value.trim() : '',
        second_name: editSecondName ? editSecondName.value.trim() : '',
        middle_name: editMiddleName ? editMiddleName.value.trim() : '',
        last_name: editLastName ? editLastName.value.trim() : '',
        suffix: editSuffix ? editSuffix.value.trim() : '',
        phone: editPhone ? editPhone.value.trim() : '',
        email: editEmail ? editEmail.value.trim() : '',
        address: editAddress ? editAddress.value.trim() : ''
    };

    console.log('Validating fields:', updatedData);

    if (!updatedData.username || updatedData.username.trim() === '') {
        console.log('Username validation failed');
        showToast('Username is required.', 'error');
        return;
    }

    if (!updatedData.first_name || updatedData.first_name.trim() === '') {
        console.log('First name validation failed');
        showToast('First name is required.', 'error');
        return;
    }

    if (!updatedData.email || updatedData.email.trim() === '') {
        console.log('Email validation failed');
        showToast('Email address is required.', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedData.email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }

    if (updatedData.phone && updatedData.phone.length > 0) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
        if (!phoneRegex.test(updatedData.phone)) {
            showToast('Please enter a valid phone number (10-15 digits).', 'error');
            return;
        }
    }

    const currentUsername = document.getElementById('personalUsername')?.value || '';
    const currentFirstName = document.getElementById('personalFirstName')?.value || '';
    const currentSecondName = document.getElementById('personalSecondName')?.value || '';
    const currentMiddleName = document.getElementById('personalMiddleName')?.value || '';
    const currentLastName = document.getElementById('personalLastName')?.value || '';
    const currentSuffix = document.getElementById('personalSuffix')?.value || '';
    const currentPhone = document.getElementById('personalPhone')?.value || '';
    const currentEmail = document.getElementById('personalEmail')?.value || '';
    const currentAddress = document.getElementById('personalAddress')?.value || '';

    const hasChanges =
        updatedData.username !== currentUsername ||
        updatedData.first_name !== currentFirstName ||
        updatedData.second_name !== currentSecondName ||
        updatedData.middle_name !== currentMiddleName ||
        updatedData.last_name !== currentLastName ||
        updatedData.suffix !== currentSuffix ||
        updatedData.phone !== currentPhone ||
        updatedData.email !== currentEmail ||
        updatedData.address !== currentAddress;

    if (!hasChanges) {
        showToast('No changes detected. Your profile is already up to date.', 'info');

        const modal = bootstrap.Modal.getInstance(document.getElementById('editInformationModal'));
        if (modal) modal.hide();
        return;
    }


    try {
        console.log('Sending data to backend:', updatedData);
        const response = await fetch(`${config.api.baseUrl}/api/v1/admins/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);


        if (response.ok) {
            const result = await response.json();

            const modal = bootstrap.Modal.getInstance(document.getElementById('editInformationModal'));
            if (modal) modal.hide();

            await loadAdminProfile();

            showToast('Profile updated successfully!', 'success');
        } else {
            const errorData = await response.json();
            let errorMessage = 'Failed to update profile';

            if (response.status === 404) {
                errorMessage = 'Admin account not found. Please contact support.';
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
        const originalText = changePhotoBtn.innerHTML;
        changePhotoBtn.disabled = true;
        changePhotoBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Uploading...';

        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${config.api.baseUrl}/api/v1/admins/${userId}/profile-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const result = await response.json();

            const profileImage = document.getElementById('profileImage');
            if (profileImage && result.image_path) {
                profileImage.src = result.image_path;
            }

            const navbarAvatarSelectors = [
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
            navbarAvatarSelectors.forEach(selector => {
                const images = document.querySelectorAll(selector);
                images.forEach((img) => {
                    if (result.image_path) {

                        if (result.image_path.startsWith('/CAATE-ITRMS/')) {
                            img.src = window.location.origin + result.image_path;
                        } else if (result.image_path.startsWith('http')) {
                            img.src = result.image_path;
                        } else if (result.image_path.startsWith('/')) {
                            img.src = window.location.origin + result.image_path;
                        } else {
                            img.src = result.image_path;
                        }
                        totalUpdated++;
                    }
                });
            });

            const userData = localStorage.getItem('userData');
            if (userData) {
                try {
                    const userDataObj = JSON.parse(userData);
                    userDataObj.profileImage = result.image_path;

                    updateNavbarUserInfo(userDataObj);

                    localStorage.setItem('userData', JSON.stringify(userDataObj));
                } catch (e) {

                }
            }

            window.dispatchEvent(new CustomEvent('profileImageUpdated', {
                detail: { imagePath: result.image_path }
            }));

            const currentUserData = localStorage.getItem('userData');
            if (currentUserData) {
                try {
                    const userDataObj = JSON.parse(currentUserData);
                    userDataObj.profileImage = result.image_path;

                    updateNavbarUserInfo(userDataObj);

                    localStorage.setItem('userData', JSON.stringify(userDataObj));
                } catch (e) {

                }
            }

            setTimeout(async () => {

                await loadAdminProfile();

                if (typeof loadAdminProfileForNavbar === 'function') {
                    await loadAdminProfileForNavbar();
                } else if (typeof window.refreshAdminNavbar === 'function') {
                    window.refreshAdminNavbar();
                }

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
        changePhotoBtn.disabled = false;
        changePhotoBtn.innerHTML = '<i class="bx bx-upload"></i> Change Photo';
    }
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';

    let date;

    if (typeof dateString === 'object' && dateString.$date) {
        date = new Date(dateString.$date);
    } else if (typeof dateString === 'string') {
        date = new Date(dateString);
    } else if (dateString instanceof Date) {
        date = dateString;
    } else {
        return 'N/A';
    }

    if (isNaN(date.getTime())) {
        return 'N/A';
    }

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    return date.toLocaleDateString('en-US', options);
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

async function saveProfileChangesNew() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
        showToast('Authentication required. Please log in again.', 'error');
        window.location.href = '../../../auth/src/pages/login.html';
        return;
    }

    const editUsername = document.getElementById('editUsername');
    const editFirstName = document.getElementById('editFirstName');
    const editSecondName = document.getElementById('editSecondName');
    const editMiddleName = document.getElementById('editMiddleName');
    const editLastName = document.getElementById('editLastName');
    const editSuffix = document.getElementById('editSuffix');
    const editPhone = document.getElementById('editPhone');
    const editEmail = document.getElementById('editEmail');
    const editAddress = document.getElementById('editAddress');

    const updatedData = {
        username: editUsername ? editUsername.value.trim() : '',
        first_name: editFirstName ? editFirstName.value.trim() : '',
        second_name: editSecondName ? editSecondName.value.trim() : '',
        middle_name: editMiddleName ? editMiddleName.value.trim() : '',
        last_name: editLastName ? editLastName.value.trim() : '',
        suffix: editSuffix ? editSuffix.value.trim() : '',
        phone: editPhone ? editPhone.value.trim() : '',
        email: editEmail ? editEmail.value.trim() : '',
        address: editAddress ? editAddress.value.trim() : ''
    };

    if (!updatedData.username || updatedData.username === '') {
        showToast('Username field is required.', 'error');
        return;
    }

    if (!updatedData.first_name || updatedData.first_name === '') {
        showToast('First name field is required.', 'error');
        return;
    }

    if (!updatedData.email || updatedData.email === '') {
        showToast('Email address field is required.', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedData.email)) {
        showToast('Please enter a valid email address format.', 'error');
        return;
    }

    if (updatedData.phone && updatedData.phone.length > 0) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
        if (!phoneRegex.test(updatedData.phone)) {
            showToast('Please enter a valid phone number format (10-15 digits).', 'error');
            return;
        }
    }

    const currentUsername = document.getElementById('personalUsername')?.value || '';
    const currentFirstName = document.getElementById('personalFirstName')?.value || '';
    const currentSecondName = document.getElementById('personalSecondName')?.value || '';
    const currentMiddleName = document.getElementById('personalMiddleName')?.value || '';
    const currentLastName = document.getElementById('personalLastName')?.value || '';
    const currentSuffix = document.getElementById('personalSuffix')?.value || '';
    const currentPhone = document.getElementById('personalPhone')?.value || '';
    const currentEmail = document.getElementById('personalEmail')?.value || '';
    const currentAddress = document.getElementById('personalAddress')?.value || '';

    const hasChanges =
        updatedData.username !== currentUsername ||
        updatedData.first_name !== currentFirstName ||
        updatedData.second_name !== currentSecondName ||
        updatedData.middle_name !== currentMiddleName ||
        updatedData.last_name !== currentLastName ||
        updatedData.suffix !== currentSuffix ||
        updatedData.phone !== currentPhone ||
        updatedData.email !== currentEmail ||
        updatedData.address !== currentAddress;

    if (!hasChanges) {
        showToast('No changes detected. Your profile is already up to date.', 'info');

        const modal = bootstrap.Modal.getInstance(document.getElementById('editInformationModal'));
        if (modal) modal.hide();
        return;
    }

    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/admins/${userId}`, {
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

            await loadAdminProfile();

            showToast('Profile updated successfully!', 'success');
        } else {
            const errorData = await response.json();
            let errorMessage = 'Failed to update profile';

            if (response.status === 404) {
                errorMessage = 'Admin account not found. Please contact support.';
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

async function testDatabaseUpdate() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    console.log('Testing database update with ID:', userId);

    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/admins/${userId}/test`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log('Test result:', result);

        if (response.ok) {
            showToast('Database test completed - check console', 'info');
        } else {
            showToast('Database test failed - check console', 'error');
        }
    } catch (error) {
        console.error('Test error:', error);
        showToast('Database test error - check console', 'error');
    }
}