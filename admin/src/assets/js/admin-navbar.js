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
                console.warn('Failed to parse cached user data');
            }
        }

        // Fetch fresh admin data from the admins collection
        const apiUrl = `${config.api.baseURL}/api/v1/admins/${userId}`;

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

            console.log('Admin data loaded:', mappedData);
            console.log('Profile image from backend:', adminData.profileImage);

            // Update navbar user info
            updateNavbarUserInfo(mappedData);

            // Update cached data
            localStorage.setItem('userData', JSON.stringify(mappedData));
        } else {
            console.error('Failed to fetch admin data:', response.status);
        }
    } catch (error) {
        console.error('Error loading admin profile:', error);
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
                console.log('Updated avatar image:', img.src);
            } else {
                img.src = '../assets/images/DEFAULT_AVATAR.png';
            }

            // Add error handling to fallback to default avatar
            img.onerror = function () {
                console.log('Image load error, falling back to default avatar');
                this.src = '../assets/images/DEFAULT_AVATAR.png';
            };
        });
    });

    console.log('Updated navbar with profile image:', data.profileImage, `(${totalUpdated} images updated)`);

    // Force update any remaining avatar images that might have been missed
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
                console.log('Force updated missed avatar:', img);
            }
        });
        console.log(`Force updated ${forceUpdated} additional avatars`);
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
                console.log('Navbar updated from storage event:', userData.profileImage);
            } catch (error) {
                console.warn('Failed to parse updated user data');
            }
        }
    });

    // Listen for custom profile image update events
    window.addEventListener('profileImageUpdated', function (e) {
        console.log('Profile image updated event received:', e.detail);
        if (e.detail && e.detail.imagePath) {
            // Force update all avatars with the new image
            const allAvatarImages = document.querySelectorAll('img[src*="DEFAULT_AVATAR"], .navbar img, .dropdown-menu img, .avatar img');
            allAvatarImages.forEach((img) => {
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
    console.log('Refreshing admin navbar...');
    loadAdminProfileForNavbar();
};

// Function to force update all avatar images with a specific image path
window.forceUpdateAvatars = function (imagePath) {
    console.log('Force updating all avatars with:', imagePath);
    const allAvatarImages = document.querySelectorAll('img[src*="DEFAULT_AVATAR"], .navbar img, .dropdown-menu img, .avatar img');
    allAvatarImages.forEach((img, index) => {
        if (imagePath.startsWith('/CAATE-ITRMS/')) {
            img.src = window.location.origin + imagePath;
        } else if (imagePath.startsWith('/')) {
            img.src = window.location.origin + imagePath;
        } else {
            img.src = imagePath;
        }
        console.log(`Force updated avatar ${index}:`, img.src);
    });
};

// Function specifically for manage-profile page to reload navbar after image upload
window.reloadNavbarAfterImageUpload = function () {
    console.log('Reloading navbar after image upload...');
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