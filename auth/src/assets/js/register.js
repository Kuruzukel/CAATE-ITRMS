/**
 * CAATE Register Page JavaScript
 * Handles registration form functionality, password visibility toggle, and validation
 */

// Toggle password visibility for multiple password fields - MUST be global for onclick to work
window.togglePassword = function (inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);

    if (!passwordInput || !toggleIcon) {
        console.error('Password input or toggle icon not found:', inputId, iconId);
        return;
    }

    // Get current value and type
    const currentValue = passwordInput.value;
    const currentType = passwordInput.type;

    console.log('Toggle clicked for:', inputId, '- Current type:', currentType);

    // Create a new input element with opposite type
    const newInput = document.createElement('input');
    newInput.type = currentType === 'password' ? 'text' : 'password';
    newInput.id = inputId;
    newInput.name = inputId;
    newInput.className = 'form-control password-input-with-icon';
    newInput.placeholder = inputId === 'password' ? 'Enter your password' : 'Confirm your password';
    newInput.setAttribute('aria-describedby', inputId);
    newInput.setAttribute('autocomplete', 'new-password');
    newInput.setAttribute('required', 'required');
    newInput.value = currentValue;

    // Replace the old input with the new one
    passwordInput.parentNode.replaceChild(newInput, passwordInput);

    // Update icon
    if (newInput.type === 'text') {
        toggleIcon.classList.remove('bx-hide');
        toggleIcon.classList.add('bx-show');
        console.log('Password now VISIBLE:', newInput.value);
    } else {
        toggleIcon.classList.remove('bx-show');
        toggleIcon.classList.add('bx-hide');
        console.log('Password now HIDDEN');
    }

    // Focus the new input
    newInput.focus();
    // Move cursor to end
    newInput.setSelectionRange(newInput.value.length, newInput.value.length);
};

// Password validation function
function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('formAuthentication');

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsCheckbox = document.getElementById('terms-conditions');

            // Check if passwords match
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match. Please try again.');
                return false;
            }

            // Validate password strength
            if (!validatePassword(password)) {
                e.preventDefault();
                alert('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
                return false;
            }

            // Check if terms are accepted
            if (!termsCheckbox.checked) {
                e.preventDefault();
                alert('Please agree to the privacy policy and terms to continue.');
                return false;
            }

            // If all validations pass, form will submit
        });

        // Real-time password match validation
        const confirmPasswordInput = document.getElementById('confirmPassword');
        confirmPasswordInput.addEventListener('input', function () {
            const password = document.getElementById('password').value;
            const confirmPassword = this.value;

            if (confirmPassword && password !== confirmPassword) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});
