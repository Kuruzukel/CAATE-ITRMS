/**
 * CAATE Register Page JavaScript
 * Handles registration form functionality, password visibility toggle, and validation
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

    // Auto remove after 5 seconds for info, 3 seconds for others
    const duration = type === 'info' ? 5000 : 3000;
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 200);
    }, duration);
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('formAuthentication');

    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate all fields are filled
            if (!username) {
                showToast('Please enter a username', 'error');
                document.getElementById('username').focus();
                return false;
            }

            if (!email) {
                showToast('Please enter your email address', 'error');
                document.getElementById('email').focus();
                return false;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address', 'error');
                document.getElementById('email').focus();
                return false;
            }

            if (!password) {
                showToast('Please enter a password', 'error');
                document.getElementById('password').focus();
                return false;
            }

            if (!confirmPassword) {
                showToast('Please confirm your password', 'error');
                document.getElementById('confirmPassword').focus();
                return false;
            }

            // Check if passwords match
            if (password !== confirmPassword) {
                showToast('Passwords do not match. Please try again.', 'error');
                document.getElementById('confirmPassword').focus();
                return false;
            }

            // Send registration data to backend
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: username,  // Backend expects 'name' field
                        email: email,
                        password: password,
                        username: username  // Also send username for future use
                    })
                });

                const result = await response.json();

                if (result.success) {
                    showToast(result.message || 'Account created successfully!', 'success');
                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showToast(result.error || 'Registration failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showToast('Connection error. Please check if the server is running.', 'error');
            }
        });

        // Remove real-time password match validation that uses setCustomValidity
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function () {
                // Clear any custom validity
                this.setCustomValidity('');
            });
        }
    }
});
