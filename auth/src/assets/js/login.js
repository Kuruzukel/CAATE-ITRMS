/**
 * CAATE Login Page JavaScript
 * Handles login form functionality and password visibility toggle
 */

// API Base URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/backend/public';

// Toggle password visibility - MUST be global for onclick to work
window.togglePassword = function () {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    if (!passwordInput || !toggleIcon) {
        console.error('Password input or toggle icon not found');
        return;
    }

    // Get current value and type
    const currentValue = passwordInput.value;
    const isCurrentlyPassword = passwordInput.type === 'password';

    console.log('BEFORE Toggle - Type:', passwordInput.type, 'Value:', currentValue);

    // Create a new input element with opposite type
    const newInput = document.createElement('input');
    newInput.type = isCurrentlyPassword ? 'text' : 'password';
    newInput.id = 'password';
    newInput.name = 'password';
    // Use different class when visible
    newInput.className = isCurrentlyPassword ? 'form-control password-visible' : 'form-control password-input-with-icon';
    newInput.placeholder = 'Enter your password';
    newInput.setAttribute('aria-describedby', 'password');
    newInput.setAttribute('autocomplete', 'current-password');
    newInput.value = currentValue;

    // Add inline styles to force visibility
    if (isCurrentlyPassword) {
        newInput.style.webkitTextSecurity = 'none';
        newInput.style.MozTextSecurity = 'none';
        newInput.style.textSecurity = 'none';
        newInput.style.fontFamily = "'Public Sans', sans-serif";
        newInput.style.paddingRight = '45px';
    }

    // Replace the old input with the new one
    passwordInput.parentNode.replaceChild(newInput, passwordInput);

    // Update icon
    if (isCurrentlyPassword) {
        // Was password, now showing as text
        toggleIcon.classList.remove('bx-hide');
        toggleIcon.classList.add('bx-show');
        console.log('AFTER Toggle - Password now VISIBLE as TEXT. Type:', newInput.type, 'Value:', newInput.value);
    } else {
        // Was text, now hiding as password
        toggleIcon.classList.remove('bx-show');
        toggleIcon.classList.add('bx-hide');
        console.log('AFTER Toggle - Password now HIDDEN. Type:', newInput.type);
    }

    // Focus the new input
    newInput.focus();
    // Move cursor to end
    newInput.setSelectionRange(newInput.value.length, newInput.value.length);
};

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
        <button class="toast-close" onclick="closeToast(this)">
            <i class="bx bx-x"></i>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) closeToast(closeBtn);
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

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const passwordInput = document.getElementById('password');
            const identifier = emailInput.value.trim();
            const password = passwordInput.value;

            // Validation
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
                    showToast(result.error || 'Invalid credentials', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showToast('Connection error. Please check if the server is running.', 'error');
            }
        });
    }
});
