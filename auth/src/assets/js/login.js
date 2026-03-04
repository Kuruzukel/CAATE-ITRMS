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

    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 200);
    }, 3000);
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
    const loginForm = document.getElementById('formAuthentication');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const identifier = emailInput.value.trim();
            const password = passwordInput.value;

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
