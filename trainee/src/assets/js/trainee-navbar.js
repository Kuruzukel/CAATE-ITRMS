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

                // Map the data to consistent format
                const mappedData = {
                    _id: traineeData._id || traineeData.id,
                    name: traineeData.name || `${traineeData.firstName || traineeData.first_name || ''} ${traineeData.lastName || traineeData.last_name || ''}`.trim() || 'Trainee',
                    email: traineeData.email || '',
                    username: traineeData.username || traineeData.trainee_id || '',
                    role: 'trainee',
                    firstName: traineeData.firstName || traineeData.first_name || '',
                    lastName: traineeData.lastName || traineeData.last_name || '',
                    profileImage: traineeData.profileImage || null
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
                    const mappedData = {
                        name: fallbackData.name || `${fallbackData.firstName || fallbackData.first_name || ''} ${fallbackData.lastName || fallbackData.last_name || ''}`.trim() || 'Trainee',
                        email: fallbackData.email || '',
                        username: fallbackData.username || fallbackData.trainee_id || '',
                        role: 'trainee'
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
        // Determine the display name - prioritize username, then full name, then fallback
        let displayName = 'Trainee';
        if (data.username && data.username.trim()) {
            displayName = data.username.trim();
        } else if (data.name && data.name.trim()) {
            displayName = data.name.trim();
        } else if (data.firstName || data.lastName) {
            displayName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
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

        // Update profile images - handle both default and uploaded images
        const profileImages = document.querySelectorAll('img[src*="DEFAULT_AVATAR"], img[alt=""], .avatar img');
        profileImages.forEach(img => {
            if (img) {
                if (data.profileImage && data.profileImage !== '../assets/images/DEFAULT_AVATAR.png') {
                    // Handle both relative and absolute paths
                    if (data.profileImage.startsWith('/CAATE-ITRMS/')) {
                        img.src = window.location.origin + data.profileImage;
                    } else if (data.profileImage.startsWith('http')) {
                        img.src = data.profileImage;
                    } else {
                        img.src = data.profileImage;
                    }
                } else {
                    img.src = '../assets/images/DEFAULT_AVATAR.png';
                }

                img.onerror = function () {
                    this.src = '../assets/images/DEFAULT_AVATAR.png';
                };
            }
        });

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
                            element.textContent.trim() === ''
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
        // Re-initialize menu if needed
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
                            submenu.style.display = isOpen ? 'none' : 'block';
                            this.classList.toggle('open', !isOpen);
                        }
                    });
                }
            });
        }
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