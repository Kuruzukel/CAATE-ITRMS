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
        } else {
            console.error('Failed to fetch admin data:', response.status);
        }
    } catch (error) {
        console.error('Error loading admin profile:', error);
    }
}

// Update navbar user info
function updateNavbarUserInfo(data) {
    console.log('Updating navbar with data:', data); // Debug log

    // Update user name in dropdown
    const userName = document.querySelector('.dropdown-menu .flex-grow-1 .fw-semibold');
    console.log('Found userName element:', userName); // Debug log

    if (userName) {
        // Use name field from database first
        let displayName = data.name || 'Admin';
        userName.textContent = displayName;
        console.log('Updated userName to:', displayName); // Debug log
    }

    // Update profile images in navbar
    const profileImages = document.querySelectorAll('.navbar .avatar img');
    console.log('Found profile images:', profileImages.length); // Debug log

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

// Initialize admin navbar functionality
function initializeAdminNavbar() {
    console.log('Initializing admin navbar...'); // Debug log

    // Check authentication first
    if (!checkAuthentication()) {
        console.log('Authentication failed'); // Debug log
        return false;
    }

    console.log('Authentication passed, loading profile...'); // Debug log

    // Load admin profile data for navbar
    loadAdminProfileForNavbar();
    return true;
}

// Auto-initialize when DOM is loaded (if not already initialized by page-specific script)
document.addEventListener('DOMContentLoaded', function () {
    // Only initialize if no page-specific initialization has been done
    if (!window.adminNavbarInitialized) {
        initializeAdminNavbar();
        window.adminNavbarInitialized = true;
    }
});