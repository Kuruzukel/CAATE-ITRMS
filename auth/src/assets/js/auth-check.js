/**
 * Authentication Check
 * Protects pages that require authentication
 */

// API Base URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/backend/public';

// Check if user is authenticated
async function checkAuthentication(requiredRole = null) {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
        redirectToLogin();
        return false;
    }

    // If a specific role is required, check it
    if (requiredRole && userRole !== requiredRole) {
        // Redirect to appropriate dashboard
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

// Redirect to login page
function redirectToLogin() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    const baseUrl = window.location.origin + '/CAATE-ITRMS';
    window.location.href = baseUrl + '/auth/src/pages/login.html';
}

// Get current user data
function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Logout function
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

    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');

    // Redirect to login using absolute path
    const baseUrl = window.location.origin + '/CAATE-ITRMS';
    window.location.href = baseUrl + '/auth/src/pages/login.html';
}

// Initialize authentication check on page load
document.addEventListener('DOMContentLoaded', function () {
    // Get the required role from the page (if specified)
    const pageRole = document.body.getAttribute('data-required-role');

    // Check authentication
    checkAuthentication(pageRole);

    // Update user info in navbar if element exists
    const user = getCurrentUser();
    if (user) {
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = user.name;
        });

        const userEmailElements = document.querySelectorAll('.user-email');
        userEmailElements.forEach(el => {
            el.textContent = user.email;
        });
    }

    // Attach logout handlers
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    });
});
