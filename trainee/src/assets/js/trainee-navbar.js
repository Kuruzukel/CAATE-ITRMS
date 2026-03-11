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
                    name: traineeData.name || `${traineeData.firstName || ''} ${traineeData.lastName || ''}`.trim() || 'Trainee',
                    email: traineeData.email || '',
                    username: traineeData.username || '',
                    role: 'trainee',
                    firstName: traineeData.firstName || '',
                    lastName: traineeData.lastName || '',
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
                        name: fallbackData.name || `${fallbackData.firstName || ''} ${fallbackData.lastName || ''}`.trim() || 'Trainee',
                        email: fallbackData.email || '',
                        username: fallbackData.username || '',
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
        // Update user name in dropdown and welcome messages
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            if (element) {
                element.textContent = data.name || 'Trainee';
            }
        });

        // Update profile images (use default avatar)
        const profileImages = document.querySelectorAll('img[src*="DEFAULT_AVATAR"], img[alt=""], .avatar img');
        profileImages.forEach(img => {
            if (img) {
                img.src = '../assets/images/DEFAULT_AVATAR.png';
                img.onerror = function () {
                    this.src = '../assets/images/DEFAULT_AVATAR.png';
                };
            }
        });

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
}

/**
 * Override auth-dashboard.js user name updates with real data
 */
function overrideAuthDashboardUpdates() {
    // Wait a bit for auth-dashboard.js to load and run
    setTimeout(() => {
        loadTraineeProfileForNavbar();
    }, 500);

    // Also override on DOM mutations (when auth-dashboard.js updates elements)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                // Check if any user-name elements were updated with placeholder text
                const userNameElements = document.querySelectorAll('.user-name');
                userNameElements.forEach(element => {
                    if (element && (element.textContent === 'dsad  sdasd' || element.textContent === 'dsad sdasd' || element.textContent.trim() === 'Trainee')) {
                        // Re-load real data
                        setTimeout(() => {
                            loadTraineeProfileForNavbar();
                        }, 100);
                    }
                });
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeTraineeNavbar();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTraineeNavbar);
} else {
    initializeTraineeNavbar();
}