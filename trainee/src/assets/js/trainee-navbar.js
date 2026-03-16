/**
 * Trainee Navbar - Common navbar functionality for trainee pages
 * Handles authentication check and real data fetching for navbar dropdown
 */

// API Base URL - Check if already defined globally to avoid conflicts
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost/CAATE-ITRMS/backend/public'
        : '/backend/public';
}

// Use window.API_BASE_URL directly to avoid redeclaration conflicts

// Cache for trainee data to avoid repeated API calls
let traineeDataCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Load trainee profile data for navbar
 */
async function loadTraineeProfileForNavbar() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const userData = localStorage.getItem('userData');

        if (!token || !userId) {
            window.location.href = '../../../auth/src/pages/login.html';
            return null;
        }

        // Check if we have valid cached data
        if (traineeDataCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
            updateNavbarWithData(traineeDataCache);
            return traineeDataCache;
        }

        // Try to get user data from localStorage first
        let traineeData = null;
        if (userData) {
            try {
                traineeData = JSON.parse(userData);
                updateNavbarWithData(traineeData);
                return traineeData;
            } catch (e) {
                // Error parsing userData, continue to API fetch
            }
        }

        // Fetch from API with fallback strategy
        try {
            // Try general users endpoint first
            let response = await fetch(`${window.API_BASE_URL}/api/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Try trainee-specific endpoint
                response = await fetch(`${window.API_BASE_URL}/api/v1/trainees/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.ok) {
                const result = await response.json();
                traineeData = result.data || result.user || result;

                console.log('Raw trainee data from API:', traineeData); // Debug log

                // Map the data to consistent format
                const firstName = traineeData.firstName || traineeData.first_name || '';
                const secondName = traineeData.secondName || traineeData.second_name || '';
                const middleName = traineeData.middleName || traineeData.middle_name || '';
                const lastName = traineeData.lastName || traineeData.last_name || '';
                const suffix = traineeData.suffix || '';

                // Build complete full name with all parts
                const nameParts = [firstName, secondName, middleName, lastName, suffix].filter(part => part.trim() !== '');
                const fullName = nameParts.join(' ').trim();

                console.log('Extracted names:', { firstName, secondName, middleName, lastName, suffix, fullName }); // Debug log

                let displayName = 'Trainee';
                if (fullName && fullName !== '') {
                    displayName = fullName;
                } else if (traineeData.name && traineeData.name.trim()) {
                    displayName = traineeData.name.trim();
                } else if (traineeData.username || traineeData.trainee_id) {
                    displayName = (traineeData.username || traineeData.trainee_id || '').trim();
                }

                console.log('Final display name:', displayName); // Debug log

                const mappedData = {
                    _id: traineeData._id || traineeData.id,
                    name: displayName,
                    email: traineeData.email || '',
                    username: traineeData.username || traineeData.trainee_id || '',
                    role: 'trainee',
                    firstName: firstName,
                    secondName: secondName,
                    middleName: middleName,
                    lastName: lastName,
                    suffix: suffix,
                    profileImage: traineeData.profileImage || traineeData.profile_image || null,
                    profile_image: traineeData.profile_image || traineeData.profileImage || null
                };

                // Cache the data
                traineeDataCache = mappedData;
                cacheTimestamp = Date.now();

                updateNavbarWithData(mappedData);
                return mappedData;

            } else {
                throw new Error('Failed to fetch from API');
            }

        } catch (apiError) {
            console.error('API fetch failed:', apiError);

            // Fallback: use data from localStorage
            if (userData) {
                try {
                    const fallbackData = JSON.parse(userData);
                    // Build full name first, then fallback to other options
                    const firstName = fallbackData.firstName || fallbackData.first_name || '';
                    const secondName = fallbackData.secondName || fallbackData.second_name || '';
                    const middleName = fallbackData.middleName || fallbackData.middle_name || '';
                    const lastName = fallbackData.lastName || fallbackData.last_name || '';
                    const suffix = fallbackData.suffix || '';

                    // Build complete full name with all parts
                    const nameParts = [firstName, secondName, middleName, lastName, suffix].filter(part => part.trim() !== '');
                    const fullName = nameParts.join(' ').trim();

                    let displayName = 'Trainee';
                    if (fullName && fullName !== '') {
                        displayName = fullName;
                    } else if (fallbackData.name && fallbackData.name.trim()) {
                        displayName = fallbackData.name.trim();
                    } else if (fallbackData.username || fallbackData.trainee_id) {
                        displayName = (fallbackData.username || fallbackData.trainee_id).trim();
                    }

                    const mappedData = {
                        name: displayName,
                        email: fallbackData.email || '',
                        username: fallbackData.username || fallbackData.trainee_id || '',
                        role: 'trainee',
                        firstName: firstName,
                        secondName: secondName,
                        middleName: middleName,
                        lastName: lastName,
                        suffix: suffix,
                        profileImage: fallbackData.profileImage || fallbackData.profile_image || null,
                        profile_image: fallbackData.profile_image || fallbackData.profileImage || null
                    };
                    updateNavbarWithData(mappedData);
                    return mappedData;
                } catch (e) {
                    console.error('Failed to parse localStorage userData:', e);
                }
            }

            // Final fallback
            const defaultData = { name: 'Trainee', email: '', role: 'trainee' };
            updateNavbarWithData(defaultData);
            return defaultData;
        }

    } catch (error) {
        console.error('Error loading trainee profile for navbar:', error);

        // Final fallback
        const defaultData = { name: 'Trainee', email: '', role: 'trainee' };
        updateNavbarWithData(defaultData);
        return defaultData;
    }
}

