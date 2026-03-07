/**
 * Admin Dashboard Authentication
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
    const pageRole = 'admin'; // This is admin dashboard
    if (userRole !== pageRole) {
        const baseUrl = window.location.origin + '/CAATE-ITRMS';
        if (userRole === 'trainee') {
            window.location.replace(baseUrl + '/trainee/src/pages/dashboard.html');
        } else {
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace(baseUrl + '/auth/src/pages/login.html');
        }
    }
})();

// API Base URL - Works for both localhost and network access
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/backend/public';

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

    // Clear all storage first
    localStorage.clear();
    sessionStorage.clear();

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

    const baseUrl = window.location.origin + '/CAATE-ITRMS';

    // Clear browser history and redirect
    window.history.pushState(null, '', window.location.href);
    window.location.replace(baseUrl + '/auth/src/pages/login.html');
}

/**
 * Prevent back button access - IIFE that runs immediately
 */
(function () {
    'use strict';

    // Check auth immediately when script loads
    const token = localStorage.getItem('authToken');
    if (!token) {
        redirectToLogin();
        return;
    }

    // Prevent back button by manipulating history
    function preventBackButton() {
        window.history.pushState(null, '', window.location.href);
    }

    // Call immediately
    preventBackButton();

    // Handle popstate (back/forward button)
    window.addEventListener('popstate', function (event) {
        preventBackButton();

        // Check if user is still authenticated
        const token = localStorage.getItem('authToken');
        if (!token) {
            redirectToLogin();
        }
    });

    // Handle page show (detects bfcache)
    window.addEventListener('pageshow', function (event) {
        // Check if page was loaded from cache
        if (event.persisted) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                redirectToLogin();
            } else {
                // Force reload to get fresh state
                window.location.reload();
            }
        }
    });

    // Re-validate when page becomes visible
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                redirectToLogin();
            }
        }
    });

    // Re-validate when window gains focus
    window.addEventListener('focus', function () {
        const token = localStorage.getItem('authToken');
        if (!token) {
            redirectToLogin();
        }
    });
})();

/**
 * Initialize on DOM ready
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
