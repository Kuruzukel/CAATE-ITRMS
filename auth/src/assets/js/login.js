/**
 * CAATE Login Page JavaScript
 * Handles login form functionality and password visibility toggle
 */

// API Base URL - works for both localhost and network access
const API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public';

// Toast notification function
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    // Set icon based on type
    let icon = '';
    if (type === 'success') {
        icon = '<i class="bx bx-check-circle"></i>';
    } else if (type === 'error') {
        icon = '<i class="bx bx-error-circle"></i>';
    } else if (type === 'info') {
        icon = '<i class="bx bx-info-circle"></i>';
    }

    toast.innerHTML = `
        <div class="toast-content">
            ${icon}
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds for info, 3 seconds for others
    const duration = type === 'info' ? 5000 : 3000;
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 200);
    }, duration);
}


// Close toast notification - MUST be global for onclick to work
window.closeToast = function (button) {
    const toast = button.closest('.toast-notification');
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 200);
    }
};

// Form validation and submission
document.addEventListener('DOMContentLoaded', function () {
    // Clear any existing session data when arriving at login page
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    sessionStorage.clear();

    // Prevent back button to cached authenticated pages
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', function () {
        window.history.pushState(null, '', window.location.href);
    });

    const loginForm = document.getElementById('formAuthentication');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember-me');

    // Remove any required attribute from remember-me checkbox
    if (rememberMeCheckbox) {
        rememberMeCheckbox.removeAttribute('required');
    }

    // Load saved credentials if "Remember Me" was checked
    loadSavedCredentials();

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const identifier = emailInput.value.trim();
            const password = passwordInput.value;
            const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;

            // Validation - check each field independently
            if (!identifier && !password) {
                showToast('Please enter your email/username and password', 'error');
                emailInput.focus();
                return;
            }

            if (!identifier) {
                showToast('Please enter your email or username', 'error');
                emailInput.focus();
                return;
            }

            if (!password) {
                showToast('Please enter your password', 'error');
                passwordInput.focus();
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        identifier: identifier,
                        password: password
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Handle "Remember Me" functionality
                    if (rememberMe) {
                        saveCredentials(identifier, password);
                    } else {
                        clearSavedCredentials();
                    }

                    // Store authentication data
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('userRole', result.role);
                    localStorage.setItem('userData', JSON.stringify(result.user));

                    // Redirect immediately - no toast needed
                    const baseUrl = window.location.origin + '/CAATE-ITRMS';

                    if (result.role === 'admin') {
                        window.location.href = baseUrl + '/admin/src/pages/dashboard.html';
                    } else if (result.role === 'trainee') {
                        window.location.href = baseUrl + '/trainee/src/pages/dashboard.html';
                    } else {
                        showToast('Unknown user role', 'error');
                    }
                } else {
                    // Handle authentication failure - user doesn't exist or wrong credentials
                    showToast('User does not exist or invalid credentials', 'error');
                }
            } catch (error) {
                showToast('Connection error. Please check if the server is running.', 'error');
            }
        });
    }
});

/**
 * Save credentials to localStorage (encrypted with base64)
 */
function saveCredentials(identifier, password) {
    try {
        // Simple encoding (base64) - NOT secure encryption, just obfuscation
        const encodedIdentifier = btoa(identifier);
        const encodedPassword = btoa(password);

        localStorage.setItem('rememberedUser', encodedIdentifier);
        localStorage.setItem('rememberedPass', encodedPassword);
        localStorage.setItem('rememberMe', 'true');
    } catch (error) {
        console.error('Error saving credentials:', error);
    }
}

/**
 * Load saved credentials from localStorage
 */
function loadSavedCredentials() {
    try {
        const rememberMe = localStorage.getItem('rememberMe');

        if (rememberMe === 'true') {
            const encodedIdentifier = localStorage.getItem('rememberedUser');
            const encodedPassword = localStorage.getItem('rememberedPass');

            if (encodedIdentifier && encodedPassword) {
                // Decode the credentials
                const identifier = atob(encodedIdentifier);
                const password = atob(encodedPassword);

                // Fill in the form
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');
                const rememberMeCheckbox = document.getElementById('remember-me');

                if (emailInput) emailInput.value = identifier;
                if (passwordInput) passwordInput.value = password;
                if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
            }
        }
    } catch (error) {
        console.error('Error loading credentials:', error);
        clearSavedCredentials();
    }
}

/**
 * Clear saved credentials from localStorage
 */
function clearSavedCredentials() {
    localStorage.removeItem('rememberedUser');
    localStorage.removeItem('rememberedPass');
    localStorage.removeItem('rememberMe');
}