/**
 * Update navbar elements with trainee data
 */
function updateNavbarWithData(data) {
    try {
        // Determine the display name - prioritize full name, then username, then fallback
        let displayName = 'Trainee';

        // First try to build full name from all available name parts
        const firstName = data.firstName || data.first_name || '';
        const secondName = data.secondName || data.second_name || '';
        const middleName = data.middleName || data.middle_name || '';
        const lastName = data.lastName || data.last_name || '';
        const suffix = data.suffix || '';

        // Build complete full name with all parts
        const nameParts = [firstName, secondName, middleName, lastName, suffix].filter(part => part.trim() !== '');
        const fullName = nameParts.join(' ').trim();

        if (fullName && fullName !== '') {
            displayName = fullName;
        } else if (data.name && data.name.trim()) {
            displayName = data.name.trim();
        } else if (data.username && data.username.trim()) {
            displayName = data.username.trim();
        }

        // Update user name in dropdown and welcome messages
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            if (element) {
                element.textContent = displayName;
            }
        });

        // Update welcome messages specifically
        const welcomeElements = document.querySelectorAll('.welcome-user-name, .dashboard-welcome .user-name');
        welcomeElements.forEach(element => {
            if (element) {
                element.textContent = displayName;
            }
        });

        // Update profile images using the global function
        const imagePath = data.profileImage || data.profile_image;
        window.updateTraineeProfileImages(imagePath);

        // Store the display name globally for other scripts to use
        window.currentTraineeDisplayName = displayName;

    } catch (error) {
        console.error('Error updating navbar:', error);
    }
}

/**
 * Check authentication for trainee pages
 */
function checkTraineeAuthentication() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '../../../auth/src/pages/login.html';
        return false;
    }

    if (userRole !== 'trainee') {
        // Redirect to appropriate dashboard based on role
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'admin') {
            window.location.href = baseUrl + '/admin/src/pages/dashboard.html';
        } else {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = baseUrl + '/auth/src/pages/login.html';
        }
        return false;
    }

    return true;
}

/**
 * Initialize trainee navbar
 */
function initializeTraineeNavbar() {
    // Check authentication first
    if (!checkTraineeAuthentication()) {
        return;
    }

    // Load profile data for navbar
    loadTraineeProfileForNavbar();

    // Override auth-dashboard.js updates
    overrideAuthDashboardUpdates();

    // Ensure menu dropdowns work properly
    ensureMenuDropdownsWork();
}

/**
 * Override auth-dashboard.js user name updates with real data
 */
function overrideAuthDashboardUpdates() {
    // Use requestAnimationFrame for better performance instead of setTimeout
    requestAnimationFrame(() => {
        loadTraineeProfileForNavbar();
    });

    // Debounced mutation observer to prevent excessive calls
    let debounceTimer;
    const observer = new MutationObserver((mutations) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            let shouldUpdate = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Check if any user-name elements were updated with placeholder text
                    const userNameElements = document.querySelectorAll('.user-name');
                    userNameElements.forEach(element => {
                        if (element && (
                            element.textContent === 'dsad  sdasd' ||
                            element.textContent === 'dsad sdasd' ||
                            element.textContent.trim() === 'Trainee' ||
                            element.textContent.trim() === 'Loading...' ||
                            element.textContent.trim() === '' ||
                            element.textContent.includes('dsad') // Catch any variation of the placeholder
                        )) {
                            shouldUpdate = true;
                        }
                    });
                }
            });

            if (shouldUpdate) {
                requestAnimationFrame(() => {
                    loadTraineeProfileForNavbar();
                });
            }
        }, 50); // Reduced debounce time
    });

    // Start observing with more specific options
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}


