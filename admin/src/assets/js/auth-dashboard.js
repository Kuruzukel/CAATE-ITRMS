/**
 * Admin Dashboard Authentication
 * Handles authentication, session management, and back button prevention
 */

// API Base URL - Works for both localhost and network access
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/backend/public';

/**
 * Check if user is authenticated
 */
async function checkAuthentication(requiredRole = null) {
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    const baseUrl = window.location.origin + '/CAATE-ITRMS';
    window.location.href = baseUrl + '/auth/src/pages/login.html';
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
    try {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    // Clear all storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    sessionStorage.clear();

    // Prevent back button access after logout
    window.history.pushState(null, '', window.location.href);

    const baseUrl = window.location.origin + '/CAATE-ITRMS';
    window.location.replace(baseUrl + '/auth/src/pages/login.html');
}

/**
 * Comprehensive browser cache prevention
 */
(function preventBackButtonAccess() {
    // Disable browser caching
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', function () {
        window.history.pushState(null, '', window.location.href);
        const pageRole = document.body.getAttribute('data-required-role');
        if (!checkAuthentication(pageRole)) {
            redirectToLogin();
        }
    });

    // Prevent back/forward cache (bfcache)
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            // Page loaded from bfcache - force reload
            window.location.reload();
        }
    });

    // Re-validate session when page becomes visible
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            const pageRole = document.body.getAttribute('data-required-role');
            checkAuthentication(pageRole);
        }
    });

    // Prevent caching on unload
    window.addEventListener('beforeunload', function () {
        // Mark that we're leaving the page
        sessionStorage.setItem('navigatingAway', 'true');
    });

    // Check if we came back via back button
    window.addEventListener('load', function () {
        if (sessionStorage.getItem('navigatingAway') === 'true') {
            sessionStorage.removeItem('navigatingAway');
            const pageRole = document.body.getAttribute('data-required-role');
            checkAuthentication(pageRole);
        }
    });
})();

/**
 * Initialize authentication on page load
 */
document.addEventListener('DOMContentLoaded', function () {
    const pageRole = document.body.getAttribute('data-required-role');
    checkAuthentication(pageRole);

    const user = getCurrentUser();
    if (user) {
        document.querySelectorAll('.user-name').forEach(el => el.textContent = user.name);
        document.querySelectorAll('.user-email').forEach(el => el.textContent = user.email);
    }

    document.querySelectorAll('[data-logout]').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    });
});
