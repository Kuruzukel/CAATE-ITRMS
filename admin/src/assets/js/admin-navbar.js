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

async function loadAdminProfileForNavbar() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return;
        }

        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
            try {
                const userData = JSON.parse(cachedData);
                updateNavbarUserInfo(userData);
            } catch (e) {

            }
        }

        const apiUrl = `${config.api.baseUrl}/api/v1/admins/${userId}`;

        const response = await fetch(apiUrl, {
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

            updateNavbarUserInfo(mappedData);

            localStorage.setItem('userData', JSON.stringify(mappedData));
        }
    } catch (error) {

    }
}

function updateNavbarUserInfo(data) {

    const userName = document.querySelector('.dropdown-menu .grow .fw-semibold');
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

            if (img.classList.contains('course-image') || img.hasAttribute('data-course-id')) {
                return;
            }

            // Skip images inside tables (application/trainee data)
            if (img.closest('table') || img.closest('tbody')) {
                return;
            }

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
        // Only update navbar and dropdown images, not table content
        const navbarImages = document.querySelectorAll('.navbar img, .dropdown-menu img, .layout-navbar img');
        let forceUpdated = 0;
        navbarImages.forEach(img => {

            if (img.classList.contains('course-image') || img.hasAttribute('data-course-id')) {
                return;
            }

            // Skip images inside tables (application/trainee data)
            if (img.closest('table') || img.closest('tbody')) {
                return;
            }

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

function initializeAdminNavbar() {

    if (!checkAuthentication()) {
        return false;
    }

    loadAdminProfileForNavbar();

    window.addEventListener('storage', function (e) {
        if (e.key === 'userData' && e.newValue) {
            try {
                const userData = JSON.parse(e.newValue);
                updateNavbarUserInfo(userData);
            } catch (error) {

            }
        }
    });

    window.addEventListener('profileImageUpdated', function (e) {
        if (e.detail && e.detail.imagePath) {


            const allAvatarImages = document.querySelectorAll('.navbar .avatar img, .dropdown-menu .avatar img, .layout-navbar .avatar img');
            allAvatarImages.forEach((img) => {

                if (img.classList.contains('course-image') || img.hasAttribute('data-course-id')) {
                    return;
                }

                if (e.detail.imagePath.startsWith('/CAATE-ITRMS/')) {
                    img.src = window.location.origin + e.detail.imagePath;
                } else if (e.detail.imagePath.startsWith('/')) {
                    img.src = window.location.origin + e.detail.imagePath;
                } else {
                    img.src = e.detail.imagePath;
                }
            });
        }
    });

    return true;
}

window.refreshAdminNavbar = function () {
    loadAdminProfileForNavbar();
};

window.forceUpdateAvatars = function (imagePath) {


    const allAvatarImages = document.querySelectorAll('.navbar .avatar img, .dropdown-menu .avatar img, .layout-navbar .avatar img');
    allAvatarImages.forEach((img) => {

        if (img.classList.contains('course-image') || img.hasAttribute('data-course-id')) {
            return;
        }

        if (imagePath.startsWith('/CAATE-ITRMS/')) {
            img.src = window.location.origin + imagePath;
        } else if (imagePath.startsWith('/')) {
            img.src = window.location.origin + imagePath;
        } else {
            img.src = imagePath;
        }
    });
};

window.reloadNavbarAfterImageUpload = function () {

    localStorage.removeItem('userData');

    setTimeout(() => {
        loadAdminProfileForNavbar();
    }, 500);
};

document.addEventListener('DOMContentLoaded', function () {

    if (!window.adminNavbarInitialized) {
        initializeAdminNavbar();
        window.adminNavbarInitialized = true;
    }
});