// Function to refresh navbar data (can be called from other pages)
window.refreshTraineeNavbar = function () {
    loadTraineeProfileForNavbar();
};

// Initialize after menu system is ready
document.addEventListener('DOMContentLoaded', function () {
    // Wait for menu system to initialize first
    setTimeout(() => {
        initializeTraineeNavbar();
    }, 100);

    // Listen for profile updates from other pages
    window.addEventListener('storage', function (e) {
        if (e.key === 'userData' && e.newValue) {
            try {
                const userData = JSON.parse(e.newValue);
                updateNavbarWithData(userData);
            } catch (error) {
                console.warn('Failed to parse updated user data');
            }
        }
    });
});

/**
 * Ensure menu dropdowns work properly
 */
function ensureMenuDropdownsWork() {
    // Wait for menu system to be fully initialized
    setTimeout(() => {
        // Re-initialize menu if needed - DISABLED to prevent conflicts with main menu system
        /*
        if (window.Helpers && window.Helpers.mainMenu) {
            // Menu is already initialized, just ensure it's working
            const menuToggles = document.querySelectorAll('.menu-toggle');
            menuToggles.forEach(toggle => {
                if (!toggle.hasAttribute('data-menu-initialized')) {
                    toggle.setAttribute('data-menu-initialized', 'true');
                    toggle.addEventListener('click', function (e) {
                        e.preventDefault();
                        const submenu = this.nextElementSibling;
                        if (submenu && submenu.classList.contains('menu-sub')) {
                            const isOpen = submenu.style.display === 'block';

                            // Close all other submenus first
                            const allSubmenus = document.querySelectorAll('.menu-sub');
                            const allToggles = document.querySelectorAll('.menu-toggle');

                            allSubmenus.forEach(sub => {
                                if (sub !== submenu) {
                                    sub.style.display = 'none';
                                }
                            });

                            allToggles.forEach(tog => {
                                if (tog !== this) {
                                    tog.classList.remove('open');
                                    tog.parentElement.classList.remove('open');
                                }
                            });

                            // Toggle current submenu
                            submenu.style.display = isOpen ? 'none' : 'block';
                            this.classList.toggle('open', !isOpen);
                            this.parentElement.classList.toggle('open', !isOpen);
                        }
                    });
                }
            });
        }
        */
    }, 50);
}

// Global function to refresh user display name across all pages
window.refreshUserDisplayName = function () {
    loadTraineeProfileForNavbar();
};

// Function to manually update display name (useful for testing or immediate updates)
window.updateUserDisplayName = function (displayName) {
    if (displayName && displayName.trim()) {
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            if (element) {
                element.textContent = displayName.trim();
            }
        });

        const welcomeElements = document.querySelectorAll('.welcome-user-name, .dashboard-welcome .user-name');
        welcomeElements.forEach(element => {
            if (element) {
                element.textContent = displayName.trim();
            }
        });

        window.currentTraineeDisplayName = displayName.trim();
    }
};

// Function to immediately fix placeholder text on page load
function fixPlaceholderText() {
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        if (element && (
            element.textContent === 'dsad  sdasd' ||
            element.textContent === 'dsad sdasd' ||
            element.textContent.includes('dsad')
        )) {
            element.textContent = 'Loading...';
            // Trigger immediate data load
            loadTraineeProfileForNavbar();
        }
    });
}

// Run the fix immediately when script loads
fixPlaceholderText();

// Also run it when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(fixPlaceholderText, 100);
});

// Force refresh user display name from localStorage (useful for immediate updates)
window.forceRefreshUserName = function () {
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);

            // Build complete full name with all parts
            const firstName = user.firstName || user.first_name || '';
            const secondName = user.secondName || user.second_name || '';
            const middleName = user.middleName || user.middle_name || '';
            const lastName = user.lastName || user.last_name || '';
            const suffix = user.suffix || '';

            const nameParts = [firstName, secondName, middleName, lastName, suffix].filter(part => part.trim() !== '');
            const fullName = nameParts.join(' ').trim();

            let displayName = 'Trainee';
            if (fullName && fullName !== '') {
                displayName = fullName;
            } else if (user.name && user.name.trim()) {
                displayName = user.name.trim();
            } else if (user.username && user.username.trim()) {
                displayName = user.username.trim();
            }

            // console.log('Force refreshing display name to:', displayName);

            // Update all user name elements
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(element => {
                if (element) {
                    element.textContent = displayName;
                }
            });

            const welcomeElements = document.querySelectorAll('.welcome-user-name, .dashboard-welcome .user-name');
            welcomeElements.forEach(element => {
                if (element) {
                    element.textContent = displayName;
                }
            });

            window.currentTraineeDisplayName = displayName;

        } catch (e) {
            console.error('Error force refreshing user name:', e);
        }
    }
};
// Listen for profile updates from manage-profile page
window.addEventListener('storage', function (e) {
    if (e.key === 'userData' && e.newValue) {
        // console.log('User data updated in localStorage, refreshing display name...');
        setTimeout(() => {
            window.forceRefreshUserName();
        }, 100);
    }
});

