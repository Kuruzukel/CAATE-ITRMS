/* Admin Navbar Script - Common functionality for all admin pages */

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

        // Try to get cached data first for immediate display
        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
            try {
                const userData = JSON.parse(cachedData);
                updateNavbarUserInfo(userData);
            } catch (e) {
                // Silently handle parse errors
            }
        }

        // Fetch fresh admin data from the admins collection
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

            // Map the data to consistent format
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
        // Silent error handling
    }
}

// Update navbar user info
function updateNavbarUserInfo(data) {
    // Update user name in dropdown
    const userName = document.querySelector('.dropdown-menu .flex-grow-1 .fw-semibold');
    if (userName) {
        // Use name field from database first
        let displayName = data.name || 'Admin';
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
            // Skip course images
            if (img.classList.contains('course-image') || img.hasAttribute('data-course-id')) {
                return;
            }

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



    // Force update any remaining avatar images that might have been missed
    // BUT EXCLUDE COURSE IMAGES
    setTimeout(() => {
        const allImages = document.querySelectorAll('img');
        let forceUpdated = 0;
        allImages.forEach(img => {
            // Skip course images - CRITICAL CHECK
            if (img.classList.contains('course-image') || img.hasAttribute('data-course-id')) {
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

// Initialize admin navbar functionality
function initializeAdminNavbar() {
    // Check authentication first
    if (!checkAuthentication()) {
        return false;
    }

    // Load admin profile data for navbar
    loadAdminProfileForNavbar();

    // Listen for profile updates from other pages
    window.addEventListener('storage', function (e) {
        if (e.key === 'userData' && e.newValue) {
            try {
                const userData = JSON.parse(e.newValue);
                updateNavbarUserInfo(userData);
            } catch (error) {
                // Silent error handling
            }
        }
    });

    // Listen for custom profile image update events
    window.addEventListener('profileImageUpdated', function (e) {
        if (e.detail && e.detail.imagePath) {
            // Force update only user profile avatars (not course images)
            // Exclude images with course-image class or data-course-id attribute
            const allAvatarImages = document.querySelectorAll('.navbar .avatar img, .dropdown-menu .avatar img, .layout-navbar .avatar img');
            allAvatarImages.forEach((img) => {
                // Skip course images
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

// Function to refresh navbar data (can be called from other pages)
window.refreshAdminNavbar = function () {
    loadAdminProfileForNavbar();
};

// Function to force update all avatar images with a specific image path
window.forceUpdateAvatars = function (imagePath) {
    // Only update user profile avatars in navbar and dropdown (not course images)
    // Exclude images with course-image class or data-course-id attribute
    const allAvatarImages = document.querySelectorAll('.navbar .avatar img, .dropdown-menu .avatar img, .layout-navbar .avatar img');
    allAvatarImages.forEach((img) => {
        // Skip course images
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

// Function specifically for manage-profile page to reload navbar after image upload
window.reloadNavbarAfterImageUpload = function () {
    // Clear any cached data to force fresh fetch
    localStorage.removeItem('userData');
    // Reload profile data
    setTimeout(() => {
        loadAdminProfileForNavbar();
    }, 500);
};

// Auto-initialize when DOM is loaded (if not already initialized by page-specific script)
document.addEventListener('DOMContentLoaded', function () {
    // Only initialize if no page-specific initialization has been done
    if (!window.adminNavbarInitialized) {
        initializeAdminNavbar();
        window.adminNavbarInitialized = true;
    }
});