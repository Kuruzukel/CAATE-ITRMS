/**
 * CAATE Login Page JavaScript
 * Handles login form functionality and password visibility toggle
 */

// API Base URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/backend/public';

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('bx-hide');
        toggleIcon.classList.add('bx-show');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('bx-show');
        toggleIcon.classList.add('bx-hide');
    }
}

// Show loading state
function showLoading(button) {
    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...';
}

// Reset button state
function resetButton(button) {
    button.disabled = false;
    button.innerHTML = 'Sign in';
}

// Show error message
function showError(message) {
    const form = document.getElementById('formAuthentication');

    // Remove existing alerts
    const existingAlert = form.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create new alert
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.role = 'alert';
    alert.innerHTML = `
        <strong>Error!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    form.insertBefore(alert, form.firstChild);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

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
            const submitButton = loginForm.querySelector('button[type="submit"]');

            // Validation
            if (!identifier) {
                showError('Please enter your email or username');
                emailInput.focus();
                return;
            }

            if (!password) {
                showError('Please enter your password');
                passwordInput.focus();
                return;
            }

            // Show loading state
            showLoading(submitButton);

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

                    // Redirect based on role using absolute paths from root
                    const baseUrl = window.location.origin + '/CAATE-ITRMS';

                    if (result.role === 'admin') {
                        window.location.href = baseUrl + '/admin/src/pages/dashboard.html';
                    } else if (result.role === 'trainee') {
                        window.location.href = baseUrl + '/trainee/src/pages/dashboard.html';
                    } else {
                        showError('Unknown user role');
                        resetButton(submitButton);
                    }
                } else {
                    showError(result.error || 'Login failed. Please try again.');
                    resetButton(submitButton);
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('Connection error. Please check if the server is running.');
                resetButton(submitButton);
            }
        });
    }
});