// Also listen for custom profile update events
window.addEventListener('profileUpdated', function (e) {
    // console.log('Profile updated event received, refreshing display name...');
    setTimeout(() => {
        window.forceRefreshUserName();
    }, 100);
});
// Global function to update profile images across all trainee pages
window.updateTraineeProfileImages = function (imagePath) {
    const profileImageSelectors = [
        '#profileImage', // Main profile image
        '.navbar .avatar img',
        '.dropdown-menu .avatar img',
        '.navbar-dropdown .avatar img',
        '.navbar img[src*="DEFAULT_AVATAR"]',
        '.navbar img[alt=""]',
        'img.w-px-40.h-auto.rounded-circle',
        '.navbar img.rounded-circle',
        '.dropdown-menu img.w-px-40',
        '.dropdown-menu img.rounded-circle',
        '.avatar img', // Generic avatar images
        'img[alt="Profile Picture"]' // Specific profile picture images
    ];

    let totalUpdated = 0;
    profileImageSelectors.forEach(selector => {
        const images = document.querySelectorAll(selector);
        images.forEach(img => {
            if (img) {
                // Check if we have a valid uploaded image path
                if (imagePath &&
                    imagePath !== '../assets/images/DEFAULT_AVATAR.png' &&
                    imagePath !== 'DEFAULT_AVATAR.png' &&
                    !imagePath.includes('DEFAULT_AVATAR')) {

                    // Handle different path formats for uploaded images
                    if (imagePath.startsWith('/CAATE-ITRMS/')) {
                        img.src = window.location.origin + imagePath;
                    } else if (imagePath.startsWith('http')) {
                        img.src = imagePath;
                    } else if (imagePath.startsWith('/')) {
                        img.src = window.location.origin + imagePath;
                    } else {
                        // Assume it's a filename and construct the full path
                        img.src = `${window.location.origin}/CAATE-ITRMS/backend/public/uploads/profiles/${imagePath}`;
                    }
                    totalUpdated++;
                } else {
                    // Use default avatar for empty or default paths
                    img.src = '../assets/images/DEFAULT_AVATAR.png';
                }

                // Add error handling to fallback to default avatar
                img.onerror = function () {
                    this.src = '../assets/images/DEFAULT_AVATAR.png';
                };
            }
        });
    });

    // console.log(`Updated ${totalUpdated} profile images across page with path: ${imagePath}`);
};

// Listen for profile image updates from other pages
window.addEventListener('profileImageUpdated', function (e) {
    if (e.detail && e.detail.imagePath) {
        // console.log('Profile image updated event received:', e.detail.imagePath);
        window.updateTraineeProfileImages(e.detail.imagePath);
    }
});

// Listen for storage changes to update profile images
window.addEventListener('storage', function (e) {
    if (e.key === 'userData' && e.newValue) {
        try {
            const userData = JSON.parse(e.newValue);
            if (userData.profileImage || userData.profile_image) {
                window.updateTraineeProfileImages(userData.profileImage || userData.profile_image);
            }
        } catch (error) {
            console.warn('Failed to parse updated user data for profile image');
        }
    }
});

// Duplicate function removed - using the first implementation above

// Listen for profile image updates from other pages
window.addEventListener('profileImageUpdated', function (event) {
    if (event.detail && event.detail.imagePath) {
        window.updateTraineeProfileImages(event.detail.imagePath);
    }
});

// Listen for storage changes to sync profile images across tabs
window.addEventListener('storage', function (event) {
    if (event.key === 'userData' && event.newValue) {
        try {
            const userData = JSON.parse(event.newValue);
            const imagePath = userData.profileImage || userData.profile_image;
            if (imagePath) {
                window.updateTraineeProfileImages(imagePath);
            }
        } catch (e) {
            console.error('Failed to parse userData from storage event:', e);
        }
    }
});