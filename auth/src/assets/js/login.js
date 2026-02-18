/**
 * CAATE Login Page JavaScript
 * Handles login form functionality and password visibility toggle
 */

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

// Form validation and submission
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('formAuthentication');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            // Add any custom validation or processing here
            // For now, let the form submit naturally
        });
    }
});
