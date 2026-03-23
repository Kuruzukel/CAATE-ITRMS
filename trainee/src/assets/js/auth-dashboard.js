/**
 * Trainee Dashboard Authentication
 * Handles authentication, session management, and back button prevention
 */

// Immediate authentication check (runs before DOM loads)
(function immediateAuthCheck() {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
        localStorage.clear();
        sessionStorage.clear();
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        window.location.replace(baseUrl + '/auth/src/pages/login.html');
        return;
    }

    // Check if user has correct role for this page
    const pageRole = 'trainee'; // This is trainee dashboard
    if (userRole !== pageRole) {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'admin') {
            window.location.replace(baseUrl + '/admin/src/pages/dashboard.html');
        } else {
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace(baseUrl + '/auth/src/pages/login.html');
        }
    }
})();

// API Base URL - Use global API_BASE_URL if available
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public';
}
// Use window.API_BASE_URL directly to avoid redeclaration conflicts

/**
 * Check if user is authenticated (synchronous for immediate blocking)
 */
function checkAuthentication(requiredRole = null) {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
        redirectToLogin();
        return false;
    }

    if (requiredRole && userRole !== requiredRole) {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'admin') {
            window.location.href = baseUrl + '/admin/src/pages/dashboard.html';
        } else if (userRole === 'trainee') {
            window.location.href = baseUrl + '/trainee/src/pages/dashboard.html';
        } else {
            redirectToLogin();
        }
        return false;
    }
    return true;
}

/**
 * Redirect to login page
 */
function redirectToLogin() {
    // Clear all storage immediately
    localStorage.clear();
    sessionStorage.clear();

    const baseUrl = window.location.origin + '/CAATE-ITRMS';
    // Use replace to prevent back button navigation
    window.location.replace(baseUrl + '/auth/src/pages/login.html');
}

/**
 * Get current user data
 */
function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Logout function
 */
async function logout() {
    const token = localStorage.getItem('authToken');

    // Clear all storage completely (including "Remember Me" credentials to prevent password manager popups)
    localStorage.clear();
    sessionStorage.clear();

    try {
        await fetch(`${window.API_BASE_URL}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    // Prevent back button access after logout
    window.history.pushState(null, '', window.location.href);

    const baseUrl = window.location.origin + '/CAATE-ITRMS';
    // Use replace to prevent going back to dashboard
    window.location.replace(baseUrl + '/auth/src/pages/login.html');
}

/**
 * Comprehensive browser cache prevention
 */
(function preventBackButtonAccess() {
    // Immediately check authentication on script load
    const pageRole = document.body.getAttribute('data-required-role');
    if (!checkAuthentication(pageRole)) {
        return; // Stop execution if not authenticated
    }

    // Disable browser back button
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', function (event) {
        window.history.pushState(null, '', window.location.href);

        // Immediately check authentication
        const token = localStorage.getItem('authToken');
        if (!token) {
            event.preventDefault();
            event.stopPropagation();
            redirectToLogin();
            return false;
        }

        const pageRole = document.body.getAttribute('data-required-role');
        if (!checkAuthentication(pageRole)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    });

    // Prevent back/forward cache (bfcache)
    window.addEventListener('pageshow', function (event) {
        if (event.persisted || performance.navigation.type === 2) {
            // Page loaded from bfcache or back button - check auth immediately
            const token = localStorage.getItem('authToken');
            if (!token) {
                redirectToLogin();
                return;
            }
            // Force reload to ensure fresh state
            window.location.reload();
        }
    });

    // Re-validate session when page becomes visible
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                redirectToLogin();
                return;
            }
            const pageRole = document.body.getAttribute('data-required-role');
            checkAuthentication(pageRole);
        }
    });

    // Check on every focus
    window.addEventListener('focus', function () {
        const token = localStorage.getItem('authToken');
        if (!token) {
            redirectToLogin();
        }
    });
})();

/**
 * Initialize authentication on page load
 */
document.addEventListener('DOMContentLoaded', function () {
    const pageRole = document.body.getAttribute('data-required-role');
    checkAuthentication(pageRole);

    // Clear stored password data to prevent Google Password Manager popup
    if (localStorage.getItem('rememberedPass')) {
        localStorage.removeItem('rememberedPass');
    }

    // Load user data immediately
    loadUserDataForDisplay();

    document.querySelectorAll('[data-logout]').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    });
});

/**
 * Load and display user data immediately
 */
function loadUserDataForDisplay() {
    const user = getCurrentUser();
    if (user) {
        // Determine display name - prioritize full name, then username
        let displayName = 'Trainee';

        // First try to build full name from all available name parts
        const firstName = user.firstName || user.first_name || '';
        const secondName = user.secondName || user.second_name || '';
        const middleName = user.middleName || user.middle_name || '';
        const lastName = user.lastName || user.last_name || '';
        const suffix = user.suffix || '';

        // Build complete full name with all parts
        const nameParts = [firstName, secondName, middleName, lastName, suffix].filter(part => part.trim() !== '');
        const fullName = nameParts.join(' ').trim();

        if (fullName && fullName !== '') {
            displayName = fullName;
        } else if (user.name && user.name.trim()) {
            displayName = user.name.trim();
        } else if (user.username && user.username.trim()) {
            displayName = user.username.trim();
        }

        // Update all user name elements
        document.querySelectorAll('.user-name').forEach(el => {
            if (el) el.textContent = displayName;
        });

        // Update email elements
        document.querySelectorAll('.user-email').forEach(el => {
            if (el) el.textContent = user.email || '';
        });

        // Update avatar images with profile image if available
        const profileImage = user.profile_image || user.profileImage || '';
        if (profileImage) {
            document.querySelectorAll('.avatar img').forEach(img => {
                if (img) {
                    img.src = profileImage;
                    img.onerror = function () {
                        this.src = '../assets/images/DEFAULT_AVATAR.png';
                    };
                }
            });
        }

        // Store globally for other scripts
        window.currentTraineeDisplayName = displayName;
    }
}
